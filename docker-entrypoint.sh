#!/usr/bin/env sh

echo " ⏳ Attente du backend..."
until nc -z -v -w30 backend 8080
do
    echo "⌛ Backend pas encore prêt..."
    sleep 5
done
echo "✅ Backend prêt."

if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé, on copie le fichier de dev."
    cp .env.dev .env
fi

echo "⏳ Lancement du frontend..."
yarn dev -- --host