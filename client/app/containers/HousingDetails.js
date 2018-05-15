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
        console.log(this.props);
        const { details, currency, setAccommodationInfoRef, searchResults : { destination } } = this.props;


        const accommodationTypes = details.properties.map((propertyType, key) => {
            return (
                <div key={key} className='accommodationTypeWrap'>
                    <div className="accomodationInfo">
                        <img src={require(`../../dist/public/${propertyType.icon}`)} className='homeTypeIcon' />
                    </div>
                    <div className='accomodationInfo' id='typeAndPrice'><p>{propertyType.type}</p></div>
                    <div className='accomodationInfo' id='typeAndPrice'><p>{currency}{propertyType.price}</p></div>
                </div>
            )
        });

        return (
            <div className="flexWrap">
                <h1 className='priceBreakdownHeading'>Accommodation</h1>
                <Tooltip
                    component={<img src={require('../../dist/public/info.svg')}
                        className='infoIcon'
                        ref={setAccommodationInfoRef}
                    />}
                    text={`These are the average prices for the different room types in ${destination}`}
                    position='right center'
                />
                <div className="contentWrap">
                    {accommodationTypes}
                </div>
            </div>
        )
    }
}


export default HousingDetails;