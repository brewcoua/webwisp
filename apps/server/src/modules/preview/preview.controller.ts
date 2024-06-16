import { All, Controller, Get, Next, Param, Req, Res } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

import { createProxyMiddleware } from 'http-proxy-middleware'
import { REMOTE_PORT } from '../../services/browser/browser.config'

const proxy = createProxyMiddleware({
    target: `http://localhost:${REMOTE_PORT}`,
    changeOrigin: true,
    pathRewrite: {
        '^/view/-/': '/',
    },
    ws: true,
    on: {
        proxyReq: (proxyReq, req) => {
            proxyReq.setHeader('Host', `localhost:${REMOTE_PORT}`)
            proxyReq.setHeader('Origin', `http://localhost:${REMOTE_PORT}`)
        },
        proxyReqWs: (proxyReq, req) => {
            proxyReq.setHeader('Host', `localhost:${REMOTE_PORT}`)
            proxyReq.setHeader('Origin', `http://localhost:${REMOTE_PORT}`)
        },
    },
})

@Controller('view')
export default class PreviewController {
    @Get('inspect/:id')
    inspect(
        @Req() req: Request,
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const host = req.headers.host
        return res.redirect(
            `/view/-/devtools/inspector.html?ws=${host}/view/-/devtools/page/${id}`
        )
    }

    @All('-/*')
    get(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        proxy(req, res, next)
    }
}
