import { Public } from '@modules/auth'
import { All, Controller, Next, Req, Res } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { NextFunction, Request, Response } from 'express'

import { createProxyMiddleware } from 'http-proxy-middleware'

const proxy = createProxyMiddleware({
    target: 'https://trace.playwright.dev',
    changeOrigin: true,
    pathRewrite: {
        '^/api/tasks/viewer/-/': '/',
    },
    on: {
        proxyReq: (proxyReq, req) => {
            // Make sure the assets from the proxied page will be requested from the correct, proxied path (/api/tasks/viewer/-/...)
            // Meaning, the proxied page will try to request assets, and we need them to be correctly proxied as well
            proxyReq.setHeader('Host', 'trace.playwright.dev')
            proxyReq.setHeader('Origin', 'https://trace.playwright.dev')
            proxyReq.setHeader('Referer', 'https://trace.playwright.dev/')
        },
    },
})

@ApiExcludeController()
@Controller('tasks')
export class ViewerHttpController {
    @Public()
    @All('viewer/-/*')
    viewer(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction
    ) {
        proxy(req, res, next)
    }
}
