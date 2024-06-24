import { Route, Switch } from 'wouter'
import Login from './Login'
import SignUp from './SignUp'

export default function PublicPages() {
    return (
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
        </Switch>
    )
}
