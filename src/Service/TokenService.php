<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\Container;

/**
 * сервис для работы с JWT
 */
class TokenService
{
    /**
     * @var Symfony\Component\DependencyInjection\Container
     */
    private $container;

    /**
     * @var Doctrine\ORM\EntityManager
     */
    private $em;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->em = $container->get('doctrine.orm.entity_manager');
    }

    /**
     * получение userUUID из JWT token
     * @param string $jwt
     * @return string
     */
    public function getUserUuid($jwt)
    {
        return $this->container->get('lexik_jwt_authentication.encoder')->decode($jwt)['userUuid'];
    }

    /**
     * получение clientUUID из JWT token
     * @param string $jwt
     * @return string
     */
    public function getClientUuid($jwt)
    {
        return $this->container->get('lexik_jwt_authentication.encoder')->decode($jwt)['clientUuid'];
    }

    /**
     * получение exp из JWT token
     * @param string $jwt
     * @return string
     */
    public function getExp($jwt)
    {
        return $this->container->get('lexik_jwt_authentication.encoder')->decode($jwt)['exp'];
    }
}
