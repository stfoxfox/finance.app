<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181112055259 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        // $this->addSql('DROP SEQUENCE refresh_tokens_id_seq CASCADE');
        $this->addSql('CREATE TABLE outpay_type (uuid UUID NOT NULL, owner_uuid UUID DEFAULT NULL, type INT NOT NULL, state VARCHAR(50) DEFAULT NULL, data VARCHAR(2000) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, confirmed_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('COMMENT ON COLUMN outpay_type.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN outpay_type.owner_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('DROP TABLE migration');
        $this->addSql('DROP TABLE refresh_tokens');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        // $this->addSql('CREATE SEQUENCE refresh_tokens_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE migration (version VARCHAR(180) NOT NULL, apply_time INT DEFAULT NULL, PRIMARY KEY(version))');
        $this->addSql('CREATE TABLE refresh_tokens (id INT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX uniq_9bace7e1c74f2195 ON refresh_tokens (refresh_token)');
        $this->addSql('DROP TABLE outpay_type');
    }
}
