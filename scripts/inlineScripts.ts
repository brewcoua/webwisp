import { plugin } from 'bun';

plugin({
    name: 'inline-scripts',
    setup(build) {
        build.onLoad({ filter: /\.inline\.(js|css)$/ }, async (args) => {
            return {
                exports: {
                    default: await Bun.file(args.path).text()
                },
                loader: 'object',
            }
        })
    }
})