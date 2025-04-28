#!/bin/sh
set -e
# Installer curl, grep, bash et mc
apk update
apk add curl grep bash bash-completion

# Installer mc (client MinIO)
wget -q https://dl.min.io/client/mc/release/linux-amd64/mc -O /usr/bin/mc
chmod +x /usr/bin/mc
echo "contenu de /"
ls -l
echo "contenu de /root"
ls -l /root
# Elasticsearch
ES_HOST="${ES_HOST:-http://solfa-es:9200}"
ES_USER="${ES_USER:-elastic}"
ES_PASS="${ES_PASSWORD:-elastic}"

# MinIO
MINIO_ENDPOINT="${MINIO_ENDPOINT:-http://solfa-minio:9000}"
MINIO_ROOT_USER="${MINIO_ACCESS_KEY:-solfa}"
MINIO_ROOT_PASSWORD="${MINIO_SECRET_KEY:-solfa123}"
MINIO_BUCKET="${MINIO_BUCKET:-solfa}"

# DB
DB_HOST="${DB_HOST:-solfa-db}"
DB_PORT="${DB_PORT:-5432}"

echo "⏳ Attente de la base de donnees..."
until nc -z -v -w30 "$DB_HOST" "$DB_PORT";
do
    echo "⌛ Base de donnees pas encore prête..."
    sleep 5
done
echo "✅ Base de donnees prête."

echo "⏳ Attente d'Elasticsearch..."
until curl -u "$ES_USER:$ES_PASS" "$ES_HOST" | grep -q 'tagline'; do
  echo "⌛ Elasticsearch pas encore prêt..."
  sleep 5
done
echo "✅ Elasticsearch prêt."
sleep 10

# === Création de tous les index ===
for file in ./elasticsearch/mappings/*.json; do
  index=$(basename "$file" .json)

  if curl -s -o /dev/null -w "%{http_code}" -u "$ES_USER:$ES_PASS" "$ES_HOST/$index" | grep -q 200; then
    echo "⚠️  Index '$index' existe déjà, on saute."
  else
    echo "📦 Création de l’index '$index'..."
    curl -X PUT "$ES_HOST/$index" \
         -u "$ES_USER:$ES_PASS" \
         -H "Content-Type: application/json" \
         -d @"$file"
    echo "✅ Index '$index' créé."
  fi
done

# === Attente de MinIO ===
echo "⏳ Attente de MinIO..."
until curl "$MINIO_ENDPOINT/minio/health/ready"; do
  echo "⌛ MinIO pas encore prêt..."
  sleep 5
done
echo "✅ MinIO prêt."

# === Création du bucket ===
mc alias set localminio "$MINIO_ENDPOINT" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"

if mc ls localminio | grep -q "$MINIO_BUCKET"; then
  echo "⚠️  Bucket '$MINIO_BUCKET' existe déjà."
else
  echo "📁 Création du bucket '$MINIO_BUCKET'..."
  mc mb localminio/"$MINIO_BUCKET"
  echo "✅ Bucket '$MINIO_BUCKET' créé."
fi

exec "/bin/sh -c /root/solfa-api"