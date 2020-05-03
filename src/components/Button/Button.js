import React from 'react';
import './Button.sass'

export default function Button(props) {
    let className = (props.type) ? 'button--' + props.type : 'button--primary';
    className += props.className ? ' ' + props.className : '';
    const text = props.text || '';
    return (
        <button className={className} onClick={props.onClick}>{text}</button>
    );
}
