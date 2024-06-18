# `@webwisp/server`

The backend server for the WebWisp automated agent. It uses Playwright to interact with websites and OpenAI to generate tasks.

## Installation

For instructions, see the [README.md](../../README.md) in the root of the repository.

## Configuration

The agent can be configured through environment variables.
The following environment variables can be set:

-   `OPENAI_API_KEY`: The OpenAI API key to use for the agent. **_Required_**
-   `OPENAI_ORG` : The OpenAI organization to use for the agent.
-   `OPENAI_PROJECT`: The OpenAI project to use for the agent.

Make sure that the server has enough memory to run the agent. If the server hangs when spawning a runner, it might be running out of memory.
Usually, at least 1GB of memory is required to run the agent.

## License

This project is licensed under either of the following, at your option:

-   Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
-   MIT License ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you,
as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
