# Define working dirs links
FRONTEND_LINK := "--prefix homosphere-frontend"
BACKEND_LINK := "-f homosphere-backend/pom.xml"

# Define packages to install
FE_DEV_PACKAGES := "eslint prettier eslint-plugin-prettier eslint-config-prettier husky lint-staged"
FE_PACKAGES := "firebase zustand"

# Run frontend
run-fe:
    npm run dev {{FRONTEND_LINK}} -- --open
    @echo "Frontend is running..."

# Run backend
run-be:
    mvn spring-boot:run {{BACKEND_LINK}}
    @echo "Backend is running..."

# Run both frontend and backend for development
run: run-fe run-be
    @echo "Development environment is running..."

# Setup development environment
setup-fe:
    npm install {{FRONTEND_LINK}}
    npm install {{FE_DEV_PACKAGES}} --save-dev {{FRONTEND_LINK}}
    npm install {{FE_PACKAGES}} {{FRONTEND_LINK}}
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
    npm run format {{FRONTEND_LINK}}
    @echo "Frontend code formatted."

lint-fe:
    npm run lint {{FRONTEND_LINK}}
    @echo "Frontend code linted."