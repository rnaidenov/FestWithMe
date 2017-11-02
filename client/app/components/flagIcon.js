import React from 'react';

const FlagIcon = ({ currencyName, countryName, customStyle, isSelectedIcon }) => {
    
    return (
        <span>
            <p className='currencyLabel'>{currencyName}</p>
            <img
                className={isSelectedIcon ? 'currencyFlagIconSelected' : 'currencyFlagIconMenu'}
                src={require(`../public/${countryName}.svg`)} />
                <i class="material-icons priceBreakdown"
                    id='carretDropdown'/>
        </span>
    )
}


export default FlagIcon;

