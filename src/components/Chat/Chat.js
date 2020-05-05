import Button from 'Components/Button/Button.js';
import 'Components/Chat/Chat.sass'
import Input from 'Components/Input/Input.js';
import * as http from 'http-status-codes';
import {apiGetMessages, apiWebsocket} from 'Libs/apiCalls.js';
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unauthorized: false,
            with: props.with,
        };

        this.handleMessageInput = this.handleMessageInput.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.connectWithSocket = this.connectWithSocket.bind(this);
    }

    componentDidMount(prevProps) {
        apiGetMessages(this.state.with).then(response => {
            switch (response.status) {
                case http.OK:
                    response.json().then((body) => {
                        this.setState({messages: body});
                    });
                    break;
                case http.UNAUTHORIZED:
                    this.setState({unauthorized: true});
                    break;
                default:
                    break;
            }
        });
        if (!this.socket) {
            this.connectWithSocket();
        }
    }

    connectWithSocket() {
        this.socket = apiWebsocket.instance;
        this.socket.subscribe('message', event => {
            const message = JSON.parse(event.data);
            if (message?.from === this.state.with) {
                const updatedMessages = [...this.state.messages, {text: message.text, authorIsReader: false}];
                this.setState({messages: updatedMessages});
            }
        });
    }

    handleMessageInput(event) {
        this.setState({messageInput: event.target.value});
    }

    sendMessage() {
        if (this.state.messageInput) {
            const message = {to: this.state.with, text: this.state.messageInput};
            this.props.onMessageSend(message);
            const updatedMessages = [...this.state.messages, {text: message.text, authorIsReader: true}];
            this.setState({messageInput: null, messages: updatedMessages});
            this.socket.send(JSON.stringify(message));
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
                        let messageClassName = 'chat-message';
                        let messageTextClassName = 'chat-message-text';
                        if (message.authorIsReader) {
                            messageClassName += '__from-user';
                            messageTextClassName += '__from-user';
                        }
                        return <div key={index + this.state.with} className={messageClassName}>
                            <div className={messageTextClassName}>
                                {message.text}
                            </div>
                        </div>
                    })}
                </div>
                <div className={'chat-new-message'}>
                    <Input className={'chat-new-message-input'} value={this.state.messageInput}
                           placeholder={'Напишите сообщение...'}
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
