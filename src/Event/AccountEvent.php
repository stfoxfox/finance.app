<?php

namespace App\Event;

use App\Entity\Account;
use Symfony\Component\EventDispatcher\Event;

/**
 * класс событий для счетов
 */
class AccountEvent extends Event
{
    const CREATE_ACCOUNT = 'account.create';
    const REFILL = 'account.refill';

    protected $account;

    public function __construct(Account $account)
    {
        $this->account = $account;
    }

    public function getAccount()
    {
        return $this->account;
    }
}
