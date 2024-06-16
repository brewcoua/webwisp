# `webwisp`

A web agent for automatic end-to-end testing of websites.
This agent was made during my internship at [LaBRI](https://www.labri.fr/), a computer science laboratory in Bordeaux, France.
It is made in 2 parts:

-   The server, which is a REST API made with NestJS, that handles the whole agent part, with the creation of runners, the execution of tasks on target websites, and the storage of the results.
-   The client, which is an Electron app made with Preact, that allows connecting to any ongoing server, and to create, edit, and run tasks on target websites.

## Installation

> [!NOTE]
> The repository uses [pnpm](https://pnpm.io/) as the package manager, and [lerna](https://lerna.js.org/) for managing the monorepo.

### Server

1. Clone the repository
2. Install the dependencies with `pnpm install` and go to the `apps/server` folder
3. Create a `.env` file at the root of the server folder, and fill it with the following content:

```
LOG_LEVEL=info # The log level of the server, default is info

OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXX # Your OpenAI API key
OPENAI_ORG=org-XXXXXXXXXXXXXXXXXXXXXXXX # Your OpenAI organization
OPENAI_PROJECT=proj-XXXXXXXXXXXXXXXXXXXXXXXX # Your OpenAI project
```

These environment variables can also be set in the environment.

4. Start the server with `pnpm start`

For easily deploying the server in production, a Dockerfile is provided at the root of the server folder.

### Client

1. Clone the repository
2. Install the dependencies with `pnpm install` and go to the `apps/client` folder
3. Start the client with `pnpm start` or `pnpm dev` for development

Currently, the client is not ready for a release, but it will be available soon as prebuilt in the releases.

## Usage

The client can be used to connect to any server running the agent, and to create, edit, and run tasks on target websites.
As this is currently work in progress, servers do not require authentication, and the client can connect to any server running the agent.

## License

This project is licensed under either of the following, at your option:

-   Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
-   MIT License ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you,
as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
