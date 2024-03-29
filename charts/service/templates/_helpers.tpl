{{/*
Expand the name of the chart.
*/}}
{{- define "service.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "service.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "service.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "service.labels" -}}
helm.sh/chart: {{ include "service.chart" . }}
{{ include "service.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "service.selectorLabels" -}}
app.kubernetes.io/name: {{ include "service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Pod Annotations
*/}}
{{- define "service.podAnnotations" -}}
{{- end }}

{{/*
Create the hostname of the Route to use
*/}}
{{- define "service.hostname" -}}
{{- if .Values.route.enabled }}
{{- default (printf "%s.%s" (include "service.fullname" .) (.Values.domain)) .Values.route.hostname }}
{{- else }}
{{- default "default" .Values.route.hostname }}
{{- end }}
{{- end }}

{{/*
Get Environment Variables
*/}}
{{- define "service.env" -}}
{{- default ("") .Values.configmap.env }}
{{- end }}

{{/*
Create default ConfigMap 
*/}}
{{- define "service.configmap" -}}
{{ printf "%s%s" (.Values.configmap.script) (include "service.env" .) }}
{{- end}}


{{/*
Create default Secret
*/}}
{{- define "service.secret" -}}
{{- default ("") .Values.secret.stringdata }}
{{- end }}

{{/*
Vault Sideloader Annotations 
*/}}
{{- define "service.vaultAnnotations" -}}
{{- if .Values.vault.enabled }}
# 1. Vault injector configuration goes here, inside the template.
vault.hashicorp.com/agent-inject: 'true'
vault.hashicorp.com/agent-inject-token: 'true'
vault.hashicorp.com/agent-pre-populate-only: 'true' # this makes sure the secret vault will only change during pod restart
vault.hashicorp.com/auth-path: auth/k8s-silver  # This was tricky.  Be sure to use k8s-silver, k8s-gold, or k8s-golddr
vault.hashicorp.com/namespace: platform-services
vault.hashicorp.com/role: {{.Values.vault.zone}}  # licenseplate-nonprod or licenseplate-prod are your options


# Configure how to retrieve and populate the secrets from Vault:
# - The name of the secret is any unique string after vault.hashicorp.com/agent-inject-secret-<name>
# - The value is the path in Vault where the secret is located.
{{- range $k := .Values.vault.secrets }} 
vault.hashicorp.com/agent-inject-secret-{{$k}}:    {{$.Values.vault.zone}}/{{$k}}
vault.hashicorp.com/agent-inject-template-{{$k}}: |
  {{ printf "%s" "{{" }}- with secret "{{$.Values.vault.zone}}/{{$k}}"{{ printf "%s" "}}" }}
  {{ printf "%s" "{{" }}- range $k,$v := .Data.data{{ printf "%s" "}}"  }}
  export {{"{{"}}$k{{"}}"}}="{{"{{"}}$v{{"}}"}}"
  {{ printf "%s" "{{" }}- end{{ printf "%s" "}}" }} 
  {{ printf "%s" "{{" }}- end{{ printf "%s" "}}" }} 
{{- end }}
{{- end }}
{{- end }}
