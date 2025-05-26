#!/bin/bash

# Check if API key is provided
if [ -z "$1" ]; then
  echo "Usage: ./run-with-api-key.sh YOUR_GROQ_API_KEY"
  exit 1
fi

# Echo for debugging
echo "Using Groq API key: ${1:0:5}... (first 5 chars shown for security)"

# Create a temporary .env file with the API key
echo "# Server configuration" > .env
echo "PORT=3001" >> .env
echo "" >> .env
echo "# API Keys (backend only)" >> .env
echo "GROQ_API_KEY=$1" >> .env
echo "" >> .env
echo "# Frontend environment variables" >> .env
echo "VITE_API_URL=http://localhost:3001" >> .env

echo "Starting full development environment with API proxy"
npm run dev:full

# Remove the .env file when done (will be triggered on CTRL+C)
trap "rm -f .env && echo 'Removed temporary .env file'" EXIT 