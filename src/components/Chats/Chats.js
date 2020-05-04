import 'Components/Chats/Chats.sass'
import Input from 'Components/Input/Input.js';
import * as http from 'http-status-codes';
import {apiGetChats, apiSearch} from 'Libs/apiCalls.js';
import React, {Component} from 'react';

export default class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unauthorized: false
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.handleChatClick = this.handleChatClick.bind(this);
    }

    componentDidMount() {
        this.getChats()
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
        const id = event.currentTarget.dataset.id;
        this.setState({searchResults: null, search: ''});
        this.props.onChatOpen(this.state.searchResults[id]);
    }

    render() {
        return (
            <div className={'chats'}>
                <Input className={'chats-search'} value={this.state.search} placeholder={'Поиск'}
                       onChange={this.handleSearch}/>
                <div className={(this.state.searchResults?.length) ? 'chats-search-results' : 'display-none'}>
                    {this.state.searchResults?.map((nickname, index) => {
                        return <div key={index} data-id={index} className={'chats-search-result'}
                                    onClick={this.handleChatClick}>
                            <img className={'chats-item-avatar'} src={'default_avatar.png'} alt={'avatar'}/>
                            <div className={'chats-item-nickname'}>{nickname}</div>
                        </div>
                    })}
                </div>
                <div className={'chats-items'}>
                    {this.state.chats?.map((chat, index) => {
                        return <div key={index} className={'chats-item'}>
                            <div>
                                <img className={'chats-item-avatar'} src={'default_avatar.png'} alt={'avatar'}/>
                            </div>
                            <div>
                                <div className={'chats-item-nickname'}>{chat.members}</div>
                                <div className={'chats-item-last-message'}>Last message</div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        );
    }
}

