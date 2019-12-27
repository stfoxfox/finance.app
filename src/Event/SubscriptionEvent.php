<?php

namespace App\Event;

use App\Entity\Subscription;
use Symfony\Component\EventDispatcher\Event;

/**
 * класс событий для подписок
 */
class SubscriptionEvent extends Event
{
    const SUCCESSFUL_SUBSCRIPTION = 'subscription.successful';
    const FAILED_SUBSCRIPTION = 'subscription.failed';

    protected $subscription;

    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription;
    }

    public function getSubscription()
    {
        return $this->subscription;
    }
}
