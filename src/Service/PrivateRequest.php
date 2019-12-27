<?php

namespace App\Service;

use App\Entity\Account;
use App\Entity\Subscription;
use App\Entity\Transaction;
use App\Entity\User;
use App\Event\AccountEvent;
use App\Event\SubscriptionEvent;
use App\Event\TransactionEvent;
use Ramsey\Uuid\Uuid;
use Symfony\Component\EventDispatcher\GenericEvent;
use App\Service\Helper\Request;
use App\Service\Helper\Response;

/**
 * класс, обрабатывающий запросы от приватного API
 */
class PrivateRequest extends Request
{
    /**
     * получение баланса счёта.
     * В json строке находим UUID счёта.
     * Если такого счёта нет или не передан UUID, записываем в ответ ошибку
     * Иначе записываем в ответ баланс счёта
     * @return self
     */
    public function getBalanceAccount()
    {
        if (isset(json_decode($this->getRequest())->data) &&
            isset(json_decode($this->getRequest())->data->uuid)
        ) {
            $uuid = json_decode($this->getRequest())->data->uuid;
            if (!Uuid::isValid($uuid)) {
                $this->setResponse(new Response('uuid is not valid', 587, ''));
                return $this;
            }

            $account = $this->em->getRepository(Account::class)->find($uuid);
            if ($account !== null) {
                $this->setResponse(new Response('balance-account', 0, json_encode(['balance' => $account->getBalance()])));
            } else {
                $this->setResponse(new Response('not found account', 54, ''));
            }
        } else {
            $this->setResponse(new Response('uuid not set', '3423', ''));
        }

        return $this;
    }

    /**
     * создание транзакции
     * В json строке находим UUID счёта получателя, тип счёта получателя и сумму транзакции.
     * Если хотя бы одного реквизита нет - записываем в ответ ошибку.
     * Проверяем на наличие UUID счёта получателя. Если его нет - записываем в ответ ошибку.
     * В json строке находим UUID счёта отправителя и тип счёта получателя.
     * Если эти параметры существуют, но такого счёта нету - записываем в ответ ошибку.
     * Если эти параметры существуют, но баланс отправителя меньше суммы транзакции - записываем в ответ ошибку.
     * Иначе сохраняем транзакцию и вызываем событие уведомления о создании транзакции
     * Записываем в ответ UUID транзакции
     * @return self
     */
    public function createTransaction()
    {
        if (
            isset(json_decode($this->request)->data) &&
            isset(json_decode($this->request)->data->recipient_account_uuid) &&
            isset(json_decode($this->request)->data->recipient_account_type) &&
            isset(json_decode($this->request)->data->operation_sum)
        ) {
            $recipient_account_uuid = json_decode($this->request)->data->recipient_account_uuid;
            if (!Uuid::isValid($recipient_account_uuid)) {
                $this->setResponse(new Response('recipient account uuid is not valid', 587, ''));
                return $this;
            }

            $recipient_account_type = json_decode($this->request)->data->recipient_account_type;
            $operation_sum = json_decode($this->request)->data->operation_sum;

            $recipient = $this->em->getRepository(Account::class)->find($recipient_account_uuid);
            if ($recipient !== null) {

                $sender = null;
                $sender_account_type = null;

                $account_uuid = isset(json_decode($this->request)->data->account_uuid) ?
                json_decode($this->request)->data->account_uuid :
                null;

                $account = null;
                if ($account_uuid !== null) {
                    if (!Uuid::isValid($account_uuid)) {
                        $this->setResponse(new Response('account uuid is not valid', 587, ''));
                        return $this;
                    }
                    $account = $this->em->getRepository(Account::class)->find(json_decode($this->request)->data->account_uuid);
                }

                $information = isset(json_decode($this->request)->data->information) ?
                json_decode($this->request)->data->information :
                '';

                $category = isset(json_decode($this->request)->data->category) ?
                json_decode($this->request)->data->category :
                0;

                if (
                    isset(json_decode($this->request)->data->sender_account_uuid) &&
                    isset(json_decode($this->request)->data->sender_account_type)
                ) {
                    $sender_account_uuid = json_decode($this->request)->data->sender_account_uuid;
                    $sender_account_type = json_decode($this->request)->data->sender_account_type;

                    if ($sender_account_uuid !== null) {
                        if (!Uuid::isValid($sender_account_uuid)) {
                            $this->setResponse(new Response('sender account uuid is not valid', 587, ''));
                            return $this;
                        }
                        $account = $this->em->getRepository(Account::class)->find(json_decode($this->request)->data->account_uuid);
                    }

                    $sender = $this->em->getRepository(Account::class)->find($sender_account_uuid);
                    if ($sender === null) {
                        $this->setResponse(new Response('sender account not found', 45, ''));
                        return $this;
                    }
                }

                if ($sender !== null) {
                    if ($sender->getBalance() < $operation_sum) {
                        $this->setResponse(new Response('insufficient funds', 854, ''));
                        return $this;
                    }
                }

                $transaction = new Transaction();
                $transaction->setSenderAccount($sender)
                    ->setSenderAccountType($sender_account_type)
                    ->setRecipientAccount($recipient)
                    ->setRecipientAccountType($recipient_account_type)
                    ->setAccount($account)
                    ->setInformation($information)
                    ->setOperationCategory($category)
                    ->setOperationSum($operation_sum)
                    ->setOperationStatus(Transaction::STATUS_CREATE)
                    ->setCreatedAt()
                    ->setUpdatedAt();

                $this->em->persist($transaction);
                $this->em->flush();

                $event = new GenericEvent($transaction);
                $this->eventDispatcher->dispatch(TransactionEvent::CREATE_TRANSACTION, $event);

                if ($recipient !== null) {
                    $event = new GenericEvent($recipient);
                    $this->eventDispatcher->dispatch(AccountEvent::REFILL, $event);
                }

                $this->setResponse(new Response('create-transaction', 0, json_encode(['uuid' => $transaction->getUuid()])));

            } else {
                $this->setResponse(new Response('recipient account not found', 6564, ''));
            }
        } else {
            $this->setResponse(new Response('not found data', 45, ''));
        }

        return $this;

    }

