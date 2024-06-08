import { program } from 'commander'
import pkg from '../../package.json'

export const getConfig = () => {
    program
        .version(pkg.version)
        .option('-v, --verbose', 'Show verbose output')
        .option(
            '-t, --target [url]',
            'The target URL to run the agent on. Will be prompted for if not provided'
        )
        .option(
            '-k, --task [task]',
            'The task to run on the target URL. Will be prompted for if not provided'
        )
        .option(
            '--voice',
            'Whether to use voice recognition for input. Overridden if both target and task are provided'
        )

    program.parse()

    return program.opts()
}
