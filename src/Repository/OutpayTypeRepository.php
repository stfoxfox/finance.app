<?php

namespace App\Repository;

use App\Entity\OutpayType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method OutpayType|null find($id, $lockMode = null, $lockVersion = null)
 * @method OutpayType|null findOneBy(array $criteria, array $orderBy = null)
 * @method OutpayType[]    findAll()
 * @method OutpayType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OutpayTypeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, OutpayType::class);
    }
}
