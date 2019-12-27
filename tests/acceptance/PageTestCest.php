<?php


class PageTestCest
{
    public function _before(AcceptanceTester $I)
    {
    }

    public function _after(AcceptanceTester $I)
    {
    }

    public function pageTest(AcceptanceTester $I){
        $I->amOnPage('/');
        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
        
        $I->amOnPage('/replenish');
        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);

        $I->amOnPage('/windrawal');
        $I->seeResponseCodeIs(\Codeception\Util\HttpCode::OK);
    }
}
