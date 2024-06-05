# WebWisp

This is a simple agent, made during my internship at [LaBRI](https://www.labri.fr/), that can be used to navigate through a website while also
testing it. The agent uses OpenAI's GPT-4o model to generate the actions to take on the website.

## Installation

> [!NOTE]
> The repository mainly uses [Bun](https://bun.sh) to manage the project, but any other package manager can be used.

First, clone the repository and install the dependencies:

```bash
git clone git@github.com:brewcoua/webwisp.git --recursive
cd webwisp
bun install # Or any other package manager
```

> [!IMPORTANT]
> Make sure to install browsers for Playwright to use. This can be done with the following:
>
> ```bash
> npx playwright install # Or 'bunx playwright install'
> ```

Then, you can run WebWisp with the following command, depending on your runtime:

```bash
npm start # Or 'bun start'
```

This will prioritize running with `bun`, but if it is not installed, it will default to `npm` and `node`.

> [!WARNING]
> The voice flag requires `sox` to be installed on your system. You can install it with the following:
>
> ```bash
> sudo apt-get install sox libsox-fmt-all # For Linux // Derive it from your package manager
> brew install sox # For MacOS
> ```
>
> If you are using Windows, you can download the binaries [here](http://sourceforge.net/projects/sox/files/latest/download).

It can also be built by itself using:

```bash
bun pack
```

and found at `./dist/main.js`. Most dependencies are kept external however, so you will still need `node_modules` to run the agent.

## Configuration

The agent can be configured through environment variables.
The following environment variables can be set:

-   `OPENAI_API_KEY`: The OpenAI API key to use for the agent. **_Required_**
-   `OPENAI_ORG` : The OpenAI organization to use for the agent.
-   `OPENAI_PROJECT`: The OpenAI project to use for the agent.

It also has flags that can be set:

-   `--target, -t`: The target website to navigate. Will otherwise be prompted.
-   `--task, -k`: The task to perform on the website. Will otherwise be prompted.
-   `--voice, -v`: Use voice recognition to get the task to perform. Off by default and overriden by target and task flags.
-   `--help`: Display the help message.
-   `--version, -V`: Display the version of the agent.
-   `--verbose`: Display more information about the agent's actions.

## License

This project is licensed under either of the following, at your option:

-   Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
-   MIT License ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you,
as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
