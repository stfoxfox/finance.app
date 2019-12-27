<?php

namespace App\Service\Utillity;

use Symfony\Component\DependencyInjection\Container;
use App\Service\Utillity\CPayeer;

class Payeer extends CPayeer {

    /**
     * Payeer configuration
     * @var array
     */
    private $config;

    private $container;

    public function __construct(Container $container, array $config = []) {
        $this->container = $container;

        $this->config = [
            'account' => isset($config['account']) ? $config['account'] : $this->container->getParameter('payeer_account'),
            'apiId' => isset($config['apiId']) ? $config['apiId'] : $this->container->getParameter('payeer_api_id'),
            'apiPass' => isset($config['apiPass']) ? $config['apiPass'] : $this->container->getParameter('payeer_api_pass')
        ];
        $this->config = array_merge($this->config, $config);
        return parent::__construct($this->config['account'], $this->config['apiId'], $this->config['apiPass']);
    }

}
