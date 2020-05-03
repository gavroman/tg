import 'Components/App/App.sass'
import 'Components/App/Reset.sass'
import AuthView from 'Components/AuthView/AuthView';
import ChatsView from 'Components/ChatsView/ChatsView.js';
import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom'

export default class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/register' component={() => <AuthView type={'register'}/>}/>
                    <Route exact path="/login" component={() => <AuthView type={'login'}/>}/>
                    <Route path='/' component={() => <ChatsView/>}/>
                </Switch>
            </div>
        )
    }
}
