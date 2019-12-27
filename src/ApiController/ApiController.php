<?php

namespace App\ApiController;

use App\Service\Helper\Response as RApi;
use App\Service\Helper\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends Controller
{
    /**
     * Endpoint API, принимающий POST запрос от клиента, содержащий json строку.
     * По значению, определённому в action, вызывается определённый метод.
     * Результат приходит в формате json
     * @Route("/balance", name="balance", methods={"POST"})
     * @param $request Request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $json = $request->getContent();
        if($json == null){
            return new JsonResponse(new Response('Body not found', 404, ''));
        }
        
        $req = $this->get('service.private.request')->setJson($json);
        switch ($req->getAction()) {
            case 'balance-account':
                return new JsonResponse($req->getBalanceAccount()->getResponse());
                break;

            case 'create-transaction':
                return new JsonResponse($req->createTransaction()->getResponse());
                break;

            case 'create-subscription':
                return new JsonResponse($req->createSubscription()->getResponse());
                break;

            case 'cancel-subscription':
                return new JsonResponse($req->cancelSubscription()->getResponse());
                break;

            case 'create-account':
                return new JsonResponse($req->createAccount()->getResponse());
                break;

            default:
                return new JsonResponse(new Response('This action not found', 404, ''));
                break;
        }
    }
}
