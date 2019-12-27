<?php

namespace App\Controller;

use App\Controller\TokenAuthenticatedController;
use App\Entity\OutpayType;
use App\Entity\Transaction;
use App\Event\TransactionEvent;
use App\Form\TransactionForm;
use App\Form\WalletForm;
use App\Repository\AccountRepository;
use Braintree_ClientToken;
use Braintree_Configuration;
use Braintree_Customer;
use Braintree_Exception_NotFound;
use Braintree_PaymentMethod;
use Braintree_Transaction;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Cache\Adapter\RedisAdapter;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Translation\TranslatorInterface;
use App\Repository\TransactionRepository;

class BalanceController extends Controller implements TokenAuthenticatedController
{
    /**
     * страница история транзакций
     * @param Request $request
     */
    public function index(Request $request, TransactionRepository $transactions)
    {
        $jwt = json_decode($request->cookies->get($this->container->getParameter('authentication_cookie_name')))->jwt;
        $userUuid = $this->container->get('service.token')->getUserUuid($jwt);

        $account = $this->getDoctrine()->getRepository('App:Account')->findOneBy(['owner_uuid' => $userUuid]);
        return $this->render('balance/index.html.twig', [
            'controller_name' => 'Konstruktor.com | Main page',
            'transactions' => $transactions->findBy(['account' => $account]),
        ]);
    }

    /**
     * страница вывод средств
     * @param Request $request
     */
    public function windrawal(Request $request)
    {
        $jwt = json_decode($request->cookies->get($this->container->getParameter('authentication_cookie_name')))->jwt;
        $userUuid = $this->container->get('service.token')->getUserUuid($jwt);

        $payeer = $this->get('service.utillity.payeer');
        $balance = $payeer->getBalance()['balance']['USD'];
        $pay_systems = [];
        foreach ($payeer->getPaySystems()['list'] as $pay_system) {
            if (in_array('USD', $pay_system['currencies'])) {
                $wallet = $this->getDoctrine()->getRepository('App:OutpayType')->findOneBy(['owner_uuid' => $userUuid, 'type' => $pay_system['id']]);
                
                $pay_systems[] = [
                    'user_wallet' => [
                        'id' => $wallet !== null ? $wallet->getData() : null,
                    ],
                    'wallet' => $pay_system,
                ];
            }
        }
        
        $walletForm = $this->createForm(WalletForm::class);

        return $this->render('balance/windrawal.html.twig', [
            'controller_name' => 'Konstruktor.com | Windrawal',
            'pay_systems' => $pay_systems,
            'wallet_form' => $walletForm->createView(),
        ]);
    }

