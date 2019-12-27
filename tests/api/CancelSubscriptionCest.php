<?php


class CancelSubscriptionCest
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
    
    public function cancelSubscriptionViaApi(ApiTester $I)
    {
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"cancel-subscription","request":{"data":{"subscription_uuid":"bc02c02f-d9ef-4028-a496-6e110a3d6afc"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'cancel-subscription',
            'error_code' => 0,
        ]);
    }

    public function errorValidUuid(ApiTester $I)
    {
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"cancel-subscription","request":{"data":{"subscription_uuid":"110a3d6afc"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'subscription uuid is not valid',
            'error_code' => 85,
        ]);
    }

    public function notFoundSubscription(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"cancel-subscription","request":{"data":{"subscription_uuid":"ac02c02f-d9ef-4028-a496-6e110a3d6afc"}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'this subscription not found',
            'error_code' => 6654,
        ]);
    }

    public function notFoundValue(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"cancel-subscription","request":{"data":{}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'dont have value',
            'error_code' => 34534,
        ]);
    }
}