    /**
     * создание подписки
     * В json строке находим UUID счёта, периодичность, тип переодичности, сумму подписки.
     * Если хотя бы одного из параметров нет - записываем в ответ ошибку.
     * Проверяем на наличие UUID счёта. Если его нет - записываем в ответ ошибку.
     * Иначе сохраняем подписку и вызываем событие уведомления об успешной подписке.
     * Записываем в ответ UUID подписки
     * @return self
     */
    public function createSubscription()
    {
        if (
            isset(json_decode($this->getRequest())->data) &&
            isset(json_decode($this->getRequest())->data->account_uuid) &&
            isset(json_decode($this->getRequest())->data->periodicity) &&
            isset(json_decode($this->getRequest())->data->periodicity_type) &&
            isset(json_decode($this->getRequest())->data->sum)
        ) {
            $account_uuid = json_decode($this->getRequest())->data->account_uuid;
            $periodicity = json_decode($this->getRequest())->data->periodicity;
            $periodicity_type = json_decode($this->getRequest())->data->periodicity_type;
            $sum = json_decode($this->getRequest())->data->sum;
            $information = isset(json_decode($this->getRequest())->data->information) ?
            json_decode($this->getRequest())->data->information :
            '';

            if (!Uuid::isValid($account_uuid)) {
                $this->setResponse(new Response('account uuid not valid', 54, ''));
                return $this;
            }

            $account = $this->em->getRepository(Account::class)->find($account_uuid);
            if ($account !== null) {
                $subscription = new Subscription();
                $subscription->setPeriodicity($periodicity)
                    ->setAccount($account)
                    ->setAccountType($account->getOwnerType())
                    ->setPeriodicityType($periodicity_type)
                    ->setSum($sum)
                    ->setCategory(1)
                    ->setStatus(Subscription::STATUS_ACTIVE);

                $this->em->persist($subscription);
                $this->em->flush();

                $event = new GenericEvent($subscription);
                $this->eventDispatcher->dispatch(SubscriptionEvent::SUCCESSFUL_SUBSCRIPTION, $event);

                $this->setResponse(new Response('create-subcription', 0, json_encode(['uuid' => $subscription->getUuid()])));
            } else {
                $this->setResponse(new Response('this account not found', 3453, ''));
            }
        } else {
            $this->setResponse(new Response('dont have value', 34534, ''));
        }

        return $this;
    }

