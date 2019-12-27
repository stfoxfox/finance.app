<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * класс-форма для подключения кошелька
 */
class WalletForm extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setAction('/balance/save-wallet')->setMethod('POST');

        $builder
            ->add('wallet', TextType::class)
            ->add('type', HiddenType::class)
            ->add('sms_code', TextType::class)
        ;
    }
}
