{{ define "redis_resources" }}
resources:
  requests:
    memory: {{ first (pluck .Values.global.env .Values.resources.redis.requests.memory) | default .Values.resources.redis.requests.memory._default | quote }}
    cpu: {{ first (pluck .Values.global.env .Values.resources.redis.requests.cpu) | default .Values.resources.redis.requests.cpu._default | quote }}
  limits:
    memory: {{ first (pluck .Values.global.env .Values.resources.redis.limits.memory) | default .Values.resources.redis.limits.memory._default | quote }}
    cpu: {{ first (pluck .Values.global.env .Values.resources.redis.limits.cpu) | default .Values.resources.redis.limits.cpu._default | quote }}
{{ end }}
