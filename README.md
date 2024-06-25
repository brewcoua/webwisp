# `webwisp`

A web agent for automatic end-to-end testing of websites.
This agent was made during my internship at [LaBRI](https://www.labri.fr/), a computer science laboratory in Bordeaux, France.
It is made of 3 docker images:

-   An orchestrator, which manages the tasks dispatched to a pool of workers, and allows viewing the results of the tasks and workers through http endpoints.
-   Workers, which run the tasks dispatched by the orchestrator. (replicated for scalability)
-   A RabbitMQ server, which is used as a message broker between the orchestrator and the workers.

## Installation

1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).
2. Follow the instructions in the [Configuration](#configuration) section to set up the required environment variables.
3. A `docker-compose.yml` file is provided at the root of the repository. You can use it to start the agent with the following command:

```sh
docker-compose up --build -d
```

4. Done! Everything is handled by Docker, and you should be able to access the orchestrator at `http://localhost:3000` and the api docs at `http://localhost:3000/docs`.

> [!NOTE]
> You can tweak the number of workers by changing the `replicas` field in the `docker-compose.yml` file.
> For the sake of simplicity, a `docker-compose.prod.yml` file is also provided, which allows pulling the pre-built images from the GitHub Container Registry.
> However, it still uses env-files for configuration, so you will need to either provide them, or provide the environment variables directly in the command line.

## Configuration

To use the agent, a few configurations are required through .env files in the same folder as the `docker-compose.yml` file.

-   `.env`:

```env
NODE_ENV=development # or production
LOG_LEVEL=info # or debug

# Optional authentication for RabbitMQ (replacing the default guest:guest)
RABBITMQ_DEFAULT_USER="your-rabbitmq-username" # Username for the RabbitMQ account, if you want to override the default configuration
RABBITMQ_DEFAULT_PASS="your-rabbitmq-password" # Password for the RabbitMQ account
```

-   `.env.orchestrator`:

```env
JWT_SECRET="your-secret-key" # Generate a secret key using a password generator
JWT_EXPIRES_IN=5m # Set the expiration time for the JWT token

MONGODB_USERNAME="your-mongodb-username" # Username for the MongoDB account
MONGODB_PASSWORD="your-mongodb-password" # Password for the MongoDB account
MONGODB_CLUSTER="your-mongodb-cluster" # MongoDB cluster URL, e.g. webwisp.d5e9b.mongodb.net
MONGODB_DATABASE="your-mongodb-database" # Name of the MongoDB database, recommended to use something different from the production database

DEFAULT_USER="your-default-username" # Default username for the first user, will not be used if the database is already populated
DEFAULT_PASSWORD="your-default-password" # Default password for the first user
```

-   `.env.worker`:

```env
OPENAI_API_KEY="your-openai-api-key"
OPENAI_ORGANIZATION="your-openai-organization-id" # Optional, used for grouping usage
OPENAI_PROJECT="your-openai-project-id" # Optional, used for grouping usage
```

-   `.env.rabbitmq`: **_Optional_**

```env
# Set anything here if you want to override the default RabbitMQ configuration
```

## License

This project is licensed under either of the following, at your option:

-   Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
-   MIT License ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you,
as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
