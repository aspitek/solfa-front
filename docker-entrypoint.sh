#!/usr/bin/env sh
ls -l /usr/local/bin
until nc -z -v -w30 backend 8080
do
    echo "Waiting for backend connection..."
    sleep 5
done

yarn dev

