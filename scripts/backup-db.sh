#!/bin/bash

set -e

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/blog_backup_${TIMESTAMP}.sql"

cleanup() {
    if [ -f "$BACKUP_FILE" ]; then
        rm -f "$BACKUP_FILE"
        echo "Cleaned up partial backup file"
    fi
}
trap cleanup ERR

mkdir -p "$BACKUP_DIR"

echo "Starting database backup..."
echo "Backup file: $BACKUP_FILE"

if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable not set"
    exit 1
fi

pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
gzip "$BACKUP_FILE"
echo "Backup completed successfully: ${BACKUP_FILE}.gz"

if ls "${BACKUP_DIR}"/*.gz 1> /dev/null 2>&1; then
    echo "Recent backups:"
    ls -la "${BACKUP_DIR}"/*.gz | tail -5
fi

MAX_BACKUPS="${MAX_BACKUPS:-10}"
cd "$BACKUP_DIR"
if ls *.gz 1> /dev/null 2>&1; then
    ls -t *.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm --
    echo "Cleanup complete. Keeping latest $MAX_BACKUPS backups."
fi
