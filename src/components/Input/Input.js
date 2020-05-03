import React from 'react';
import './Input.sass';

export default function Input(props) {
    const type = props.type || 'text';
    const value = props.value || '';
    const className = (props.className || '') + ' input';
    return (
        <div>
            <input className={className} type={type} value={value} onChange={props.onChange}/>
        </div>
    );
}
