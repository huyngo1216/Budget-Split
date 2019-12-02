import React from 'react';
require('typeface-roboto');

function Amount(props) {
    return (
        <div id='amount-display'>
            <h2>{props.label}</h2>
            <h3>{props.value}</h3>
        </div>
    )
}

export default Amount;