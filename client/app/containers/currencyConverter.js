import React from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import { changeCurrency } from '../actions/priceBreakdownActions';
import CurrencyDropdown from '../components/currencyDropdown';
import '../styles/currencyConverter.css';


@connect(store => {
    return {
        convertedPrices: store.currencyChanger
    }
})


class CurrencyConverter extends React.Component {

    constructor(props) {
        super(props);
        this.state = { smileyClass: 'smileyContentWrapper', chatBubbleClass: 'chatBubble right', currency: this.props.defaultCurrency };
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


    componentWillUpdate(newProps) {
        const { convertedPrices: { details: convertedDetails }, priceDetails: newPriceDetails} = newProps;
        const { priceDetails } = this.state;

        if (convertedDetails != null && this.state.currency !== convertedDetails.currencySymbol) {
            this.setState({ currency: convertedDetails.currencySymbol });
        }

        if (newPriceDetails!==priceDetails) {
            this.setState({priceDetails:newPriceDetails});
        }
    }

    changeCurrency(toCurrency) {
        const { convertedPrices } = this.props;
        const { currency: fromCurrency } = this.state;
        this.props.dispatch(changeCurrency(fromCurrency, toCurrency, this.props.priceDetails)); 
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
