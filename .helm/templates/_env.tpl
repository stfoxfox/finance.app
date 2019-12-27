{{- define "app_envs" }}
- name: DATABASE_URL
  value: "postgresql://{{ pluck .Values.global.env .Values.psql.user | first | default .Values.psql.user._default }}:{{ pluck .Values.global.env .Values.psql.password | first | default .Values.psql.password._default }}@{{ pluck .Values.global.env .Values.psql.host | first | default .Values.psql.host._default }}:{{ pluck .Values.global.env .Values.psql.port | first | default .Values.psql.port._default }}/{{ pluck .Values.global.env .Values.psql.db | first | default .Values.psql.db._default }}"
- name: JWT_SECRET_KEY
  value: "{{ pluck .Values.global.env .Values.app.jwt_secret_key | first | default .Values.app.jwt_secret_key._default }}"
- name: JWT_PUBLIC_KEY
  value: "{{ pluck .Values.global.env .Values.app.jwt_public_key | first | default .Values.app.jwt_public_key._default }}"
- name: JWT_PASSPHRASE
  value: "{{ pluck .Values.global.env .Values.app.jwt_passphrase | first | default .Values.app.jwt_passphrase._default }}"
- name: AUTHENTICATION_URL
  value: {{ pluck .Values.global.env .Values.app.authentification_url | first | default .Values.app.authentification_url._default }}
- name: APP_KEY
  value: "{{ pluck .Values.global.env .Values.app.app_key | first | default .Values.app.app_key._default }}"
- name: APP_ID
  value: "{{ pluck .Values.global.env .Values.app.app_id | first | default .Values.app.app_id._default }}"
- name: ROLES_KEY
  value: "{{ pluck .Values.global.env .Values.app.roles_key | first | default .Values.app.roles_ttl._default }}"
- name: ROLES_TTL
  value: "{{ pluck .Values.global.env .Values.app.roles_ttl | first | default .Values.app.roles_ttl._default }}"
- name: BRAINTREE_ENVIRONMENT 
  value: "{{ pluck .Values.global.env .Values.app.braintree_environment | first | default .Values.app.braintree_environment._default }}"
- name: BRAINTREE_MERCHANT_ID 
  value: "{{ pluck .Values.global.env .Values.app.braintree_merchant_id | first | default .Values.app.braintree_merchant_id._default }}"
- name: BRAINTREE_PUBLIC_KEY 
  value: "{{ pluck .Values.global.env .Values.app.braintree_public_key | first | default .Values.app.braintree_public_key._default }}"
- name: BRAINTREE_PRIVATE_KEY 
  value: "{{ pluck .Values.global.env .Values.app.braintree_private_key | first | default .Values.app.braintree_private_key._default }}"
- name: BRAINTREE_CUSTOMER_ID 
  value: "{{ pluck .Values.global.env .Values.app.braintree_customer_id | first | default .Values.app.braintree_customer_id._default }}"
- name: PRIVATE_FINANCE_API_ENDPOINT
  value: "{{ pluck .Values.global.env .Values.app.private_finance_api_endpoint | first | default .Values.app.private_finance_api_endpoint._default }}"
- name: LOCATE
  value: "{{ pluck .Values.global.env .Values.app.locate | first | default .Values.app.locate._default }}"
- name: COOCKIE_DOMAIN
{{- if eq .Values.global.env "production" }}
  value: {{ pluck .Values.global.env .Values.app.cookie_domain | first | default .Values.app.cookie_domain._default }}
{{- else }}
  value: {{ printf (pluck .Values.global.env .Values.app.cookie_domain | first | default .Values.app.cookie_domain._default) .Values.global.env }}
{{- end }}
- name: AUTHENTICATION_COOKIE_NAME
  value: "{{ pluck .Values.global.env .Values.app.authentification_cookie_name | first | default .Values.app.authentification_cookie_name._default }}"
- name: TOKEN_LIFETIME
  value: "{{ pluck .Values.global.env .Values.app.token_life_time | first | default .Values.app.token_life_time._default }}"
- name: LENGTH_PASSWORD
  value: "{{ pluck .Values.global.env .Values.app.length_password | first | default .Values.app.length_password._default }}"
