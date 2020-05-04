import 'Components/AuthView/AuthView.sass'
import Button from 'Components/Button/Button.js';
import Input from 'Components/Input/Input.js';
import http from 'http-status-codes';
import {apiLogin, apiRegister} from 'Libs/apiCalls.js';
import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';


export default class AuthView extends Component {
    constructor(props) {
        super(props);
        this.type = props.type;
        this.state = {
            loginInput: '',
            passwordInput: '',
        };
        if (props.type === 'register') {
            this.state.passwordRepeatInput = '';
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleLogin() {
        if (this.state.passwordInput && this.state.loginInput) {
            apiLogin(this.state.loginInput, this.state.passwordInput).then(response => {
                switch (response.status) {
                    case http.OK:
                    case http.SEE_OTHER:
                        this.setState({authorized: true});
                        break;
                    case http.NOT_FOUND:
                        console.log('Неверный логин или пароль');
                        break;
                }
            });
        }
    }

    handleRegister() {
        if (this.state.passwordInput === this.state.passwordRepeatInput) {
            apiRegister(this.state.loginInput, this.state.passwordInput).then(response => {
                switch (response.status) {
                    case http.OK:
                    case http.SEE_OTHER:
                        this.setState({authorized: true});
                        break;
                    case http.CONFLICT:
                        console.log('Никнейм уже занят');
                        break;
                    default:
                        break;
                }
            });
        }
    }

    renderLoginForm() {
        return (
            <div className={'auth'}>
                <div className={'auth-form'}>
                    <div className={'auth-input-label'}>Логин</div>
                    <Input value={this.state.loginInput} type={'text'}
                           onChange={(e) => this.setState({loginInput: e.target.value})}/>
                    <div className={'auth-input-label'}>Пароль</div>
                    <Input value={this.state.passwordInput} type={'password'}
                           onChange={(e) => this.setState({passwordInput: e.target.value})}/>
                    <div className={'auth-controls'}>
                        <Button type={'primary'} text={'Войти'} onClick={this.handleLogin}/>
                        <Link className='link' to='/register'>Регистрация</Link>
                    </div>
                </div>
            </div>
        );
    }

    renderRegisterForm() {
        return (
            <div className={'auth'}>
                <div className={'auth-form'}>
                    <div className={'auth-input-label'}>Логин</div>
                    <Input value={this.state.loginInput} type={'text'}
                           onChange={(e) => this.setState({loginInput: e.target.value})}/>
                    <div className={'auth-input-label'}>Пароль</div>
                    <Input value={this.state.passwordInput} type={'password'}
                           onChange={(e) => this.setState({passwordInput: e.target.value})}/>
                    <div className={'auth-input-label'}>Повторите пароль</div>
                    <Input value={this.state.passwordRepeatInput} type={'password'}
                           onChange={(e) => this.setState({passwordRepeatInput: e.target.value})}/>
                    <div className={'auth-controls'}>
                        <Button type={'primary'} text={'Войти'} onClick={this.handleRegister}/>
                        <Link className='link' to='/login'>Уже есть аккаунт?</Link>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        if (this.state.authorized) {
            return (
                <Redirect push to={'/'}/>
            )
        } else {
            return (this.type === 'login') ? this.renderLoginForm() : this.renderRegisterForm();
        }
    }
}

