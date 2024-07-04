import { ReactNode } from 'preact/compat'
import { Router } from 'wouter-preact'

const withRouter = (node: ReactNode) => {
    return <Router base="/">{node}</Router>
}

export default withRouter
