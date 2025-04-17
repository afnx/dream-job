#!/bin/sh

# Set default NODE_ENV if not passed
NODE_ENV=${NODE_ENV:-development}

# Wait for DB to be ready (only in development)
if [ "$NODE_ENV" = "development" ]; then
  echo "Waiting for the database..."
  while ! nc -z db 5432; do
    sleep 1
  done
  echo "Database is up!"
fi

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations (only in development)
if [ "$NODE_ENV" = "development" ]; then
  npx prisma migrate dev --name init
else
  npx prisma migrate deploy
fi

# Run your app
npm run dev
