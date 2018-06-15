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
                    <p className='accommodationError'>
                        <span>Aaah <img src={require('../../dist/public/sad.svg')} className='accommodationErrorIcon sadFaceIcon' /> it seems that something went <span className='wrongTxt bold'>wrong</span></span>
                        <span className='festiveSpiritTxt'> Don't let this bring down your festive spirit <span className='bold'>!</span> </span>
                        <span className='redirectToAirbnbTxt'>
                            Just click anywhere on the card to be redirected to <img src={require('../../dist/public/airbnb.svg')} className='accommodationErrorIcon' /> to find your holiday home
                        </span>
                    </p>
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