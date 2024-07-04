import compose from 'ramda/src/compose'

import withChakra from './withChakra'
import withStrict from './withStrict'
import withRedux from './withRedux'
import withRouter from './withRouter'
import withAuthorization from './withAuthorization'
import { ReactNode } from 'preact/compat'

export { withChakra, withStrict, withRedux, withRouter, withAuthorization }

export type Shell = (node: ReactNode) => ReactNode

export const AuthedShell: Shell = compose(
    withChakra,
    withStrict,
    withRedux,
    withAuthorization,
    withRouter
)

export const UnauthedShell: Shell = compose(
    withChakra,
    withStrict,
    withRedux,
    withRouter
)
