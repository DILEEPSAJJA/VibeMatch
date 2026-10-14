#!/usr/bin/env bash
set -e

echo "🔮 ====================================================="
echo "           VibeMatch Full-Stack Social Platform        "
echo "======================================================="

# Auto-detect or set JAVA_HOME if not present
if [ -z "$JAVA_HOME" ]; then
    if [ -d "/Library/Java/JavaVirtualMachines/jdk-26.jdk/Contents/Home" ]; then
        export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk-26.jdk/Contents/Home"
    elif [ -d "/Library/Java/JavaVirtualMachines/temurin-25.jdk/Contents/Home" ]; then
        export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-25.jdk/Contents/Home"
    fi
fi

if [ -n "$JAVA_HOME" ]; then
    export PATH="$JAVA_HOME/bin:$PATH"
fi

echo "✅ Using Java: $(java -version 2>&1 | head -n 1)"
echo "✅ Using Node: $(node -v)"
echo ""
echo "Choose an option to launch VibeMatch:"
echo "1) Start with Docker Compose (MySQL + Kafka + Backend + Frontend)"
echo "2) Start Backend Locally (Port 8080 - In-Memory Dev Profile)"
echo "3) Start Frontend Locally (Port 3000 - Vite Dev Server)"
echo "4) Build Everything (Frontend + Backend JAR)"
echo ""
read -p "Enter selection [1-4]: " choice

case $choice in
    1)
        echo "🚀 Starting Docker Compose environment..."
        docker compose up --build
        ;;
    2)
        echo "🚀 Starting Spring Boot Backend Core Service on http://localhost:8080..."
        ./gradlew :backend:vibematch-core:bootRun
        ;;
    3)
        echo "🚀 Starting Vite React Frontend on http://localhost:3000..."
        cd frontend
        npm run dev
        ;;
    4)
        echo "🔨 Building Frontend..."
        cd frontend && npm run build && cd ..
        echo "🔨 Building Backend Spring Boot JAR..."
        ./gradlew :backend:vibematch-core:bootJar -x test
        echo "✨ Build Complete!"
        ;;
    *)
        echo "Invalid selection. Exiting."
        exit 1
        ;;
esac
