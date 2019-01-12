import React from 'react';
import { connect } from 'react-redux';
import { updateTicketPrice } from '../actions/priceUpdateActions';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


@connect(store => {
    return {
        searchResults: store.searchResults
    }
})

class EventDetails extends React.Component {


    constructor(props) {
        super(props);
        this.state = { newPriceMissing: true };
    }

    updatePriceAmt = (e, newPriceAmount) => {
        this.setState({ newPriceAmount, newPriceMissing: false });
    }

    updateTicketPrice = () => {
        const { dispatch, searchResults: { prices, searchDetails } } = this.props;
        const { newPriceAmount } = this.state;
        dispatch(updateTicketPrice(prices, newPriceAmount, searchDetails));
    }


    render() {

        const { details, currency, setInactiveTicketInputRef } = this.props;
        const { newPriceMissing, newPriceAmount } = this.state;

        const soldOutFestival = (
            <div className='resultsContainer'>
                <h1 className='priceBreakdownHeading'>Festival ticket</h1>
                <div className="contentWrap">
                    <div className="mainContent">
                        <img src={require('../../dist/public/inactiveTicket.svg')} className='contentIcon inactive' />
                        <p className='price-update-text'>
                            Unfortunately, there is no information about the price of the event on Resident Advisor.
            <br />
                            <span className='price-update-text prompt'>If you have purchased a ticket already, you can enter the price amount in the input box below.</span>
                        </p>
                    </div>
                    <div className='inputWrap' ref={setInactiveTicketInputRef}>
                        <Paper className='price-update-input'>
                            <TextField
                                underlineShow={false}
                                style={{ width: '50px' }}
                                value={newPriceAmount}
                                onChange={this.updatePriceAmt}
                                id='priceInputField'
                            />
                        </Paper>
                        <RaisedButton
                            className='price-update-btn'
                            disabled={newPriceMissing}
                            onClick={this.updateTicketPrice}><p className='price-update-btn-text'>OK</p></RaisedButton>
                    </div>
                </div>
            </div>
        )

        const activeFestival = (
            <div className='resultsContainer'> 
                <h1 className='priceBreakdownHeading'>Festival ticket</h1>
                <div className='contentWrap'>
                    <div className="mainContent">
                        <img src={require('../../dist/public/ticket.svg')} className='contentIcon' />
                    </div>
                    <p className='priceLabel'>{currency}{details.price}</p>
                </div>
            </div>
        )


        return details.price ? activeFestival : soldOutFestival
    }

}


export default EventDetails;