    /**
     * отмена подписки
     * В json строке находим UUID подписки.
     * Если его нет - записываем в ответ ошибку.
     * Проверяем на наличие подписки. Если его нет - записываем в ответ ошибку.
     * Иначе изменяем статус подписки на неактивный и сохраняем.
     * Записываем в ответ UUID подписки
     * @return self
     */
    public function cancelSubscription()
    {
        if (
            isset(json_decode($this->getRequest())->data) &&
            isset(json_decode($this->getRequest())->data->subscription_uuid)
        ) {
            $uuid = json_decode($this->getRequest())->data->subscription_uuid;
            if (!Uuid::isValid($uuid)) {
                $this->setResponse(new Response('subscription uuid is not valid', 85, ''));
                return $this;
            }

            $subscription = $this->em->getRepository(Subscription::class)->find($uuid);
            if ($subscription !== null) {
                $subscription->setStatus(Subscription::STATUS_INACTIVE);

                $this->em->persist($subscription);
                $this->em->flush();
                $this->setResponse(new Response('cancel-subscription', 0, json_encode(['uuid' => $uuid])));
            } else {
                $this->setResponse(new Response('this subscription not found', 6654, ''));
            }

        } else {
            $this->setResponse(new Response('dont have value', 34534, ''));
        }

        return $this;
    }

    /**
     * создание счёта
     * В json строке находим UUID пользователя, тип пользователя и периодичность.
     * Если нету хотя бы одного параметра - записываем в ответ ошибку
     * Проверяем на наличие пользователя. Если его нет - записываем ошибку
     * Иначе сохраняем счёт и вызываем событие уведомления о создании счёта
     * Записываем в ответ UUID счёта
     * @return self
     */
    public function createAccount()
    {
        if (
            isset(json_decode($this->getRequest())->data) &&
            isset(json_decode($this->getRequest())->data->owner_uuid) &&
            isset(json_decode($this->getRequest())->data->owner_type) &&
            isset(json_decode($this->getRequest())->data->periodicity)
        ) {
            $owner_uuid = json_decode($this->getRequest())->data->owner_uuid;
            $owner_type = json_decode($this->getRequest())->data->owner_type;
            $periodicity = json_decode($this->getRequest())->data->periodicity;
            $balance = isset(json_decode($this->getRequest())->data->balance) ?
            json_decode($this->getRequest())->data->balance :
            0;
            $information = isset(json_decode($this->getRequest())->data->information) ?
            json_decode($this->getRequest())->data->information :
            '';

            if (!Uuid::isValid($owner_uuid)) {
                $this->setResponse(new Response('owner uuid is not valid', 89, ''));
                return $this;
            }

            $owner = $this->em->getRepository(User::class)->find($owner_uuid);
            if ($owner !== null) {
                $account = new Account();
                $account->setOwnerType($owner_type)
                    ->setBalance($balance)
                    ->setOwner($owner)
                    ->setInformation($information)
                    ->setPendingSum(0)
                    ->setCurrency(0)
                    ->setCreatedAt()
                    ->setUpdatedAt();

                $this->em->persist($account);
                $this->em->flush();

                $event = new GenericEvent($account);
                $this->eventDispatcher->dispatch(AccountEvent::CREATE_ACCOUNT, $event);

                $this->setResponse(new Response('create-account', 0, json_encode(['uuid' => $account->getUuid()])));
            } else {
                $this->setResponse(new Response('this account not found', 6654, ''));
            }
        } else {
            $this->setResponse(new Response('dont have value', 34534, ''));
        }

        return $this;
    }
}