- name: FROM_EMAIL
  value: "{{ pluck .Values.global.env .Values.app.from_email | first | default .Values.app.from_email._default }}"
- name: SITE_DOMAIN
{{- if eq .Values.global.env "production" }}
  value: {{ pluck .Values.global.env .Values.app.site_domain | first | default .Values.app.site_domain._default }}
{{- else }}
  value: {{ printf (pluck .Values.global.env .Values.app.site_domain | first | default .Values.app.site_domain._default) .Values.global.env }}
{{- end }}
- name: COOKIE_LANGUAGE
  value: "{{ pluck .Values.global.env .Values.app.cookie_language | first | default .Values.app.cookie_language._default }}"
- name: PRIVATE_API_ENDPOINT
  value: "{{ pluck .Values.global.env .Values.app.private_api_endpoint | first | default .Values.app.private_api_endpoint._default }}"
- name: PRIVATE_FINANCE_API_ENDPOINT
  value: "{{ pluck .Values.global.env .Values.app.private_finance_api_endpoint | first | default .Values.app.private_finance_api_endpoint._default }}"
- name: REDIS_URL
  value: "{{ pluck .Values.global.env .Values.redis.dns | first | default .Values.redis.dns._default }}"
- name: REDIS_DNS
  value: "{{ pluck .Values.global.env .Values.redis.dns | first | default .Values.redis.dns._default }}"
- name: REDIS_PORT
  value: "{{ pluck .Values.global.env .Values.redis.port | first | default .Values.redis.port._default }}"
- name: REDIS_DATABASE
  value: "{{ pluck .Values.global.env .Values.redis.database | first | default .Values.redis.database._default }}"
- name: MAILER_URL
  value: "{{ pluck .Values.global.env .Values.app.mailer_url | first | default .Values.app.mailer_url._default }}"

- name: PAYPAL_URL
  value: "{{ pluck .Values.global.env .Values.app.paypal_url | first | default .Values.app.paypal_url._default }}"
- name: PAYPAL_MERCHANT
  value: "{{ pluck .Values.global.env .Values.app.paypal_merchant | first | default .Values.app.paypal_merchant._default }}"
- name: PAYPAL_ID
  value: "{{ pluck .Values.global.env .Values.app.paypal_id | first | default .Values.app.paypal_id._default }}"
- name: FROALA_EDITOR_KEY
  value: "{{ pluck .Values.global.env .Values.app.froala_editor_key | first | default .Values.app.froala_editor_key._default }}"
- name: AUTOBAHN_KEY
  value: "{{ pluck .Values.global.env .Values.app.autobahn_key | first | default .Values.app.autobahn_key._default }}"
- name: AUTOBAHN_WS_URL
  value: "{{ pluck .Values.global.env .Values.app.autobahn_ws_url | first | default .Values.app.autobahn_ws_url._default }}"
- name: AUTOBAHN_HTTP_URL
  value: "{{ pluck .Values.global.env .Values.app.autobahn_http_url | first | default .Values.app.autobahn_http_url._default }}"
- name: BING_CLIENT_ID
  value: "{{ pluck .Values.global.env .Values.app.bing_client_id | first | default .Values.app.bing_client_id._default }}"
- name: BING_CLIENT_SECRET
  value: "{{ pluck .Values.global.env .Values.app.bing_client_secret | first | default .Values.app.bing_client_secret._default }}"
- name: BING_DEFAULT_LANGUAGE
  value: "{{ pluck .Values.global.env .Values.app.bing_default_language | first | default .Values.app.bing_default_language._default }}"
- name: PAYEER_ACCOUNT
  value: "{{ pluck .Values.global.env .Values.app.payeer_account | first | default .Values.app.payeer_account._default }}"
- name: PAYEER_API_ID
  value: "{{ pluck .Values.global.env .Values.app.payeer_api_id | first | default .Values.app.payeer_api_id._default }}"
- name: PAYEER_API_PASS
  value: "{{ pluck .Values.global.env .Values.app.payeer_api_pass | first | default .Values.app.payeer_api_pass._default }}"

{{- end }}

