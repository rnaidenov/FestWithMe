import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField'
import injectTapEventPlugin from 'react-tap-event-plugin';

const inputStyle = { paddingLeft: '12px' };

function NightsSelector({ nightsOfStay, changeNights }) {
    return (
        <Paper zDepth={1} className='searchContainer' id="nightsField">
            <TextField
                fullWidth={true}
                inputStyle={inputStyle}
                style={{ width: '40%' }}
                onChange={(e) => changeNights(e)}
                underlineShow={false}
                value={nightsOfStay}
            />
            <p className='nightsLabel'>{nightsOfStay > 1 ? 'nights' : 'night'}</p>
        </Paper>
    )
}

export default NightsSelector;

