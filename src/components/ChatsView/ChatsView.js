import Chat from 'Components/Chat/Chat.js';
import Chats from 'Components/Chats/Chats';
import 'Components/ChatsView/ChatsView.sass'
import * as http from 'http-status-codes';
import {apiGetChats} from 'Libs/apiCalls.js';
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

export default class ChatsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unauthorized: false
        };

        this.openChat = this.openChat.bind(this);
        this.getChats = this.getChats.bind(this);
        this.handleMessageSend = this.handleMessageSend.bind(this);
    }

    getChats() {
        apiGetChats().then(response => {
            switch (response.status) {
                case http.OK:
                    response.json().then((body) => {
                        this.setState({chats: body.chats});
                    });
                    break;
                case http.UNAUTHORIZED:
                    this.setState({unauthorized: true});
                    break;
                default:
                    break;
            }
        });
    }


    componentDidMount() {
        this.getChats()
    }

    openChat(nickname) {
        this.setState({chatWith: nickname});
    }

    handleMessageSend(messageData) {
        this.setState({
            lastChat: {
                lastMessage: messageData.text,
                members: [messageData.to],
            }
        });
    }

    render() {
        if (this.state.unauthorized) {
            return <Redirect to={'/login'}/>
        }
        return (
            <div className={'chats-scrollable'}>
                <div className={'chats-view'}>
                    <Chats onChatOpen={this.openChat} updatedOrNewChat={this.state.lastChat}/>
                    {(this.state.chatWith)
                        ? <Chat key={this.state.chatWith} with={this.state.chatWith}
                                onMessageSend={this.handleMessageSend}/>
                        : <div/>}
                </div>
            </div>
        );
    }
}

