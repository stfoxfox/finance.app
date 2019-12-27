<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SubscriptionRepository")
 */
class Subscription
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
     * @ORM\Column(type="uuid")
     */
    private $account_uuid;

    /**
     * @ORM\Column(type="integer")
     */
    private $account_type;

    /**
     * @ORM\Column(type="decimal", precision=5, scale=2)
     */
    private $sum;

    /**
     * @ORM\Column(type="integer")
     */
    private $category;

    /**
     * @ORM\Column(type="integer")
     */
    private $periodicity;

    /**
     * @ORM\Column(type="integer")
     */
    private $periodicity_type;

    /**
     * @ORM\Column(type="integer")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Account", inversedBy="subscriptions")
     * @ORM\JoinColumn(name="account_uuid", referencedColumnName="uuid", nullable=false)
     */
    private $account;

    /**
     * типы периодов
     */
    const PERIOD_TYPE_DAY = 1;
    const PERIOD_TYPE_WEEK = 2;
    const PERIOD_TYPE_MONTH = 3;
    const PERIOD_TYPE_YEAR = 4;

    /**
     * статусы подписки
     */
    const STATUS_ACTIVE = 1;
    const STATUS_INACTIVE = 2;

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): self
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getAccountUuid(): ?string
    {
        return $this->account_uuid;
    }

    public function setAccountUuid(string $account_uuid): self
    {
        $this->account_uuid = $account_uuid;

        return $this;
    }

    public function getAccountType(): ?int
    {
        return $this->account_type;
    }

    public function setAccountType(int $account_type): self
    {
        $this->account_type = $account_type;

        return $this;
    }

    public function getSum()
    {
        return $this->sum;
    }

    public function setSum($sum): self
    {
        $this->sum = $sum;

        return $this;
    }

    public function getCategory(): ?int
    {
        return $this->category;
    }

    public function setCategory(int $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getPeriodicity(): ?int
    {
        return $this->periodicity;
    }

    public function setPeriodicity(int $periodicity): self
    {
        $this->periodicity = $periodicity;

        return $this;
    }

    public function getPeriodicityType(): ?int
    {
        return $this->periodicity_type;
    }

    public function setPeriodicityType(int $periodicity_type): self
    {
        $this->periodicity_type = $periodicity_type;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getAccount(): ?Account
    {
        return $this->account;
    }

    public function setAccount(?Account $account): self
    {
        $this->account = $account;

        return $this;
    }
}
