# Working dirs
FRONTEND_DIR := "homosphere-frontend"
BACKEND_LINK := "-f homosphere-backend/pom.xml"

# Packages to install
FE_DEV_PACKAGES := "eslint prettier eslint-plugin-prettier eslint-config-prettier husky lint-staged"
FE_PACKAGES := "zustand @supabase/supabase-js"

# Run frontend
run-fe:
    cd {{FRONTEND_DIR}} && npm run dev -- --open
    @echo "Frontend is running..."

# Run backend
run-be:
    mvn spring-boot:run {{BACKEND_LINK}}
    @echo "Backend is running..."

# Run both frontend and backend for development
run: run-fe run-be
    @echo "Development environment is running..."

# Setup frontend
setup-fe:
    cd {{FRONTEND_DIR}} && npm install && npm install {{FE_DEV_PACKAGES}} --save-dev && npm install {{FE_PACKAGES}}
    @echo "Frontend dependencies are installed."

# Setup backend environment
setup-be:
    mvn clean install {{BACKEND_LINK}}
    @echo "Backend is set up."

# Full development environment setup
setup: setup-fe setup-be
    @echo "Development environment is set up."

# Format frontend code
format-fe:
    cd {{FRONTEND_DIR}} && npm run format
    @echo "Frontend code formatted."

# Lint frontend code
lint-fe:
    cd {{FRONTEND_DIR}} && npm run lint
    @echo "Frontend code linted."