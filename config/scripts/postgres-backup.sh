#!/usr/bin/env bash
set -Eeuo pipefail

BACKUP_DIR="${BACKUP_DIR:-/backups}"
BACKUP_TIME="${BACKUP_TIME:-02:00}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
BACKUP_EMAIL_ENABLED="${BACKUP_EMAIL_ENABLED:-true}"
APP_DOMAIN="${APP_DOMAIN:-Sasha Store}"

required_vars=(
  POSTGRES_HOST
  POSTGRES_PORT
  POSTGRES_USER
  POSTGRES_PASSWORD
  POSTGRES_DB
)

for name in "${required_vars[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env: ${name}" >&2
    exit 1
  fi
done

mkdir -p "${BACKUP_DIR}"

smtp_url() {
  local scheme="smtp"
  local ssl_flag=()
  if [[ "${SMTP_SECURE:-starttls}" == "ssl" ]]; then
    scheme="smtps"
  fi
  printf '%s://%s:%s' "${scheme}" "${SMTP_HOST}" "${SMTP_PORT:-587}"
}

send_email() {
  local subject="$1"
  local body="$2"

  if [[ "${BACKUP_EMAIL_ENABLED}" != "true" ]]; then
    return 0
  fi

  if [[ -z "${SMTP_HOST:-}" || -z "${SMTP_USER:-}" || -z "${SMTP_PASSWORD:-}" || -z "${SMTP_FROM:-}" || -z "${BACKUP_EMAIL_TO:-}" ]]; then
    echo "Backup email skipped: SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, and BACKUP_EMAIL_TO are required." >&2
    return 0
  fi

  local message
  message="$(mktemp)"
  {
    printf 'From: %s\n' "${SMTP_FROM}"
    printf 'To: %s\n' "${BACKUP_EMAIL_TO}"
    printf 'Subject: %s\n' "${subject}"
    printf 'Content-Type: text/plain; charset=utf-8\n'
    printf '\n'
    printf '%s\n' "${body}"
  } > "${message}"

  local curl_args=(
    --silent
    --show-error
    --url "$(smtp_url)"
    --user "${SMTP_USER}:${SMTP_PASSWORD}"
    --mail-from "${SMTP_FROM}"
    --mail-rcpt "${BACKUP_EMAIL_TO}"
    --upload-file "${message}"
  )

  if [[ "${SMTP_SECURE:-starttls}" == "starttls" ]]; then
    curl_args+=(--ssl-reqd)
  fi

  curl "${curl_args[@]}" || echo "Backup email failed to send." >&2
  rm -f "${message}"
}

run_backup() {
  local started_at filename path size_bytes size_human
  started_at="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  filename="${POSTGRES_DB}_$(date -u '+%Y%m%d_%H%M%S').dump"
  path="${BACKUP_DIR}/${filename}"

  echo "Starting database backup at ${started_at}: ${path}"

  export PGPASSWORD="${POSTGRES_PASSWORD}"
  if pg_dump \
    --host="${POSTGRES_HOST}" \
    --port="${POSTGRES_PORT}" \
    --username="${POSTGRES_USER}" \
    --dbname="${POSTGRES_DB}" \
    --format=custom \
    --compress=9 \
    --no-owner \
    --file="${path}"; then
    find "${BACKUP_DIR}" -type f -name "${POSTGRES_DB}_*.dump" -mtime +"${BACKUP_RETENTION_DAYS}" -delete
    ln -sfn "${filename}" "${BACKUP_DIR}/latest.dump"
    size_bytes="$(wc -c < "${path}" | tr -d ' ')"
    size_human="$(du -h "${path}" | awk '{print $1}')"
    local body="Database backup succeeded.

App: ${APP_DOMAIN}
Database: ${POSTGRES_DB}
File: ${filename}
Size: ${size_human} (${size_bytes} bytes)
Started: ${started_at}
Finished: $(date -u '+%Y-%m-%dT%H:%M:%SZ')
Retention: ${BACKUP_RETENTION_DAYS} day(s)
Backup path: ${BACKUP_DIR}"
    echo "${body}"
    send_email "[Sasha Store] Database backup succeeded" "${body}"
  else
    local body="Database backup FAILED.

App: ${APP_DOMAIN}
Database: ${POSTGRES_DB}
Attempted file: ${filename}
Started: ${started_at}
Failed: $(date -u '+%Y-%m-%dT%H:%M:%SZ')

Check the postgres-backup container logs immediately."
    echo "${body}" >&2
    send_email "[Sasha Store] Database backup FAILED" "${body}"
    return 1
  fi
}

seconds_until_next_run() {
  local now next
  now="$(date +%s)"
  next="$(date -d "today ${BACKUP_TIME}" +%s)"
  if (( next <= now )); then
    next="$(date -d "tomorrow ${BACKUP_TIME}" +%s)"
  fi
  echo $(( next - now ))
}

if [[ "${BACKUP_RUN_ON_START:-false}" == "true" ]]; then
  run_backup || true
fi

if [[ "${BACKUP_RUN_ONCE:-false}" == "true" ]]; then
  run_backup
  exit $?
fi

while true; do
  sleep_for="$(seconds_until_next_run)"
  echo "Next database backup scheduled in ${sleep_for}s at ${BACKUP_TIME}."
  sleep "${sleep_for}"
  run_backup || true
done
