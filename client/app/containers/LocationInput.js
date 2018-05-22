import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getLocation } from '../actions/searchActions';
import Tooltip from '../components/Tooltip'

@connect(store => {
    return {
        location: store.location
    }
})

class LocationInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = { location: 'location_off', locationField: '' };
        this.errorMessage = 'Please enter the name of the city you\'re travelling from';
        this.locationOn = 'location_on';
        this.locationOff = 'location_off';
    }

    toggleLocation() {
        if (this.state.autoLocate === true) {
            this.setState({ autoLocate: false, location: this.locationOff });
        } else {
            this.props.dispatch(getLocation());
            this.setState({ autoLocate: true, location: this.locationOn });
            setTimeout(() => {
                this.setState({ locationField: this.props.location });
            }, 400);
        }
    }

    updateLocationField(e) {
        this.setState({ locationField: e.target.value }, () => {
            this.props.updateLocationInput(this.state.locationField);
        });
    }

    handleEmptyInput() {
        if (this.props.missingLocation) {
            this.setState({ locationField: this.errorMessage });
        }
    }


    render() {


        const { locationField, location, hoverLocation, autoLocate } = this.state;
        const { inputStyle, errorStyle, inputFieldStyle, search, missingLocation, screenSize } = this.props;


        const locationIcon = (
            <i className="material-icons locationIcon" id={location}
                onClick={() => this.toggleLocation()}
            >
                {location}
            </i>
        )
        return (

            <Paper zDepth={1} className='searchContainer' id="cityField">
                <TextField
                    id='LOCATION_INPUT'
                    hintText={missingLocation ? '' : 'City'}
                    fullWidth={true}
                    inputStyle={inputStyle}
                    hintStyle={inputStyle}
                    style={inputFieldStyle}
                    onChange={(e) => this.updateLocationField(e)}
                    errorText={(missingLocation && !locationField.length) && this.errorMessage}
                    errorStyle={errorStyle}
                    value={locationField}
                />
                <Tooltip
                    component={locationIcon}
                    text='Click here to automatically detect and add your location'
                    position = { screenSize === 'desktop' ? 'bottom right' : 'top right' }
                />

            </Paper>

        )
    }


}

export default LocationInput;



