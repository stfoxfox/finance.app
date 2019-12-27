<?php

namespace App\Event;

use App\Entity\Transaction;
use Symfony\Component\EventDispatcher\Event;

/**
 * класс событий для транзакций
 */
class TransactionEvent extends Event
{
    const CREATE_TRANSACTION = 'transaction.create';

    protected $transaction;

    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
    }

    public function getTransaction()
    {
        return $this->transaction;
    }
}
