import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

class NightsSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = { nightsOfStay: '1' };
    }

    changeNumOfNights(e) {
        if (e.target.value >= 1) {
            this.setState({ nightsOfStay: e.target.value }, () => {
                this.props.updateNightsField(this.state.nightsOfStay);
            });
        } else {
            this.setState({ nightsOfStay: '' });
        }
    }

    render () {

        const { nightsOfStay } = this.state;
        const { inputStyle } = this.props;

        return (
            <Paper zDepth={1} className='searchContainer' id="nightsField">
                <TextField
                    id='NIGHTS_SELECTOR'
                    style={{ width: '40%' }}
                    inputStyle={inputStyle}
                    onChange={(e) => this.changeNumOfNights(e)}
                    underlineShow={false}
                    value={nightsOfStay}
                />
                <p className='nightsLabel'>{nightsOfStay > 1 ? 'nights' : 'night'}</p>
            </Paper>
        )
    }

}

export default NightsSelector;

