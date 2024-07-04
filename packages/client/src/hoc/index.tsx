import compose from 'ramda/src/compose'
import { ComponentChildren } from 'preact'
import { ReactNode } from 'preact/compat'

import withChakra from './withChakra'
import withStrict from './withStrict'
import withRedux from './withRedux'
import withAuthorization from './withAuthorization'
import AuthenticationProvider from './AuthenticationProvider'

export {
    withChakra,
    withStrict,
    withRedux,
    withAuthorization,
    AuthenticationProvider,
}

export const AuthedShell = ({ children }: { children: any }): any => {
    const func = compose(withAuthorization, withRedux, withChakra, withStrict)

    return func(<AuthenticationProvider>{children}</AuthenticationProvider>)
}

export const UnauthedShell = ({ children }: { children: any }): any => {
    return compose(withRedux, withChakra, withStrict)(children)
}
