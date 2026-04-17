# Run With Docker

- for backend copy application.properties.template remove .template add your own configuration then added to $/src/main/resources

- for frontend copy .env.template remove the .template add your own configuration then added in the root directory of the frontend 

- build the backend
```bash
cd homosphere-backend

/mvnw clean package -DskipTests 
```

- run the docker-compose
```bash
docker compose up -d --build
```