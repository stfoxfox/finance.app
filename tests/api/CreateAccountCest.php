<?php


class CreateAccountCest
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

    public function createAccountViaApi(ApiTester $I)
    {
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-account","request":{"data":{"owner_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","owner_type":1,"periodicity":1,"balance":1,"information":"{\u0022ddd\u0022:43}"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'create-account',
            'error_code' => 0,
        ]);
    }

    public function errorValidUuid(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-account","request":{"data":{"owner_uuid":"5703962","owner_type":1,"periodicity":1,"balance":1,"information":"{\u0022ddd\u0022:43}"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'owner uuid is not valid',
            'error_code' => 89,
        ]);
    }

    public function notFoundOwner(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-account","request":{"data":{"owner_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703965","owner_type":1,"periodicity":1,"balance":1,"information":"{\u0022ddd\u0022:43}"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'this account not found',
            'error_code' => 6654,
        ]);
    }

    public function notFoundValue(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-account","request":{"data":{}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'dont have value',
            'error_code' => 34534,
        ]);
    }
}
