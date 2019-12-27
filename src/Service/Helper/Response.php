<?php

namespace App\Service\Helper;

/**
 * класс ответов API
 */
class Response
{
    /**
     * строка ошибки
     * @var string
     */
    public $error_msg;

    /**
     * код ошибки
     * @var integer
     */
    public $error_code;

    /**
     * ответ
     * @var string
     */
    public $responce;

    /**
     * @param string $error_msg
     * @param integer $error_code
     * @param string $responce
     */
    public function __construct($error_msg, $error_code, $responce)
    {
        $this->error_msg = $error_msg;
        $this->error_code = $error_code;
        $this->responce = $responce;
    }
}
