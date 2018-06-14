import React from 'react';
import Tooltip from '../components/Tooltip';
import { connect } from 'react-redux';


@connect(store => {
    return {
        searchResults: store.searchResults
    }
})

class HousingDetails extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { details, currency, setAccommodationInfoRef, searchResults: { destination } } = this.props;

        if (details.error) return (
            <div className="flexWrap">
                <h1 className='priceBreakdownHeading'>Accommodation {accomodationInfo}</h1>

                <div className="contentWrap">
                    Sorry, but something went wrong behind the scenes :(
                </div>
            </div>
        )

        const accommodationTypes = details.properties.map((propertyType, key) => {


            const propertyPrice = propertyType.price
                                                    ? <div className='accomodationInfo typeAndPrice'><p>{currency}{propertyType.price}</p></div>
                                                    : <span className='accomodationInfo typeAndPrice' id='noPriceInfoTxt'>No information</span>

            return (
                <div key={key} className='accommodationTypeWrap'>
                    <div className="accomodationInfo">
                        <img src={require(`../../dist/public/${propertyType.icon}`)} className='homeTypeIcon' />
                    </div>
                    <div className='accomodationInfo typeAndPrice'><p>{propertyType.type}</p></div>
                    {propertyPrice}
                </div>
            )
        });


        const accomodationInfo = (
            <Tooltip
                component={<img src={require('../../dist/public/info.svg')}
                    className='infoIcon'
                    ref={setAccommodationInfoRef}
                />}
                text={`These are the average prices for the different room types in ${destination}`}
                position='right center'
            />
        )

        return (
            <div className="flexWrap">
                <h1 className='priceBreakdownHeading'>Accommodation {accomodationInfo}</h1>

                <div className="contentWrap">
                    {accommodationTypes}
                </div>
            </div>
        )
    }
}


export default HousingDetails;