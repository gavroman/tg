import Button from 'Components/Button/Button.js';
import 'Components/Chat/Chat.sass'
import Input from 'Components/Input/Input.js';
import * as http from 'http-status-codes';
import {apiGetMessages, WEBSOCKET} from 'Libs/apiCalls.js';
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unauthorized: false,
            with: props.with,
        };
        apiGetMessages(this.state.with).then(response => {
            switch (response.status) {
                case http.OK:
                    response.json().then((body) => {
                        this.setState({messages: body});
                        console.log(body);
                    });
                    break;
                case http.UNAUTHORIZED:
                    this.setState({unauthorized: true});
                    break;
                default:
                    break;
            }
        });

        this.handleMessageInput = this.handleMessageInput.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount(prevProps) {
        if (!this.socket) {
            this.connectWithSocket();
        }
    }

    connectWithSocket() {
        this.socket = new WebSocket(WEBSOCKET);
        this.socket.onclose = (event) => {
            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.log('Обрыв соединения'); // например, "убит" процесс сервера
            }
            console.log('Код: ' + event.code + ' причина: ' + event.reason);
        };

        this.socket.onmessage = (event) => {
            console.log('Получены данные ' + event.data);
            const message = JSON.parse(event.data);
            if (message?.from === this.state.with) {
                const updatedMessages = [...this.state.messages, {text: message.text, authorIsReader: false}];
                this.setState({messages: updatedMessages});
            }
        };

        this.socket.onerror = (error) => {
            console.log('Ошибка ' + error.message);
        };
    }

    handleMessageInput(event) {
        this.setState({messageInput: event.target.value});
    }

    sendMessage() {
        if (this.state.messageInput) {
            const message = {to: this.state.with, text: this.state.messageInput};
            this.socket.send(JSON.stringify(message));
            const updatedMessages = [...this.state.messages, {text: message.text, authorIsReader: true}];
            this.setState({messageInput: null, messages: updatedMessages});
        }
    }

    render() {
        if (this.state.unauthorized) {
            return <Redirect push to={'/login'}/>
        }
        if (this.state.with) {
            return <div className={'chat'}>
                <div className={'chat-header'}>
                    <div className={'chat-header-nickname'}>
                        @{this.state.with}
                    </div>
                </div>
                <div className={'chat-messages'}>
                    {this.state.messages?.map((message, index) => {
                        const className = (message.authorIsReader) ? 'chat-message__from-user' : 'chat-message'
                        return <div key={index + this.state.with} className={className}>
                            {message.text}
                        </div>
                    })}
                </div>
                <div className={'chat-new-message'}>
                    <Input className={'chat-new-message-input'} value={this.state.messageInput}
                           placeholder={'Сообщение'}
                           onChange={this.handleMessageInput}/>
                    <Button type={'secondary'} text={'Отправить'} onClick={this.sendMessage}/>
                </div>
            </div>
        }
        return <div className={'chat'}>
            empty
        </div>
    }
}
