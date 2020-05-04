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

    render() {
        if (this.state.unauthorized) {
            return <Redirect to={'/login'}/>
        }
        return (
            <div className={'chats-view'}>
                <Chats onChatOpen={this.openChat}/>
                {(this.state.chatWith) ? <Chat key={this.state.chatWith} with={this.state.chatWith}/> : <div>Empty</div>}
            </div>
        );
    }
}