    /**
     * страница пополнения счёта
     * @param Request $request
     * @param AccountRepository $accountRepository
     * @param EventDispatcherInterface $eventDispatcher
     * @param TranslatorInterface $translator
     */
    public function replenish(Request $request, AccountRepository $accountRepository, EventDispatcherInterface $eventDispatcher, TranslatorInterface $translator)
    {
        $jwt = json_decode($request->cookies->get($this->container->getParameter('authentication_cookie_name')))->jwt;
        $userUuid = $this->container->get('service.token')->getUserUuid($jwt);

        Braintree_Configuration::environment($this->container->getParameter('braintree_environment'));
        Braintree_Configuration::merchantId($this->container->getParameter('braintree_merchant_id'));
        Braintree_Configuration::publicKey($this->container->getParameter('braintree_public_key'));
        Braintree_Configuration::privateKey($this->container->getParameter('braintree_private_key'));

        $nonceFromTheClient = $request->request->get('payment_method_nonce');
        if (!empty($nonceFromTheClient)) {
            $payment = Braintree_PaymentMethod::create([
                'customerId' => $userUuid,
                'paymentMethodNonce' => $nonceFromTheClient,
            ]);
        }

        try {
            $customer = Braintree_Customer::find($userUuid);
            $customer = Braintree_Customer::update($userUuid, []);
        } catch (Braintree_Exception_NotFound $e) {
            $customer = Braintree_Customer::create(['id' => $userUuid]);
        }

        if ($customer->success) {
            $customer = $customer->customer;
        }

        $clientToken = Braintree_ClientToken::generate();

        $transaction = new Transaction();

        $jwt = json_decode($request->cookies->get($this->container->getParameter('authentication_cookie_name')))->jwt;
        $userUuid = $this->container->get('service.token')->getUserUuid($jwt);

        $recipientAccount = $accountRepository->findOneBy(['owner_uuid' => $userUuid]);

        $transaction->setRecipientAccount($recipientAccount)
            ->setRecipientAccountType(1)
            ->setOperationCategory(1)
            ->setOperationStatus(Transaction::STATUS_CREATE)
            ->setAccount($recipientAccount)
            ->setRecipientAccount($recipientAccount)
            ->setInformation('Replenish funds')
            ->setCreatedAt()
            ->setUpdatedAt();

        $form = $this->createForm(TransactionForm::class, $transaction);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            if($transaction->getOperationSum() === null || $transaction->getOperationSum() < 0){
                $data['success'] = false;
                $data['error'] = $translator->trans('Amount is required');
                return new JsonResponse($data);
            }

            $paymentMethod = $request->request->get('payment_method');
            if (!empty($paymentMethod)) {
                $payment = null;
                foreach ($customer->paymentMethods as $payment) {
                    if ($payment->token == $paymentMethod) {
                        break;
                    }
                }
                if ($payment !== null) {
                    $result = Braintree_Transaction::sale(array(
                        'paymentMethodToken' => $payment->token,
                        'amount' => $transaction->getOperationSum(),
                    ));

                    $em = $this->getDoctrine()->getManager();
                    $em->persist($transaction);
                    $em->flush();

                    $event = new GenericEvent($transaction);
                    $eventDispatcher->dispatch(TransactionEvent::CREATE_TRANSACTION, $event);

                    $data['success'] = true;
                    $data['message'] = $translator->trans('Payment successfuly');
                    return new JsonResponse($data);
                }
            }else {
                $data['success'] = false;
                $data['error'] = $translator->trans('Unable to find payment method');
                return new JsonResponse($data);
            }
        }
        return $this->render('balance/replenish.html.twig', [
            'controller_name' => 'Konstruktor.com | Replenish',
            'clientToken' => $clientToken,
            'form' => $form->createView(),
            'customer' => $customer,
        ]);
    }

    /**
     * получение доступный кошельков для вывод стредств ajax
     * @param Request $request
     */
    public function getWallet(Request $request)
    {
        $jwt = json_decode($request->cookies->get($this->container->getParameter('authentication_cookie_name')))->jwt;
        $userUuid = $this->container->get('service.token')->getUserUuid($jwt);

        $type = $request->request->get('type');

        $wallet = $this->getDoctrine()->getManager()->getRepository('App:OutpayType')->findOneBy([
            'owner_uuid' => $userUuid,
            'type' => $type,
        ]);

        $data['success'] = true;
        $data['wallet'] = $wallet !== null ? $wallet->getData() : null;

        return new JsonResponse($data);
    }

    /**
     * Сохранение кошелька
     * @param Request $request
     * @param TranslatorInterface $translator
     */
    public function saveWallet(Request $request, TranslatorInterface $translator)
    {
        $form = $this->createForm(WalletForm::class);
        $form->handleRequest($request);

        $data['success'] = false;
        $data['data'] = [];

        $jwt = json_decode($request->cookies->get($this->container->getParameter('authentication_cookie_name')))->jwt;
        $userUuid = $this->container->get('service.token')->getUserUuid($jwt);

        if ($form->isSubmitted() && $form->isValid()) {
            $walletData = $form->getData();
            $wallet = $walletData['wallet'];
            $type = $walletData['type'];
            $smsCode = $walletData['sms_code'];

            $code = null;
            $redis = RedisAdapter::createConnection(
                $this->container->getParameter('redis_dns') . ':' .
                $this->container->getParameter('redis_port') . "/" .
                $this->container->getParameter('redis_database')
            );

            $code = $redis->get($userUuid . '-sms-code');

            if (strlen($wallet) < 4) {
                $data['error'] = $translator->trans('Incorrect wallet number');
            } else if ($code == null || $code !== $smsCode) {
                $data['error'] = $translator->trans('Wrong Sms Code');
            } else {
                $payeer = $this->get('service.utillity.payeer');
                $pay_types = [];
                foreach ($payeer->getPaySystems()['list'] as $pay_system) {
                    if (in_array('USD', $pay_system['currencies'])) {
                        $pay_types[] = $pay_system['id'];
                    }
                }

                if (!in_array($type, $pay_types)) {
                    $data['error'] = $translator->trans('Wrong wallet type id');
                } else {
                    $data['success'] = true;

                    $em = $this->getDoctrine()->getManager();

                    $outpayType = $em->getRepository('App:OutpayType')->findOneBy(['owner_uuid' => $userUuid, 'type' => $type]);

                    if ($outpayType == null) {
                        $outpayType = new OutpayType();
                    }

                    $outpayType->setOwnerUuid($userUuid)
                        ->setType($type)
                        ->setData($wallet)
                        ->setCreatedAt()
                        ->setConfirmedAt();

                    $em->persist($outpayType);
                    $em->flush();
                }

            }
        }

        return new JsonResponse($data);
    }

    /**
     * перевод средств
     * @param Request $request
     * @param TranslatorInterface $translator
     */
    public function windrawalProcess(Request $request, TranslatorInterface $translator)
    {
        $wallet_id = $request->request->get('wallet_id');
        $smscode = $request->request->get('smscode');
        $amount = $request->request->get('amount');
        $data['success'] = false;
        $data['data'] = [];
        if ((int) $amount < 0) {
            $data['error'] = $translator->trans('Amount is required');
        } else {
            $payeer = $this->get('service.utillity.payeer');
            $pay_types = [];
            foreach ($payeer->getPaySystems()['list'] as $pay_system) {
                if (in_array('USD', $pay_system['currencies'])) {
                    $pay_types[] = $pay_system['id'];
                }
            }
            $jwt = json_decode($request->cookies->get($this->container->getParameter('authentication_cookie_name')))->jwt;
            $userUuid = $this->container->get('service.token')->getUserUuid($jwt);

            $code = null;
            $redis = RedisAdapter::createConnection(
                $this->container->getParameter('redis_dns') . ':' .
                $this->container->getParameter('redis_port') . "/" .
                $this->container->getParameter('redis_database')
            );

            $code = $redis->get($userUuid . '-sms-code');

            $wallet = $this->getDoctrine()->getManager()->getRepository('App:OutpayType')->findOneBy(['owner_uuid' => $userUuid, 'data' => $wallet_id]);
            $account = $this->getDoctrine()->getManager()->getRepository('App:Account')->findOneBy(['owner_uuid' => $userUuid]);
            if ($wallet === null) {
                $data['error'] = $translator->trans('Wrong wallet id');
            } else if ($account->getBalance() < $amount) {
                $data['error'] = $translator->trans('Insufficient funds on personal account');
            } elseif ($code === null || $smscode !== $code) {
                $data['error'] = $translator->trans('Wrong Sms Code');
            } else {
                $initOutput = $payeer->initOutput([
                    'ps' => $wallet->getType('type'),
                    'curIn' => 'USD',
                    'curOut' => 'USD',
                    'sumOut' => $amount,
                    'param_ACCOUNT_NUMBER' => $wallet->getData(),
                    'param_CONTACT_PERSON' => 'evgenii',
                ]);
                if ($initOutput) {
                    $historyId = $payeer->output();
                    if ($historyId > 0) {
                        $data['success'] = true;
                        $transaction = new Transaction();
                        $transaction->setSenderAccount($account)
                            ->setRecipientAccountType(1)
                            ->setOperationCategory(1)
                            ->setOperationStatus(Transaction::STATUS_CREATE)
                            ->setAccount($account)
                            ->setInformation('Withdrawals funds')
                            ->setOperationSum($amount)
                            ->setCreatedAt()
                            ->setUpdatedAt();

                        $em = $this->getDoctrine()->getManager();
                        $em->persist($transaction);
                        $em->flush();

                        $data['message'] = $translator->trans('Funds are sent to the conclusion');
                    } else {
                        $data['error'] = $translator->trans('Internal error, please try again later.');
                        $data['errors'] = $payeer->getErrors();
                    }
                } else {
                    $data['error'] = $translator->trans('Internal error, please try again later.');
                    $data['errors'] = $payeer->getErrors();
                }
            }
        }

        return new JsonResponse($data);
    }

    /**
     * отправка смс (пока что только сохранение в redis)
     * @param Request $request
     */
    public function sendSms(Request $request)
    {
        $data['success'] = true;
        $smsCode = rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);
        $data['code'] = $smsCode;

        $jwt = json_decode($request->cookies->get($this->container->getParameter('authentication_cookie_name')))->jwt;
        $userUuid = $this->container->get('service.token')->getUserUuid($jwt);

        $redis = RedisAdapter::createConnection(
            $this->container->getParameter('redis_dns') . ':' .
            $this->container->getParameter('redis_port') . "/" .
            $this->container->getParameter('redis_database')
        );

        $redis->set($userUuid . '-sms-code', $smsCode);
        $redis->expire($userUuid . '-sms-code', 180);

        return new JsonResponse($data);
    }

    /**
     * тестовый action
     * @return JsonResponse
     */
    public function test()
    {
        $item = $this->getDoctrine()->getManager()->getRepository('App:Transaction')->findOneBy(['uuid' => 'd66857d9-b369-4469-8466-8b5c9c25b08f']);

        return new JsonResponse($item);
    }
}
