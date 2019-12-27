<?php


class CreateTransactionCest
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

    public function createTransactionViaApi(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-transaction","request":{"data":{"recipient_account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","recipient_account_type":1,"sender_account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","sender_account_type":1,"account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","operation_sum":1000,"information":"{\u0022asd\u0022:123}","category":1}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'create-transaction',
            'error_code' => 0,
        ]);
    }
  
    public function notValidRecipientAccountUuid(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-transaction","request":{"data":{"recipient_account_uuid":"8f62","recipient_account_type":1,"sender_account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","sender_account_type":1,"account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","operation_sum":1000,"information":"{\u0022asd\u0022:123}","category":1}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'recipient account uuid is not valid',
            'error_code' => 587,
        ]);
    }

    public function notValidSenderAccountUuid(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-transaction","request":{"data":{"recipient_account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","recipient_account_type":1,"sender_account_uuid":"8asd","sender_account_type":1,"account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","operation_sum":1000,"information":"{\u0022asd\u0022:123}","category":1}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'sender account uuid is not valid',
            'error_code' => 587,
        ]);
    }

    public function notValidAccountUuid(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-transaction","request":{"data":{"recipient_account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","recipient_account_type":1,"sender_account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","sender_account_type":1,"account_uuid":"83962","operation_sum":1000,"information":"{\u0022asd\u0022:123}","category":1}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'account uuid is not valid',
            'error_code' => 587,
        ]);
    }

    public function notFoundRecipientAccount(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-transaction","request":{"data":{"recipient_account_uuid":"9fffcfa4-060a-4307-8bb4-e68e25703962","recipient_account_type":1,"sender_account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","sender_account_type":1,"account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","operation_sum":1000,"information":"{\u0022asd\u0022:123}","category":1}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'recipient account not found',
            'error_code' => 6564,
        ]);
    }

    public function notFoundSenderAccount(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-transaction","request":{"data":{"recipient_account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","recipient_account_type":1,"sender_account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703972","sender_account_type":1,"account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","operation_sum":1000,"information":"{\u0022asd\u0022:123}","category":1}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'sender account not found',
            'error_code' => 45,
        ]);
    }

    public function insufficientFunds(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-transaction","request":{"data":{"recipient_account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","recipient_account_type":1,"sender_account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","sender_account_type":1,"account_uuid":"8fffcfa4-060a-4307-8bb4-e68e25703962","operation_sum":1000000,"information":"{\u0022asd\u0022:123}","category":1}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'insufficient funds',
            'error_code' => 854,
        ]);
    }

    public function notFoundValue(ApiTester $I){
        $I->sendPOST(
            $I->getContainer()->getParameter('private_finance_api_endpoint'),
            '{"action":"create-transaction","request":{"data":{}},"authorisation":{"jwt_token":"","client_token":""}}'
        );

        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        $I->seeResponseIsJson();
        $I->seeResponseContainsJson([
            'error_msg' => 'not found data',
            'error_code' => 45,
        ]);
    }
}
