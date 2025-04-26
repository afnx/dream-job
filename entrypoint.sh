#!/bin/sh

# Wait for DB to be ready (only in development)
if [ "$ENV" = "dev" ]; then
  echo "Waiting for the database..."
  while ! nc -z db $DATABASE_PORT; do
    sleep 1
  done
  echo "Database is up!"
fi

# Generate Prisma client
npx prisma generate

# Run migrations (only in development)
if [ "$ENV" = "dev" ]; then
  npx prisma migrate dev --name init
else
  npx prisma migrate deploy
fi

# Start the application
if [ "$ENV" = "dev" ]; then
  echo "Starting the application in development mode..."
  # Run your app in development
  npm run dev
else
  echo "Starting the application in production mode..."
  # Run your app in production
  npm run start
fi
