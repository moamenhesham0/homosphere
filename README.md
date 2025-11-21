# Homosphere
Real estate website powered with ai agents.

## Table of Contents
- [Tooling & Setup](#tooling--setup)
- [Common Commands](#common-commands)
- [Setup](#setup)
- [Environmental Setup](#environmental-setup)
- [Execution](#execution)
- [Hooks and Formatting](#hooks-and-formatting)
- [Code Style & Clean Code Guidelines](#code-style--clean-code-guidelines)

## Tooling & Setup
- Frontend: React + Vite
- Supabase: config in `src/utils/supabase.js`, secrets in `.env`
- ESLint & Prettier: auto-fix/format via `lint-staged` on commit
- Husky: pre-commit hook runs lint-staged
- Justfile: use `just setup` to install dependencies

## Common Commands

### Setup
#### Setup Justfile
- Linux (Debian/Ubuntu)
    ```
    sudo apt install just
    ```
- Linux (Arch)
    ```
    sudo pacman -S just
    ```
- macOS (Homebrew)
    ```
    brew install just
    ```
- Windows (Scoop or Chocolatey)
    ```
    scoop install just
    choco install just
    ```
#### Environmental Setup
- **Setup all frontend dependencies:**
	```
	just setup-fe
	```
- **Setup all backend dependencies:**
	```
	just setup-be
	```
- **Setup all dependencies:**
	```
	just setup
	```
----
### Execution
- **Run frontend (Vite dev server):**
	```
	just run-fe
	```
- **Run backend (Spring Boot):**
	```
	just run-be
	```
- **Run both frontend and backend:**
	```
	just run
	```
---
### Hooks and Formatting
- **Format frontend code:**
	```
	just format-fe
	```
- **Linting frontend code:**
	```
	just lint-fe
	```
- **Supabase config:**
    - *.env*:
        - Holds Supabase connection details.
        - **Always in `.gitignore`**, so create it in the frontend folder.
        - Code Content:
            ```
            VITE_SUPABASE_URL= SUPABASE_URL
            VITE_SUPABASE_ANON_KEY= SUPABASE_ANON_KEY
            ```
    - *src/utils/supabase.js* is configured to initialize and manage the Supabase instance.
- On commit, Husky runs lint-staged to auto-fix and format staged frontend files.
---
# Code Style & Clean Code Guidelines

## Contents
- [1. Folders](#1-folders)
- [2. Files](#2-files)
- [3. Classes (OOP)](#3-classes-oop)
- [4. Functions](#4-functions)
- [5. Variables](#5-variables)
- [6. Miscellaneous Practices](#6-miscellaneous-practices)


# 1. Folders

### 1.1 Category Folders
- **Style:** `kebab-case`
- **Examples:**
  - `components`
  - `services`
  - `utils`
  - `assets`
  - `styles`
  - `images`

### 1.2 Feature-Specific Folders
- **Style:** `PascalCase`
- **Examples:**
  - `UserProfile`
  - `PropertyListings`
  - `BookingManagement`

**Rule:**
Use `kebab-case` for global/utility folders, `PascalCase` for application features.

## 2. Project Structure

### 2.1 Backend
    ```
    homosphere-backend/
    │
    ├─ src/                        # Source files
    │   ├─ main/                   # Main application code
    │   │   ├─ java/               # Java packages
    │   │   │   └─ com.homosphere.backend
    │   │   │       ├─ config/     # Configuration classes
    │   │   │       ├─ controller/ # REST controllers
    │   │   │       ├─ dto/        # Data Transfer Objects
    │   │   │       ├─ mapper/     # Entity <-> DTO mappers
    │   │   │       ├─ model/      # Entity classes
    │   │   │       ├─ repository/ # JPA repositories
    │   │   │       ├─ service/    # Business logic
    │   │   │       ├─ util/       # Helper/utility classes
    │   │   │       └─ exception/  # Custom exceptions
    │   │   └─ resources/          # Properties, static files
    │   └─ test/                   # Unit & integration tests
    │       └─ java/               # Test packages
    ├─ pom.xml                     # Maven dependencies
    └─ README.md                   # Project description
    ```
### 2.2 Frontend
    ```
    homosphere-frontend/
    │
    ├─ husky/                     # Git hooks for running linters, formatters, or other pre-commit tasks.
    ├─ public/                    # Static files (index.html, favicon, etc.)
    ├─ src/
    │   ├─ assets/                # Images, fonts, icons
    │   ├─ components/            # Reusable UI components
    │   ├─ pages/                 # Page-level components
    │   ├─ services/              # API calls / service functions
    │   ├─ utils/                 # Helper functions
    │   ├─ hooks/                 # Custom React hooks
    │   ├─ context/               # React Context providers
    │   ├─ store/                 # Zustand store for global state
    │   ├─ styles/                # Global CSS / SCSS files
    │   ├─ App.js
    │   ├─ index.js
    │   └─ App.css
    ├─ package.json               # NPM dependencies
    └─ README.md
    ```


---

# 2. Files


### 2.1 Component / Page / Class / Interface Files
- **Style:** `PascalCase`
- **Examples:**
  - `Button.jsx`
  - `Home.jsx`

### 2.2 Component CSS Modules
- **Style:** `PascalCase`
- **Examples:**
  - `Button.module.css`

### 2.3 Global / Shared CSS
- **Style:** `kebab-case`
- **Examples:**
  - `styles/global.css`
  - `styles/theme.css`

### 2.4 Hooks
- **Style:** `camelCase`, must start with `use`
- **Examples:**
  - `useAuth.js`
  - `useFetch.js`

### 2.5 Utilities / Services
- **Style:** `camelCase`
- **Examples:**
  - `apiService.js`
  - `formatDate.js`

### 2.6 Constants / Enums
- **Style:** `UPPER_SNAKE_CASE`
- **Examples:**
  - `API_BASE_URL.js`
  - `USER_ROLES.js`

---

# 3. Classes (OOP)

## 3.1 Naming
- File name and class name must match.
- **Style:** `PascalCase`
- **Examples:**
  - `MyClass.java` → class `MyClass`
  - `MyClass.jsx` → component `MyClass`

## 3.2 Class Structure (Order Matters)
Recommended structure inside each class:

1. **Static Constants**
   - **Style:** `UPPER_SNAKE_CASE`
   - Example: `MAX_RETRY_COUNT = 5;`

2. **Static Variables**
   - **Style:** `camelCase`
   - Example: `totalCount = 5;`

2. **Constant Variables (final / readonly)**
   - **Style:** `camelCase`
   - Example: `defaultTimeout = 3000;`

3. **Instance Variables**
   - **Style:** `camelCase`
   - Example: `userName;`

4. **Constructors**
   - **Style:** `PascalCase`
   - Example: `Property()`

5. **Static Methods**
   - **Style:** `camelCase`
   - Example: `convertToSeconds()`

6. **Public Methods**
   - **Style:** `camelCase`
   - Example: `calculateTotal()`

7. **Protected Methods**
   - **Style:** `camelCase`
   - Example: `calculateTotal()`

7. **Private Methods**
   - **Style:** `camelCase`
   - Example: `calculateTotal()`




---

# 4. Functions

## 4.1 Naming
- Use **verbs** for function names.
- **Style:**
    - `camelCase`
- Examples:
  - `calculateTotal()`
  - `fetchUser()`
  - `validateInput()`

## 4.2 Structure
A clean function typically follows this order:

1. **Input validation (fail fast)**
2. **Early returns for edge cases**
3. **Core logic**
4. **Return statement**

## 4.3 Rules
- Functions should do **one thing only**.
- Keep them short ( ≤ `60 lines`).
- Keep `parameters ≤ 4` if possible.
- Avoid deep nesting (no more than 3 levels).
    - Example:
        ```javascript
        function example(param1, param2) {
            if (param1) {               // first level
                for (const item of param2) {  // second level
                    if (item.active) {       // third level
                        console.log(item);
                    }
                }
            }
        }
        ```
- Avoid boolean parameters when possible (`process(x, isActive)` changes behavior).
- Prefer *pure functions* when possible with no side-effects.

---

# 5. Variables

## 5.1 Naming Rules
- **Meaningful names** only.
- Avoid abbreviations.
- Prefer clarity.

## 5.2 Conventions
- **`camelCase`:** normal variables
- **`UPPER_SNAKE_CASE`:** static & exported constants

## 5.3 Variable Scope
- Keep variables as close as possible to where they are used.
- Avoid global variables unless absolutely required.

---

# 6. Miscellaneous Practices

## 6.1 Formatting
- Keep indentation consistent.
- Keep line length ≤ 120 characters.

## 6.2 File Organization
Inside a file, keep this order:
1. Imports
2. Constants
3. Types / Interfaces
4. Classes / Functions
5. Exports (if applicable)

## 6.3 Comments

- Comment **why**, not **what**.
- Keep comments **concise and readable**.
- Avoid obvious or trivial comments.
- Keep documentation **updated** (comments must reflect current code behavior).
- Use **Javadoc for Java**, **JSDoc for React/JS** in documentation.
- **Document public APIs / methods**: explain inputs, outputs, exceptions.
- Avoid commenting out large blocks of code — remove them or explain why they are disabled.
- Prefer **self-explanatory code** over excessive comments.
- For complex logic, consider **small diagrams or examples** if it helps understanding.


## 6.4 Error Handling

- Fail early—not late.
- Use descriptive error messages.
- Use consistent error handling (exceptions, error objects, or return codes).
- Validate inputs and throw errors for invalid data.
- Log errors appropriately for debugging and monitoring.
- Avoid swallowing errors silently.
- For APIs, use standardized error format of JSON code/message.
    - Example:
        ```JSON
        {
            "code": "ERROR_CODE",
            "message": "Description of the error"
        }
        ```

## 6.5 Testing

- Write testable code (modular, pure functions).
- Cover edge cases.
- Avoid overly mocking internal logic—test behavior, not implementation.
- Make test names descriptive and meaningful.
- Keep tests independent; one test should not rely on another.
- Regularly run tests during development.
- Use assertions that clearly state expected outcomes.


---

