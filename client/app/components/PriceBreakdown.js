import React from 'react';
import Paper from 'material-ui/Paper';
import EventDetails from '../containers/EventDetails';
import FlightDetails from './FlightDetails';
import HousingDetails from '../containers/HousingDetails';
import CustomCarousel from './CustomCarousel';


class PriceBreakdown extends React.Component {

  constructor(props) {
    super(props);
    this.openResultLink = this.openResultLink.bind(this);
    this.state = { showContent: false, priceBreakdownClass: 'priceBreakdownContainer' };
    this.inactiveTicketInput = null;
    this.accommodationInfo = null;
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showContent: true });
    }, 1000);
  }

  componentWillReceiveProps(newProps) {
    const { priceDetails, currency, isSelected } = newProps;
    
    if (priceDetails !== this.state.priceDetails) {
      this.setState({ priceDetails, currency })
    }
    this.togglePriceBreakdown(isSelected);
  }

  togglePriceBreakdown(isSelected) {
    const breakdownIsShown = this.state.priceBreakdownClass === 'priceBreakdownContainer selected';

    if (isSelected) {
      if (!breakdownIsShown) {
        this.setState({ priceBreakdownClass: 'priceBreakdownContainer selected' });
      }
    } else {
      if (breakdownIsShown) {
        this.setState({ priceBreakdownClass: 'priceBreakdownContainer unselected' }, () => {
          setTimeout(() => {
            this.setState({ priceBreakdownClass: 'priceBreakdownContainer' });
          }, 1000);
        })
      }
    }
  }

  openResultLink = (e, url) => {
    if ((this.inactiveTicketInput===null || !this.inactiveTicketInput.contains(e.target)) && e.target !== this.accommodationInfo) window.open(url, "_blank");
  }

  render() {

    const { prices, currency, screenSize } = this.props;
    const { flightDetails, eventDetails, housingDetails, totalPrice } = prices;
    const { priceBreakdownClass, showContent } = this.state;

    const priceBreakdownContent = [ 
                                    {
                                      element:  <EventDetails
                                                  details={eventDetails}
                                                  currency={currency}
                                                  setInactiveTicketInputRef={el => this.inactiveTicketInput = el}
                                                />,
                                      ref: eventDetails.url
                                    },
                                    { element:  <FlightDetails
                                                  currency={currency}
                                                  details={flightDetails}
                                                />, 
                                      ref: flightDetails.url 
                                    },
                                    {
                                      element:  <HousingDetails
                                                  details={housingDetails}
                                                  currency={currency}
                                                  setAccommodationInfoRef={el => this.accommodationInfo = el}
                                                />, 
                                      ref: housingDetails.url
                                    }
                                  ];

    const content = priceBreakdownContent.map((content, idx) => (
      <Paper className='contentType' id={`content${idx}`} key={idx} onClick={(e) => this.openResultLink(e, content.ref)}>
        {content.element}
      </Paper>
    ));

    const priceBreakdownBigScreen = (
      <div className='priceBreakdownWrap'>{content}</div>
    )

    const priceBreakdownMobileScreen = (
      <Paper zDepth={1} className={priceBreakdownClass}>
        <CustomCarousel
          onClick={this.openResultLink}
          slideWidth={1}
          content={priceBreakdownContent}
        />
      </Paper>
    )

    return (
      screenSize !== 'desktop' ? priceBreakdownMobileScreen : priceBreakdownBigScreen
    )
    
  }
}

export default PriceBreakdown;
