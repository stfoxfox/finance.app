<?php

namespace App\Extension;

/**
 * класс-расширение для twig
 */
class InstanceOfExtension extends \Twig_Extension {

    /**
     * определение PHP функции istanceof для twig
     */
    public function getTests() {
        return array(
            new \Twig_SimpleTest('instanceof', array($this, 'isInstanceOf')),
         );
     }

    /** 
     * логика instanceof 
     * @param mixed $var
     * @param mixed $instance
    */
    public function isInstanceOf($var, $instance) {
        $reflexionClass = new \ReflectionClass($instance);
        return $reflexionClass->isInstance($var);
    }
}