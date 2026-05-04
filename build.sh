#!/bin/bash
set -e

echo "🚀 OperonAI Build Script"
echo "========================"

echo "📦 Installing backend dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd client
npm install

echo "🔨 Building frontend..."
npm run build

echo "✅ Build complete!"
ls -la dist/

echo "📁 Frontend build directory: $(pwd)/dist"
cd ..

echo "🎉 All done! Ready to start server."
