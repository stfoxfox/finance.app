<?php


class CreateSubscriptionCest
{
    public function _before(ApiTester $I)
    {
    }

    public function _after(ApiTester $I)
    {
    }

    // tests
    public function tryToTest(ApiTester $I)
    {
    }

    public function createSubscriptionViaApi(ApiTester $I)
    {
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-subscription","request":{"data":{"account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","periodicity":1,"periodicity_type":1,"sum":100,"information":"{\u0022susct\u0022:1}"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'create-subcription',
            'error_code' => 0,
        ]);
    }

    public function notValidUuid(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-subscription","request":{"data":{"account_uuid":"8a4-060a-4307-8bb4-e68e25703962","periodicity":1,"periodicity_type":1,"sum":100,"information":"{\u0022susct\u0022:1}"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'account uuid not valid',
            'error_code' => 54,
        ]);
    }

    public function notFoundAccount(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-subscription","request":{"data":{"account_uuid":"8fffcfb4-060a-4307-8bb4-e68e25703962","periodicity":1,"periodicity_type":1,"sum":100,"information":"{\u0022susct\u0022:1}"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'this account not found',
            'error_code' => 3453,
        ]);
    }

    public function notFoundValue(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-subscription","request":{"data":{}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'dont have value',
            'error_code' => 34534,
        ]);
    }
}
