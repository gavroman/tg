import React from 'react';
import './Input.sass';

export default function Input(props) {
    const type = props.type || 'text';
    const value = props.value || '';
    const className = (props.className || '') + ' input';
    const placeholder = props.placeholder || '';
        return (
            <input className={className} type={type} value={value} placeholder={placeholder}
                   onChange={props.onChange}/>
    );
}
