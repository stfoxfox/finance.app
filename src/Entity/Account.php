<?php

namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AccountRepository")
 */
class Account
{
    /**
     * @var \Ramsey\Uuid\UuidInterface
     *
     * @ORM\Id()
     * @ORM\Column(type="uuid", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    private $uuid;

    /**
     * @ORM\Column(type="uuid", nullable=true)
     */
    private $owner_uuid;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $owner_type;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2)
     */
    private $balance;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2)
     */
    private $pending_sum;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $currency;

    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    private $information;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updated_at;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Subscription", mappedBy="account")
     */
    private $subscriptions;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Transaction", mappedBy="sender_account")
     */
    private $sender_transactions;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Transaction", mappedBy="recipient_account")
     */
    private $recipient_transactions;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Transaction", mappedBy="account")
     */
    private $transactions;

    /**
     * типы пользователя
     */
    const OWNER_TYPE_USER = 1;
    const OWNER_TYPE_COMMUNITY = 2;
    const OWNER_TYPE_INVESTMENT = 3;

    public function __construct()
    {
        $this->subscriptions = new ArrayCollection();
        $this->sender_transactions = new ArrayCollection();
        $this->recipient_transactions = new ArrayCollection();
        $this->transactions = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): self
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getOwnerUuid(): ?string
    {
        return $this->owner_uuid;
    }

    public function setOwnerUuid(string $owner_uuid): self
    {
        $this->owner_uuid = $owner_uuid;

        return $this;
    }

    public function getOwnerType(): ?int
    {
        return $this->owner_type;
    }

    public function setOwnerType(int $owner_type): self
    {
        $this->owner_type = $owner_type;

        return $this;
    }

    public function getBalance()
    {
        return $this->balance;
    }

    public function setBalance($balance): self
    {
        $this->balance = $balance;

        return $this;
    }

    public function getPendingSum()
    {
        return $this->pending_sum;
    }

    public function setPendingSum($pending_sum): self
    {
        $this->pending_sum = $pending_sum;

        return $this;
    }

    public function getCurrency(): ?string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): self
    {
        $this->currency = $currency;

        return $this;
    }

    public function getInformation(): ?string
    {
        return $this->information;
    }

    public function setInformation(?string $information): self
    {
        $this->information = $information;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(): self
    {
        $this->created_at = new \DateTime("now");

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(): self
    {
        $this->updated_at = new \DateTime("now");

        return $this;
    }

    /**
     * @return Collection|Subscription[]
     */
    public function getSubscriptions(): Collection
    {
        return $this->subscriptions;
    }

    public function addSubscription(Subscription $subscription): self
    {
        if (!$this->subscriptions->contains($subscription)) {
            $this->subscriptions[] = $subscription;
            $subscription->setAccount($this);
        }

        return $this;
    }

    public function removeSubscription(Subscription $subscription): self
    {
        if ($this->subscriptions->contains($subscription)) {
            $this->subscriptions->removeElement($subscription);
            // set the owning side to null (unless already changed)
            if ($subscription->getAccount() === $this) {
                $subscription->setAccount(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Transaction[]
     */
    public function getSenderTransactions(): Collection
    {
        return $this->sender_transactions;
    }

    public function addSenderTransaction(Transaction $senderTransaction): self
    {
        if (!$this->sender_transactions->contains($senderTransaction)) {
            $this->sender_transactions[] = $senderTransaction;
            $senderTransaction->setSenderAccount($this);
        }

        return $this;
    }

    public function removeSenderTransaction(Transaction $senderTransaction): self
    {
        if ($this->sender_transactions->contains($senderTransaction)) {
            $this->sender_transactions->removeElement($senderTransaction);
            // set the owning side to null (unless already changed)
            if ($senderTransaction->getSenderAccount() === $this) {
                $senderTransaction->setSenderAccount(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Transaction[]
     */
    public function getRecipientTransactions(): Collection
    {
        return $this->recipient_transactions;
    }

    public function addRecipientTransaction(Transaction $recipientTransaction): self
    {
        if (!$this->recipient_transactions->contains($recipientTransaction)) {
            $this->recipient_transactions[] = $recipientTransaction;
            $recipientTransaction->setRecipientAccount($this);
        }

        return $this;
    }

    public function removeRecipientTransaction(Transaction $recipientTransaction): self
    {
        if ($this->recipient_transactions->contains($recipientTransaction)) {
            $this->recipient_transactions->removeElement($recipientTransaction);
            // set the owning side to null (unless already changed)
            if ($recipientTransaction->getRecipientAccount() === $this) {
                $recipientTransaction->setRecipientAccount(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Transaction[]
     */
    public function getTransactions(): Collection
    {
        return $this->transactions;
    }

    public function addTransaction(Transaction $transaction): self
    {
        if (!$this->transactions->contains($transaction)) {
            $this->transactions[] = $transaction;
            $transaction->setAccount($this);
        }

        return $this;
    }

    public function removeTransaction(Transaction $transaction): self
    {
        if ($this->transactions->contains($transaction)) {
            $this->transactions->removeElement($transaction);
            // set the owning side to null (unless already changed)
            if ($transaction->getAccount() === $this) {
                $transaction->setAccount(null);
            }
        }

        return $this;
    }

}
