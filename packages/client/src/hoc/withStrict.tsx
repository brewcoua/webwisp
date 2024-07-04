import { ReactNode, StrictMode } from 'preact/compat'

const withStrict = (node: ReactNode) => <StrictMode>{node}</StrictMode>

export default withStrict
