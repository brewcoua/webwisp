import { ReactNode } from 'preact/compat'
import { Provider } from 'react-redux'

import store from '@store'

const withRedux = (node: ReactNode) => <Provider store={store}>{node}</Provider>

export default withRedux
