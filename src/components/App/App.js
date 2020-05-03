import 'Components/App/App.sass'
import 'Components/App/Reset.sass'
import AuthView from 'Components/AuthView/AuthView';
import ChatsView from 'Components/ChatsView/ChatsView';
import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

export default class App extends Component {
    render() {
        return (
            <div>
                {/*<Router>*/}
                    <Switch>
                        <Route path="/login">
                            <AuthView type={'login'}/>
                        </Route>
                        <Route path="/register">
                            <AuthView type={'register'}/>
                        </Route>
                        <Route path='/'>
                            <ChatsView/>
                        </Route>
                    </Switch>
                {/*</Router>*/}
            </div>
        )
    }
}
