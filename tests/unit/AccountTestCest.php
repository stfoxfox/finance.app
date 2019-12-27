<?php

use App\Entity\Account;
use Ramsey\Uuid\Uuid;

class AccountTestCest
{

    public function setOwnerUuid(UnitTester $I)
    {
        $account = new Account();

        $owner_uuid = 124545;
        $account->setOwnerUuid($owner_uuid);
        $I->assertFalse(Uuid::isValid($account->getOwnerUuid()));

        $owner_uuid = 'bc02c02f-d9ef-4028-a496-6e110a3d6afc';
        $account->setOwnerUuid($owner_uuid);
        $I->assertTrue(Uuid::isValid($account->getOwnerUuid()));
    }

}
