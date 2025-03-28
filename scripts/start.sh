#!/bin/sh

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting application..."
node server.js