# `@webwisp/worker`

A worker for the WebWisp autonomous agent. It handles the execution of tasks with Playwright and OpenAI. This is meant to be deployed in bulk to handle multiple tasks concurrently.

## Installation

For instructions, see the [README.md](../../README.md) in the root of the repository.

## Configuration

Nothing is required to configure the worker. It will automatically connect to the RabbitMQ server and start listening for tasks.
Make sure to set up the OpenAI config through docker secrets, as described in the root README.

Make sure that the server has enough memory to run the worker. If the worker hangs, it may be due to a lack of memory.
Usually, somewhere around 500-600MB of memory is enough for a single worker, without counting the orchestrator and RabbitMQ.

## License

This project is licensed under either of the following, at your option:

-   Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
-   MIT License ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you,
as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
