<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20180824075136 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE TABLE account (uuid UUID NOT NULL, owner_uuid UUID DEFAULT NULL, owner_type INT DEFAULT NULL, balance NUMERIC(10, 2) NOT NULL, pending_sum NUMERIC(10, 2) NOT NULL, currency VARCHAR(255) DEFAULT NULL, information JSON DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('COMMENT ON COLUMN account.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN account.owner_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN account.information IS \'(DC2Type:json_array)\'');
        $this->addSql('CREATE TABLE subscription (uuid UUID NOT NULL, account_uuid UUID NOT NULL, account_type INT NOT NULL, sum NUMERIC(5, 2) NOT NULL, category INT NOT NULL, periodicity INT NOT NULL, periodicity_type INT NOT NULL, status INT NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE INDEX IDX_A3C664D35DECD70C ON subscription (account_uuid)');
        $this->addSql('COMMENT ON COLUMN subscription.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN subscription.account_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE transaction (uuid UUID NOT NULL, sender_account_uuid UUID DEFAULT NULL, recipient_account_uuid UUID DEFAULT NULL, account_uuid UUID DEFAULT NULL, sender_account_type INT DEFAULT NULL, recipient_account_type INT DEFAULT NULL, information JSON DEFAULT NULL, operation_category INT DEFAULT NULL, operation_sum NUMERIC(10, 2) NOT NULL, operation_status INT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE INDEX IDX_723705D1AF6B5678 ON transaction (sender_account_uuid)');
        $this->addSql('CREATE INDEX IDX_723705D17A5953FA ON transaction (recipient_account_uuid)');
        $this->addSql('CREATE INDEX IDX_723705D15DECD70C ON transaction (account_uuid)');
        $this->addSql('COMMENT ON COLUMN transaction.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN transaction.sender_account_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN transaction.recipient_account_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN transaction.account_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN transaction.information IS \'(DC2Type:json_array)\'');
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_A3C664D35DECD70C FOREIGN KEY (account_uuid) REFERENCES account (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D1AF6B5678 FOREIGN KEY (sender_account_uuid) REFERENCES account (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D17A5953FA FOREIGN KEY (recipient_account_uuid) REFERENCES account (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D15DECD70C FOREIGN KEY (account_uuid) REFERENCES account (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE subscription DROP CONSTRAINT FK_A3C664D35DECD70C');
        $this->addSql('ALTER TABLE transaction DROP CONSTRAINT FK_723705D1AF6B5678');
        $this->addSql('ALTER TABLE transaction DROP CONSTRAINT FK_723705D17A5953FA');
        $this->addSql('ALTER TABLE transaction DROP CONSTRAINT FK_723705D15DECD70C');
        $this->addSql('DROP TABLE account');
        $this->addSql('DROP TABLE subscription');
        $this->addSql('DROP TABLE transaction');
    }
}
