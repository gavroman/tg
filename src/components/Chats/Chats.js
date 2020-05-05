import 'Components/Chats/Chats.sass'
import Input from 'Components/Input/Input.js';
import * as http from 'http-status-codes';
import {apiGetChats, apiSearch, apiWebsocket} from 'Libs/apiCalls.js';
import React, {Component} from 'react';

export default class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unauthorized: false,
            lastChat: this.props.lastChat
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.handleChatClick = this.handleChatClick.bind(this);
        this.updateChats = this.updateChats.bind(this);
    }

    componentDidMount() {
        this.getChats();
        if (!this.socket) {
            this.connectWithSocket();
        }
    }

    componentDidUpdate(prevProps) {
        if (!this.props.updatedOrNewChat || (prevProps.updatedOrNewChat === this.props.updatedOrNewChat)) {
            return;
        }
        this.updateChats(this.props.updatedOrNewChat.members[0], this.props.updatedOrNewChat.lastMessage);
    }

    updateChats(sender, text) {
        let chat = this.state.chats.find(chat => chat.members.includes(sender));
        if (!chat) {
            chat = {members: [sender], lastMessage: text};
            const updatedChats = [chat, ...this.state.chats];
            this.setState({chats: updatedChats});
        } else {
            const prevChatsState = this.state.chats;
            chat.lastMessage = text;
            prevChatsState.splice(prevChatsState.indexOf(chat), 1);
            this.setState({chats: [chat, ...prevChatsState]});
        }
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

    connectWithSocket() {
        this.socket = apiWebsocket.instance;
        this.socket.subscribe('message', event => {
            const message = JSON.parse(event.data);
            const sender = message.from;
            this.updateChats(sender, message.text);
        });
    }

    handleSearch(event) {
        const nicknamePart = event.target.value;
        this.setState({search: nicknamePart});
        if (!nicknamePart) {
            this.setState({searchResults: null});
            return;
        }
        apiSearch(nicknamePart).then(response => {
            switch (response.status) {
                case http.OK:
                    response.json().then((body) => {
                        this.setState({searchResults: body});
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

    handleChatClick(event) {
        const nickname = event.currentTarget.dataset.nickname;
        this.setState({searchResults: null, search: ''});
        this.props.onChatOpen(nickname);
    }

    render() {
        return (
            <div className={'chats'}>
                <div className={'search-wrpper'}>
                    <Input className={'chats-search'} value={this.state.search} placeholder={'Поиск'}
                           onChange={this.handleSearch}/>
                    <div className={(this.state.searchResults?.length) ? 'chats-search-results' : 'display-none'}>
                        {this.state.searchResults?.map((nickname, index) => {
                            return <div key={index} data-nickname={nickname} className={'chats-search-result'}
                                        onClick={this.handleChatClick}>
                                <img className={'chats-item-avatar'} src={'default_avatar.png'} alt={'avatar'}/>
                                <div className={'chats-item-nickname'}>{nickname}</div>
                            </div>
                        })}
                    </div>
                </div>
                <div className={'chats-items'}>
                    {this.state.chats?.map((chat, index) => {
                        return <div key={index} data-nickname={chat.members[0]} className={'chats-item'}
                                    onClick={this.handleChatClick}>
                            <div>
                                <img className={'chats-item-avatar'} src={'default_avatar.png'} alt={'avatar'}/>
                            </div>
                            <div>
                                <div className={'chats-item-nickname'}>{chat.members}</div>
                                <div className={'chats-item-last-message'}>{chat.lastMessage}</div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        );
    }
}

