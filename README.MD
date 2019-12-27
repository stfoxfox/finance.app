Finance app 
===============================

Вся конфигурация для финансового приложения настраиваестся в файле .env

Значение ключей конфигурации:
-----------------------------
| Ключ | Описание | Пример |
| ------ | ------ | -----  |
| DATABASE_URL | Строка подключения к базе данных | postgresql://db_user:password@host:port/db_name |
| JWT_SECRET_KEY | Приватный ключ для шифрования JWT | %kernel.project_dir%/config/jwt/private.pem |
| JWT_PUBLIC_KEY | Публичный ключ для шифрования JWT | %kernel.project_dir%/config/jwt/public.pem |
| JWT_PASSPHRASE | Ключевая фраза для JWT_SECRET_KEY | 0ef58e1ed035d70c78df94c61225ad73 |
| LOCATE | Стандартная локаль приложения | eng |
| COOCKIE_DOMAIN | Домен, для которого будут сохранятся в cookie JWT | localhost |
| AUTENTICATION_COOKIE_NAME | Имя cookie, в которое будет сохранятся JWT | AUTHCOOKIE |
| TOKEN_LIFETIME | Время жизни cookie | 1800 |
| LENGTH_PASSWORD | Минимальная длинна пароля | 6 |
| FROM_EMAIL | C какого email будет отправлятся письмо | example@example.com |
| SITE_DOMAIN | Домен сайта | localhost |
| COOKIE_LANGUAGE | Имя cookie, в которое сохраняется локаль | language |
| PRIVATE_API_ENDPOINT | Endpoint приватного авторизациоонного API | localhost:3000/api/v1 |
| AUTHENTICATION_URL | URL авторизационного приложения | localhost:8000 |
| APP_KEY | Ключ приложения (берётся из авторизационного приложения) | 9ed4990d793bfd1693db8b671f5944b6 |
| APP_ID | ID приложения (берётся из авторизационного приложения) | 1 |
| ROLES_KEY | Ключ redis для хранения ролей | roles |
| ROLES_TTL | TTL для ролей (в секундах) | 60 | 
| BRAINTREE_ENVIRONMENT | Идентификатор среды braintree | sandbox |
| BRAINTREE_MERCHANT_ID | ID приложения braintree | zgj4bwxr6rq29spm |
| BRAINTREE_PUBLIC_KEY | Публичный ключ braintree | fk9rb7hpsfgxfzb6 |
| BRAINTREE_PRIVATE_KEY | Приватный ключ braintree | 8fbe8e2ae8eaee64b4b30bef4a7ccf93 |
| BRAINTREE_CUSTOMER_ID | ID клиента braintree | konstruktor-05ff04c3 |
| PRIVATE_FINANCE_API_ENDPOINT| URL приватного АПИ | http://localhost:3000/api/v1 |
| REDIS_DNS | URL Redis | redis://localhost |
| REDIS_PORT | PORT Redis | 6739 |
| REDIS_DATABASE | БД Redis | 1 |
| PAYEER_ACCOUNT | Аккаунт payeer | P63048147 |
| PAYEER_API_ID | ID апи payeer аккаунта | 344697177 |
| PAYEER_API_PASS | Пароль payeer api | vamVb1iV8SiGpZ8g |  


Пример конфигурации можно посмотреть в файле **.env.dist**

Развёртывание приложения:
-----------------------------
Все действия выполняются из директории приложения
1. Выполнить **composer update**
2. Выполнить **php bin/console doctrine:database:create** 
3. Выполнить **php bin/console doctrine:migrations:migrate**

Для создания docker контейнера выполнить **docker-compose up -d**

Тестирование 
------------------------
Все действия выполняются из директории приложения
1. Выполнить **php vendor/codeception/codeception/codecept build**
1. Выполнить **php vendor/codeception/codeception/codecept run**

Тестовая страница - домен/test
