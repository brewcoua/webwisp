import { Provider } from 'react-redux'

import store from '@store'
import { ReactNode } from 'preact/compat'

const withRedux = (node: ReactNode): ReactNode => {
    return <Provider store={store}>{node}</Provider>
}

export default withRedux
