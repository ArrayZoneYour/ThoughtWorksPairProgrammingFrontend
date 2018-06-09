import React from 'react'

const Button = (props) => {
    return (
        <button className="btn btn-success" onClick={props.handleClick()}>重新开始</button>        
    );
}

export default Button;