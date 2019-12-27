<?php

use App\Entity\Subscription;
use Ramsey\Uuid\Uuid;

class SubscriptionTestCest
{

    public function setAccountUuid(UnitTester $I)
    {
        $subscription = new Subscription();
        
        $account_uuid = 124545;
        $subscription->setAccountUuid($account_uuid);
        $I->assertFalse(Uuid::isValid($subscription->getAccountUuid()));

        $account_uuid = 'bc02c02f-d9ef-4028-a496-6e110a3d6afc';
        $subscription->setAccountUuid($account_uuid);
        $I->assertTrue(Uuid::isValid($subscription->getAccountUuid()));
    }
}
