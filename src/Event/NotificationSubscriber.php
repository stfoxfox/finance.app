<?php

namespace App\Event;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;

/**
 * класс уведомлений
 */
class NotificationSubscriber implements EventSubscriberInterface
{

    /**
     * массив всех событий
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return array(
            AccountEvent::CREATE_ACCOUNT => 'onCreateAccount',
            AccountEvent::REFILL => 'onRefill',
            SubscriptionEvent::SUCCESSFUL_SUBSCRIPTION => 'onSuccessfulSubscription',
            SubscriptionEvent::FAILED_SUBSCRIPTION => 'onFailedSubscription',
            TransactionEvent::CREATE_TRANSACTION => 'onCreateTransaction',
        );
    }

    /**
     * уведомление о создании новой транзакции
     * @param TransactionEvent $event
     */
    public function onCreateTransaction(GenericEvent $event)
    {
        $transaction = $event->getSubject();
    }

    /**
     * уведомление о создании аккаунта
     * @param AccountEvent $event
     */
    public function onCreateAccount(GenericEvent $event)
    {
        $account = $event->getSubject();
    }

    /**
     * уведомление о пополнении счёта
     * @param AccountEvent $event
     */
    public function onRefill(GenericEvent $event)
    {

    }

    /**
     * уведомление о списании по подписке удачное
     * @param SubscriptionEvent $event
     */
    public function onSuccessfulSubscription(GenericEvent $event)
    {

    }

    /**
     * уведомление о списание по подписке неудачное
     * @param function SubscriptionEvent $event
     */
    public function onFailedSubscription(GenericEvent $event)
    {

    }
}
