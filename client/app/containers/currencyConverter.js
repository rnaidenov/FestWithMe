import React from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import { changeCurrency } from '../actions/priceBreakdownActions';
import CurrencyDropdown from '../components/currencyDropdown';
import '../../dist/styles/currencyConverter.css';

@connect(store => {
    return {
        searchResults: store.searchResults,
        convertedPrices: store.currencyChanger
    }
})


class CurrencyConverter extends React.Component {

    constructor(props) {
        super(props);
        this.state = { smileyClass: 'smileyContentWrapper', chatBubbleClass: 'chatBubble right', currency: this.props.currency };
    }


    componentDidMount() {
        setTimeout(() => {
            this.setState({ smileyClass: 'smileyContentWrapper right' }, () => {
                setTimeout(()=>{
                    this.setState({ chatBubbleClass: 'chatBubble right visible' });
                },250);
            })
        }, 2000);    
    }


    componentWillReceiveProps(newProps) {
        const { prices: newPriceDetails, currency } = newProps;
        const { priceDetails } = this.state;

        if (newPriceDetails!==priceDetails) {
            this.setState({ priceDetails: newPriceDetails,currency });
        }
    }

    changeCurrency(toCurrency) {
        const { convertedPrices, prices } = this.props;
        const { currency: fromCurrency } = this.state;
        this.props.dispatch(changeCurrency(fromCurrency, toCurrency, prices)); 
    }


    render() {

        const { searchResults: { currency } } = this.props;
        console.log(this.props);
        console.log(`On reload currency should be ${currency}`);
        const { carret, priceBreakdownClass, smileyClass, chatBubbleClass } = this.state;

        return (
            <div className='loaderSmileyWrap'>
                <div className="smileyWrapper">
                    <div className={smileyClass}>
                        <CircularProgress
                            mode="determinate"
                            value={100}
                            size={100}
                            thickness={3}
                            color="#47140e"
                            className='determinateCircle'
                        />
                        <p className='smiley' id='happy'>:D</p>
                    </div>
                </div>
                <div class={chatBubbleClass}>
                    <p className='currencyDialogueText'>Would you like to change the currency?</p>
                    {chatBubbleClass === 'chatBubble right visible'
                        ? <CurrencyDropdown changeCurrency={(symbol) => this.changeCurrency(symbol)} onReloadCurrency={currency} />
                        : null}
                </div>
            </div>
        )
    }
}

export default CurrencyConverter;
