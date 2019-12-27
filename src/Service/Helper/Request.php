<?php

namespace App\Service\Helper;

use Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * класс, обрабатывающий запросы от API
 */
class Request
{
    /**
     * json строка от API
     * @var string
     */
    public $json;

    /**
     * действие для API
     * @var string
     */
    private $action;

    /**
     * данные, переданные в json строке
     * @var string
     */
    private $request;

    /**
     * данные для авторизации, переданные в json строке
     * @var string
     */
    private $authorisation;

    /**
     * ответ API
     * @var App\Service\Response
     */
    private $response;

    /**
     * @var Doctrine\ORM\EntityManager
     */
    public $em;

    /**
     * @var Symfony\Component\DependencyInjection\Container
     */
    public $container;

    /**
     * @var Symfony\Component\EventDispatcher\EventDispatcherInterface
     */
    public $eventDispatcher;

    /**
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->em = $container->get('doctrine.orm.entity_manager');
        $this->eventDispatcher = $container->get('event_dispatcher');
    }

    /**
     * @param string $json
     * @return self
     */
    public function setJson($json)
    {
        $this->json = $json;
        $this->validate();

        return $this;
    }

    /**
     * @return string
     */
    public function getJson()
    {
        return $this->json;
    }

    /**
     * @param string $action
     */
    public function setAction($action)
    {
        $this->action = $action;

        return $this;
    }

    /**
     * @return string
     */
    public function getAction()
    {
        return $this->action;
    }

    /**
     * @param string $data
     */
    public function setRequest($request)
    {
        $this->request = $request;

        return $this;
    }

    /**
     * @return string
     */
    public function getRequest()
    {
        return $this->request;
    }

    /**
     * @param string $authorisation
     */
    public function setAuthorisation($authorisation)
    {
        $this->authorisation = $authorisation;

        return $this;
    }

    /**
     * @return string
     */
    public function getAuthorisation()
    {
        return $this->authorisation;
    }

    /**
     * @param Response $response
     */
    public function setResponse($response)
    {
        $this->response = $response;
    }

    /**
     * @return Response
     */
    public function getResponse()
    {
        return $this->response;
    }

    /**
     * валидация json строки от API
     * Проверяем на наличие действия
     * Если его нет - записываем в ответ ошибку
     * Иначе записываем действие
     * @return self
     */
    public function validate(): self
    {
        $requestData = json_decode($this->json);

        $this->setRequest(json_encode($requestData->request));
        $this->setAuthorisation(json_encode($requestData->authorisation));
        if (isset($requestData->action)) {
            $this->setAction($requestData->action);
        } else {
            $this->setResponse(new Response('missing action', 1, ''));
        }

        return $this;
    }

}
