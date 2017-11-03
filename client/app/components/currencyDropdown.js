import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FlagIcon from './flagIcon';



class CurrencyDropdown extends React.Component {


    constructor(props){
        super(props);
        this.currencies = [{name:'USD',icon:'united-states',symbol:'$'},
                           {name:'EUR',icon:'european-union',symbol:'€'},
                           {name:'GBP',icon:'united-kingdom',symbol:'£'}];
        this.state={currencyValue:this.currencies[0]};
    }

    changeCurrency(event, currencyValue) {
        this.setState({currencyValue});
        this.props.changeCurrency(currencyValue.symbol)
    }


    render() {
        
        const { currencyValue } = this.state;
        

        const currencyChoices = this.currencies.map((currency,idx) => {
            return (
                <MenuItem 
                    key={idx}
                    value={currency}  
                    rightIcon={<FlagIcon currencyName={currency.name} countryName={currency.icon}/>} 
                />
            )
        });


        return(
            <div>
                <IconMenu
                    iconButtonElement={<IconButton style={{marginTop:'-15px',width:'65px'}}>
                                                    <FlagIcon 
                                                        currencyName={currencyValue.name} 
                                                        countryName={currencyValue.icon} 
                                                        isSelectedIcon={true}
                                                    />
                                        </IconButton>}
                    onChange={(event, currencyValue) => this.changeCurrency(event, currencyValue)}
                    value={this.state.currencyValue}
                    menuStyle={{width:'100px',overflow:'hidden'}}
                >
                {currencyChoices}
                </IconMenu> 
                <i class="material-icons currencyCarret">
                    arrow_drop_down
                </i>
            </div>
        )
    }
}

export default CurrencyDropdown;