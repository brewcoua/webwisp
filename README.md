# `webwisp`

A web agent for automatic end-to-end testing of websites.
This agent was made during my internship at [LaBRI](https://www.labri.fr/), a computer science laboratory in Bordeaux, France.
It is made of 3 docker images:

-   An orchestrator, which manages the tasks dispatched to a pool of workers, and allows viewing the results of the tasks and workers through http endpoints.
-   Workers, which run the tasks dispatched by the orchestrator. (replicated for scalability)
-   A RabbitMQ server, which is used as a message broker between the orchestrator and the workers.

## Installation

First of all, depending on if you want to run the agent in development or production, you will need to install the following dependencies:

### Development

1. Install [Node.js](https://nodejs.org/en/download/), along with [RabbitMQ](https://www.rabbitmq.com/docs/download).
2. Install npm dependencies with the following command:

```sh
npm install
```

3. Use the following command to start a few workers at once:

```sh
npm run start:bulk -w @webwisp/worker
```

4. Use the following command to start the orchestrator:

```sh
npm run start -w @webwisp/orchestrator
```

5. Done! If your RabbitMQ is properly running, you should be able to access the orchestrator at `http://localhost:3000` and the api docs at `http://localhost:3000/docs`.

### Production

1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).
2. A `docker-compose.yml` file is provided at the root of the repository. You can use it to start the agent with the following command:

```sh
docker-compose up --build -d
```

3. Done! Everything is handled by Docker, and you should be able to access the orchestrator at `http://localhost:3000` and the api docs at `http://localhost:3000/docs`.

## Usage

The client can be used to connect to any server running the agent, and to create, edit, and run tasks on target websites.
As this is currently work in progress, servers do not require authentication, and the client can connect to any server running the agent.

## License

This project is licensed under either of the following, at your option:

-   Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
-   MIT License ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you,
as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
