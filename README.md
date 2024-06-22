# `webwisp`

A web agent for automatic end-to-end testing of websites.
This agent was made during my internship at [LaBRI](https://www.labri.fr/), a computer science laboratory in Bordeaux, France.
It is made of 3 docker images:

-   An orchestrator, which manages the tasks dispatched to a pool of workers, and allows viewing the results of the tasks and workers through http endpoints.
-   Workers, which run the tasks dispatched by the orchestrator. (replicated for scalability)
-   A RabbitMQ server, which is used as a message broker between the orchestrator and the workers.

## Installation

1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).
2. Setup the OpenAI API config following this format as a file in `.secrets/openai.json`:

```json
{
    "key": "your-openai-api-key",
    "org": "optional-organization-id",
    "project": "optional-project-id"
}
```

A missing, wrong or not sufficiently privileged OpenAI API key will result in an error at startup. (i.e. it requires access to the `gpt-4o` model)

3. Setup the WebWisp config following this format as a file in `.secrets/config.json`:

```json
{
    "jwt": {
        "secret": "your-jwt-secret",
        "expiresIn": "1d"
    },
    "users": [
        {
            "username": "admin",
            "password": "$argon2id$v=19$m=65536,t=3,p=[YOUR ARGON2ID PASSWORD HASH]"
        }
    ]
}
```

> [!NOTE]
> A password hash can be generated at the following endpoint: `/api/auth/hash/{password}`. Use the api docs at `/api/docs` to easily generate it.

4. A `docker-compose.yml` file is provided at the root of the repository. You can use it to start the agent with the following command:

```sh
docker-compose up --build -d
```

5. Done! Everything is handled by Docker, and you should be able to access the orchestrator at `http://localhost:3000` and the api docs at `http://localhost:3000/docs`.

> [!NOTE]
> You can tweak the number of workers by changing the `replicas` field in the `docker-compose.yml` file.

## License

This project is licensed under either of the following, at your option:

-   Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
-   MIT License ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you,
as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
