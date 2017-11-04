import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import PriceBreakdown from '../components/priceBreakdown';
import { changeCurrency } from '../actions/priceBreakdownActions';
import CurrencyDropdown from '../components/currencyDropdown';
import '../styles/search.css';


@connect(store => {
    return {
        searchResults: store.searchResults,
        convertedPrices: store.currencyChanger
    }
})


class CurrencyConverter extends React.Component {

    constructor(props) {
        super(props);
        this.state = { smileyClass: 'smileyContentWrapper', chatBubbleClass: 'chatBubble right', currency: this.props.searchResults.currencySymbol };
    }


    componentDidMount() {
        setTimeout(() => {
            this.setState({ smileyClass: 'smileyContentWrapper right' }, () => {
                // setTimeout(()=>{
                this.setState({ chatBubbleClass: 'chatBubble right visible' });
                // },750);
            })
        }, 2000);    
    }


    componentWillUpdate(newProps) {
        const convertedPrices = newProps.convertedPrices.details;

        if (convertedPrices != null && this.state.currency !== convertedPrices.currencySymbol) {
            this.setState({ currency: convertedPrices.currencySymbol });
        }
    }


    changeCurrency(toCurrency) {
        const { searchResults, convertedPrices } = this.props;
        const { currency: fromCurrency } = this.state;

        if (convertedPrices.details != null) {
            this.props.dispatch(changeCurrency(fromCurrency, toCurrency, convertedPrices.details));
        } else {
            this.props.dispatch(changeCurrency(fromCurrency, toCurrency, searchResults.prices.details));
        }
    }


    render() {
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
                    <div class="talktext">
                        <p>Would you like to change the currency?</p>
                    </div>
                </div>
                <div className='currencyDropdownWrap'>
                    {chatBubbleClass === 'chatBubble right visible'
                        ? <CurrencyDropdown changeCurrency={(symbol) => this.changeCurrency(symbol)} />
                        : null}
                </div>
            </div>
        )
    }
}

export default CurrencyConverter;
