<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TransactionRepository")
 */
class Transaction
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
     * @ORM\Column(type="integer", nullable=true)
     */
    private $sender_account_type;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $recipient_account_type;

    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    private $information;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $operation_category;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2)
     */
    private $operation_sum;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $operation_status;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updated_at;

    /**
     * @ORM\Column(type="uuid", nullable=true)
     */
    private $sender_account_uuid;

    /**
     * @ORM\Column(type="uuid", nullable=true)
     */
    private $recipient_account_uuid;

    /**
     * @ORM\Column(type="uuid", nullable=true)
     */
    private $account_uuid;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Account", inversedBy="senderTransactions")
     * @ORM\JoinColumn(name="sender_account_uuid", referencedColumnName="uuid", nullable=true)
     */
    private $sender_account;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Account", inversedBy="recipientTransactions")
     * @ORM\JoinColumn(name="recipient_account_uuid", referencedColumnName="uuid", nullable=true)
     */
    private $recipient_account;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Account", inversedBy="transactions")
     * @ORM\JoinColumn(name="account_uuid", referencedColumnName="uuid", nullable=true)
     */
    private $account;

    /**
     * статусы транзакций
     */
    const STATUS_CREATE = 1;
    const STATUS_WAIT_APPROWAL = 2;
    const STATUS_APPROWAL = 3;
    const STATUS_CANCELED = 4;

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

    public function getSenderAccountType(): ?int
    {
        return $this->sender_account_type;
    }

    public function setSenderAccountType(int $sender_account_type): self
    {
        $this->sender_account_type = $sender_account_type;

        return $this;
    }

    public function getRecipientAccountType(): ?int
    {
        return $this->recipient_account_type;
    }

    public function setRecipientAccountType(int $recipient_account_type): self
    {
        $this->recipient_account_type = $recipient_account_type;

        return $this;
    }

    public function getInformation()
    {
        return $this->information;
    }

    public function setInformation($information): self
    {
        $this->information = $information;

        return $this;
    }

    public function getOperationCategory(): ?int
    {
        return $this->operation_category;
    }

    public function setOperationCategory(int $operation_category): self
    {
        $this->operation_category = $operation_category;

        return $this;
    }

    public function getOperationSum()
    {
        return $this->operation_sum;
    }

    public function setOperationSum($operation_sum): self
    {
        $this->operation_sum = $operation_sum;

        return $this;
    }

    public function getOperationStatus(): ?int
    {
        return $this->operation_status;
    }

    public function setOperationStatus(int $operation_status): self
    {
        $this->operation_status = $operation_status;

        return $this;
    }

    public function getCreatedAt()
    {
        return $this->created_at->format('Y-m-d H:i:s');;
    }

    public function setCreatedAt(): self
    {
        $this->created_at = new \DateTime("now");

        return $this;
    }

    public function getUpdatedAt()
    {
        return $this->updated_at->format('Y-m-d H:i:s');;
    }

    public function setUpdatedAt(): self
    {
        $this->updated_at = new \DateTime("now");

        return $this;
    }

    public function getSenderAccountUuid()
    {
        return $this->sender_account_uuid;
    }

    public function setSenderAccountUuid($sender_account_uuid): self
    {
        $this->sender_account_uuid = $sender_account_uuid;

        return $this;
    }

    public function getRecipientAccountUuid()
    {
        return $this->recipient_account_uuid;
    }

    public function setRecipientAccountUuid($recipient_account_uuid): self
    {
        $this->recipient_account_uuid = $recipient_account_uuid;

        return $this;
    }

    public function getAccountUuid()
    {
        return $this->account_uuid;
    }

    public function setAccountUuid($account_uuid): self
    {
        $this->account_uuid = $account_uuid;

        return $this;
    }

    public function getSenderAccount(): ?Account
    {
        return $this->sender_account;
    }

    public function setSenderAccount(?Account $sender_account): self
    {
        $this->sender_account = $sender_account;

        return $this;
    }

    public function getRecipientAccount(): ?Account
    {
        return $this->recipient_account;
    }

    public function setRecipientAccount(?Account $recipient_account): self
    {
        $this->recipient_account = $recipient_account;

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
