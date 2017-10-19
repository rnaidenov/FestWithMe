import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField'
import injectTapEventPlugin from 'react-tap-event-plugin';

const inputStyle = { paddingLeft: '12px' };

class NightsSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = { nightsOfStay: '1' }
    }

    updateNightsField(e) {
        this.setState({ nightsOfStay: e.target.value });
    }

    render() {
        return (

            <Paper zDepth={1} className='searchContainer' id="nightsField">
                <TextField
                    fullWidth={true}
                    inputStyle={inputStyle}
                    style={{width:'35%'}}
                    onChange={(e) => this.updateNightsField(e)}
                    underlineShow={false}
                    value={this.state.nightsOfStay}
                />
                <p className='nightsLabel'>{this.state.nightsOfStay > 1 ? 'nights' : 'night'}</p>
            </Paper>

        )
    }
}

export default NightsSelector;

