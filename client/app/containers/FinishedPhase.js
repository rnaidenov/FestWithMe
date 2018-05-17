import React from 'react';
import { updateTicketPrice } from '../actions/priceUpdateActions';
import PriceBreakdown from '../components/PriceBreakdown';
import CurrencyConverter from './CurrencyConverter';


class FinishedPhase extends React.Component {

    constructor(props) {
        super(props);
        this.state = { carret: 'arrow_drop_up', isPricebreakdownSelected: false };
        this.closePriceBreakdownMobile = this.closePriceBreakdownMobile.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.closePriceBreakdownMobile);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.closePriceBreakdownMobile);
    }

    componentWillReceiveProps(newProps) {
        const { screenSize: newScreenSize } = newProps;
        const { screenSize } = this.state;

        if (screenSize !== newScreenSize) {
            this.setState({ screenSize: newScreenSize });
        }
    }

    closePriceBreakdown() {
        this.setState({ isPricebreakdownSelected: false, carret: 'arrow_drop_up' });
    }

    togglePriceBreakdown = () => {
        if (this.state.isPricebreakdownSelected) {
            this.closePriceBreakdown();
        } else {
            this.setState({ isPricebreakdownSelected: true, carret: 'arrow_drop_down' });
        }
    }

    closePriceBreakdownMobile = e => {
        const { isPricebreakdownSelected, screenSize } = this.state;
        if (this.wrapperRef && !this.wrapperRef.contains(e.target) && screenSize === 'phone') {
            if (isPricebreakdownSelected) {
                this.closePriceBreakdown();
            }
        }
    }



    render() {

        const { screenSize } = this.props;
        const { carret, isPricebreakdownSelected } = this.state;
        const { currency, festivalName, priceDetails, searchDetails, destination } = this.props;
        const moreThanOnePerson = searchDetails.numPeople > 1;

        const priceBreakdownCarret = (
            <div>
                <p className="priceBreakdown" id="priceBreakdownLabel">
                    Price breakdown
              </p>
                <i class="material-icons priceBreakdown"
                    id='carretDropdown'
                    onClick={this.togglePriceBreakdown}>
                    {carret}
                </i>
            </div>
        )

        return (

            <div className='finishedResultsWrap'>
                <CurrencyConverter
                    prices={priceDetails}
                    currency={currency}
                />
                <div className='resultWrap'>
                    <p id='resultsLabel'>
                        <span className="resultText">Going to </span>
                        <span className="festivalNameLabel">{festivalName}</span>
                        <span className="resultText"> will cost {moreThanOnePerson ? null : 'you'} </span>
                        <span className="totalPriceLabel">{currency}{priceDetails.totalPrice}</span>
                        {moreThanOnePerson ? <span className="resultText"> per person</span> : null}
                    </p>
                <div className="priceBreakdownWrap">
                    {screenSize !== 'desktop' ? priceBreakdownCarret : null}
                </div>
            </div>
            <div ref={wrapper => this.wrapperRef = wrapper} className='breakdownContainerWrap'>
                <PriceBreakdown
                    prices={priceDetails}
                    destination={destination}
                    isSelected={isPricebreakdownSelected}
                    currency={currency}
                    updateTicketPrice={updateTicketPrice}
                    screenSize={screenSize}
                    searchDetails={searchDetails}
                />
            </div>
            </div >

        )
    }
}



export default FinishedPhase;