<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181116104850 extends AbstractMigration implements ContainerAwareInterface
{
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }


    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');        

        $em = $this->container->get('doctrine.orm.entity_manager');

        $sql = 'CREATE OR REPLACE FUNCTION check_transaction() RETURNS TRIGGER AS $check_transaction$'.
        'BEGIN '.
            'IF(TG_OP = \'INSERT\') THEN '.
                'IF(NEW.recipient_account_uuid IS NOT NULL) THEN '.
                    'UPDATE account SET balance = balance + NEW.operation_sum WHERE account.uuid = NEW.recipient_account_uuid;'.
                'END IF;'.
                'IF(NEW.sender_account_uuid IS NOT NULL) THEN '.
                    'UPDATE account SET balance = balance - NEW.operation_sum WHERE account.uuid = NEW.sender_account_uuid;'.
                'END IF;'.
            'END IF;'.
            'RETURN null;'.
        'END;'.
        '$check_transaction$ LANGUAGE plpgsql;';
        $em->getConnection()->exec( $sql );
        
        
        $sql = 'CREATE TRIGGER check_transaction AFTER INSERT OR UPDATE ON transaction '.
        'FOR EACH ROW EXECUTE PROCEDURE check_transaction()';
        $em->getConnection()->exec( $sql );
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
    }
}
