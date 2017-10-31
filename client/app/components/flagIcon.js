import React from 'react';

const FlagIcon = ({ currencyName, countryName, customStyle }) => {
    
    return (
        <span>
            <p className='currencyLabel'>{currencyName}</p>
            <img
                className={customStyle || 'currencyFlagIconSmall'}
                src={require(`../public/${countryName}.svg`)} />
        </span>
    )
}


export default FlagIcon;

