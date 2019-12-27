<?php

namespace App\Event;

use App\Controller\TokenAuthenticatedController;
use App\Entity\Account;
use GuzzleHttp\Client;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Predis\Client as Redis;
use Symfony\Component\Cache\Adapter\RedisAdapter;
use  Symfony\Component\HttpFoundation\HeaderBag;

/**
 * слушатель событий контроллера для обновления JWT token
 */
class TokenAuthSubscriber implements EventSubscriberInterface
{

    /**
     * @var Symfony\Component\DependencyInjection\Container;
     */
    private $container;

    /**
     * @var Symfony\Component\HttpFoundation\RequestStack;
     */
    private $requestStack;

    /**
     * @var Doctrine\ORM\EntityManager
     */
    private $em;

    public function __construct(Container $container, RequestStack $requestStack)
    {
        $this->container = $container;
        $this->requestStack = $requestStack;
        $this->em = $container->get('doctrine.orm.entity_manager');
    }

    /**
     * слушатель событий контроллеров (beforeAction)
     * @param Symfony\Component\HttpKernel\Event\FilterControllerEvent $event
     */
    public function onKernelController(FilterControllerEvent $event)
    {
        $controller = $event->getController();
        if ($controller[0] instanceof TokenAuthenticatedController) {
            $request = $this->requestStack->getCurrentRequest();
            $authCookie = $request->cookies->get($this->container->getParameter('authentication_cookie_name'));
            $redirectUrl = $this->container->getParameter('authentication_url');

            if ($request->cookies->get($this->container->getParameter('cookie_language'))) {
                $this->container->get('translator')->setLocale($request->cookies->get($this->container->getParameter('cookie_language')));
            }

            if ($authCookie !== null) {
                $jwt = json_decode($authCookie)->jwt;
                $clientUUID = json_decode($authCookie)->clientUuid;

                $exp = $this->container->get('service.token')->getExp($jwt);
                $userUuid = $this->container->get('service.token')->getUserUuid($jwt);
                $account = $this->em->getRepository('App:Account')->findOneBy(['owner_uuid' => $userUuid]);
                if ($account == null) {
                    $account = new Account();
                    $account->setOwnerType(1)
                        ->setBalance(0)
                        ->setOwnerUuid($userUuid)
                        ->setInformation('0')
                        ->setPendingSum(0)
                        ->setCurrency(0)
                        ->setCreatedAt()
                        ->setUpdatedAt();

                    $this->em->persist($account);
                    $this->em->flush();
                }

                if ($exp < time()) {
                    $client = new Client();
                    $requestBody = [
                        'action' => 'update-token',
                        'request' => [
                            'data' => [
                                'client_uuid' => $clientUUID,
                                'jwt_token' => $jwt,
                            ],
                        ],
                        'authorisation' => [
                            'jwt_token' => $jwt,
                            'clinet_token' => $clientUUID,
                        ],
                    ];
                    $response = $client->request('POST', $this->container->getParameter('private_api_endpoint'), ['body' => json_encode($requestBody)]);
                    $response = json_decode($response->getBody()->getContents());
                    if (!$response->error_code) {
                        $request->cookies->set($this->container->getParameter('authentication_cookie_name'), $response->responce);
                    }
                }
                // redis role
                $redis = RedisAdapter::createConnection(
                    $this->container->getParameter('redis_dns').':'.
                    $this->container->getParameter('redis_port')."/".
                    $this->container->getParameter('redis_database')
                );
                $roles = $redis->get($this->container->getParameter('roles_key'));
                if($roles == null){
                    $client = new Client();
                    $requestBody = [
                        'action' => 'get-roles',
                        'request' => [
                            'data' => [
                                'app_id' => $this->container->getParameter('app_id'),
                                'app_key' => $this->container->getParameter('app_key'),
                            ],
                        ],
                        'authorisation' => [
                            'jwt_token' => $jwt,
                            'clinet_token' => $clientUUID,
                        ],
                    ];

                    $response = $client->request('POST', $this->container->getParameter('private_api_endpoint'), ['body' => json_encode($requestBody)]);
                    $response = json_decode($response->getBody()->getContents());

                    if(!$response->error_code){
                        $redis->set($this->container->getParameter('roles_key'), json_encode($response->responce));
                        $redis->expire($this->container->getParameter('roles_key'), $this->container->getParameter('roles_ttl'));
                    }  
                }
                return true;
            }
            $event->setController(function () use ($redirectUrl) {
                $data = $this->container->get('request_stack')->getMasterRequest();
                $host = $this->container->get('request_stack')->getMasterRequest()->headers->get('host');
                $action = $data->getPathInfo();
                setcookie(
                    'ref_url',
                    'http://'.$host.$action,
                    time() + (int) $this->container->getParameter('token_lifetime'),
                    '/',
                    $this->container->getParameter('cookie_domain')
                );
                return new RedirectResponse($redirectUrl);
            });
        }
    }

    /**
     * определение событий слушателя
     */
    public static function getSubscribedEvents()
    {
        return array(
            KernelEvents::CONTROLLER => 'onKernelController',
        );
    }
}
