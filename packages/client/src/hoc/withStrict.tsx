import { ReactNode, StrictMode } from 'preact/compat'

const withStrict = (node: ReactNode): ReactNode => {
    return <StrictMode>{node}</StrictMode>
}

export default withStrict
