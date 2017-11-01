import React from 'react';

const FlagIcon = ({ currencyName, countryName, customStyle }) => {
    
    return (
        <span>
            <p className='currencyLabel'>{currencyName}</p>
            <img
                className={customStyle || 'currencyFlagIconSmall'}
                src={require(`../public/${countryName}.svg`)} />
                <i class="material-icons priceBreakdown"
                    id='carretDropdown'/>
        </span>
    )
}


export default FlagIcon;

