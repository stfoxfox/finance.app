<?php

class BalanceAccountCest
{
    public function _before(ApiTester $I)
    {
    }

    public function _after(ApiTester $I)
    {
    }

    public function getBalanceAccountViaApi(ApiTester $I)
    {
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"balance-account","request":{"data":{"uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'balance-account',
            'error_code' => 0,
        ]);
    }

    public function errorValidUuid(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"balance-account","request":{"data":{"uuid":"123"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'uuid is not valid',
            'error_code' => 587,
        ]);
    }

    public function uuidNotFound(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"balance-account","request":{"data":{}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'uuid not set',
            'error_code' => 3423,
        ]);
    }

    public function notFoundAccount(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"balance-account","request":{"data":{"uuid":"8fffcfa4-060a-4307-8bb4-e68e25703984"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'not found account',
            'error_code' => 54,
        ]);
    }
}
