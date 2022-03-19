import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FlagIcon from './FlagIcon';

class CurrencyDropdown extends React.Component {


    constructor(props) {
        super(props);
        this.currencies = [{ name: 'USD', icon: 'united-states', symbol: '$' },
        { name: 'EUR', icon: 'european-union', symbol: '€' },
        { name: 'GBP', icon: 'united-kingdom', symbol: '£' }];
        this.state = { currencyValue: this.currencies[1] };
    }

    changeCurrency(event, currencyValue) {
        this.setState({ currencyValue });
        this.props.changeCurrency(currencyValue.symbol)
    }

    componentDidMount(){
        const { onReloadCurrency } = this.props;
        const onReloadCurrencyValue = this.currencies.filter(currencyOption => currencyOption.symbol === onReloadCurrency)[0];
        if (this.state.currencyValue.symbol !== onReloadCurrency) this.setState({ currencyValue: onReloadCurrencyValue });
    }

    render() {

        const { onReloadCurrency } = this.props;
        const { currencyValue } = this.state;


        const currencyChoices = this.currencies.map((currency, idx) => {
            return (
                <MenuItem
                    key={idx}
                    value={currency}
                    rightIcon={<FlagIcon currencyName={currency.name} countryName={currency.icon} />}
                />
            )
        });


        return (
            <div className='currencyDropdownWrap'>
                <Select
                    iconButtonElement={<IconButton style={{ marginTop: '-15px', width: '65px' }}>
                        <FlagIcon
                            currencyName={currencyValue.name}
                            countryName={currencyValue.icon}
                            isSelectedIcon={true}
                        />
                    </IconButton>}
                    onChange={(event, currencyValue) => this.changeCurrency(event, currencyValue)}
                    value={this.state.currencyValue}
                    menuStyle={{ width: '100px', overflow: 'hidden' }}
                    className="currencyMenu"
                >
                    {currencyChoices}
                </Select>
                <span className="carretWrap">
                    <i class="material-icons currencyCarret">
                        arrow_drop_down
                    </i>
                </span>
            </div>
        )
    }
}

export default CurrencyDropdown;