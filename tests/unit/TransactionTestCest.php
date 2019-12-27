<?php

use App\Entity\Transaction;
use Ramsey\Uuid\Uuid;

class TransactionTestCest
{
    public function setAccountUuid(UnitTester $I)
    {
        $transaction = new Transaction();
        
        $account_uuid = 124545;
        $transaction->setAccountUuid($account_uuid);
        $I->assertFalse(Uuid::isValid($transaction->getAccountUuid()));

        $account_uuid = 'bc02c02f-d9ef-4028-a496-6e110a3d6afc';
        $transaction->setAccountUuid($account_uuid);
        $I->assertTrue(Uuid::isValid($transaction->getAccountUuid()));
    }

    public function setSenderAccountUuid(UnitTester $I)
    {
        $transaction = new Transaction();
        
        $sender_account_uuid = 124545;
        $transaction->setSenderAccountUuid($sender_account_uuid);
        $I->assertFalse(Uuid::isValid($transaction->getSenderAccountUuid()));

        $sender_account_uuid = 'bc02c02f-d9ef-4028-a496-6e110a3d6afc';
        $transaction->setSenderAccountUuid($sender_account_uuid);
        $I->assertTrue(Uuid::isValid($transaction->getSenderAccountUuid()));
    }

    public function setRecipientAccountUuid(UnitTester $I)
    {
        $transaction = new Transaction();
        
        $recipient_account_uuid = 124545;
        $transaction->setRecipientAccountUuid($recipient_account_uuid);
        $I->assertFalse(Uuid::isValid($transaction->getRecipientAccountUuid()));

        $recipient_account_uuid = 'bc02c02f-d9ef-4028-a496-6e110a3d6afc';
        $transaction->setRecipientAccountUuid($recipient_account_uuid);
        $I->assertTrue(Uuid::isValid($transaction->getRecipientAccountUuid()));
    }



}
