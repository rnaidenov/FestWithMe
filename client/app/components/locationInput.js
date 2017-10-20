import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getLocation } from '../actions/searchActions';

@connect(store => {
    return {
        location: store.location
    }
})

class LocationInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = { location: 'location_off' };
    }

    toggleLocation() {
        if (this.state.location === 'location_on') {
            this.setState({ location: 'location_off' })
        } else {
            this.props.dispatch(getLocation());
            this.setState({ location: 'location_on' });
            setTimeout(() => {
                this.setState({ locationField: this.props.location });
            }, 400);
        }
    }

    hoverLocation() {
        this.state.location == 'location_off' ? this.setState({ hoverLocation: true }) : null;
    }

    hoverOutLocation() {
        this.setState({ hoverLocation: false });
    }

    updateLocationField(e) {
        this.setState({ locationField: e.target.value });
        this.props.updateLocationInput(this.state.locationField);
    }


    render() {

        const toolTip = (
            <div class="toolTipBox">
                <div class="body">
                    <span class="tip tip-down"></span>
                    <p className="toolTipMessage">Click here to automatically detect and add your location</p>
                </div>
            </div>
        )

        const { locationField, location, hoverLocation } = this.state;
        const { inputStyle } = this.props;


        return (
            <Paper zDepth={1} className='searchContainer' id="cityField">
                <TextField
                    hintText='City'
                    className='locationTextField'
                    fullWidth={true}
                    inputStyle={inputStyle}
                    hintStyle={inputStyle}
                    onChange={(e) => this.updateLocationField(e)}
                    value={locationField}
                />
                <i className="material-icons locationIcon" id={location}
                    onMouseEnter={() => this.hoverLocation()}
                    onClick={() => this.toggleLocation()}
                    onMouseLeave={() => this.hoverOutLocation()}
                >
                    {location}
                    {hoverLocation ? toolTip : null}
                </i>
            </Paper>
        )
    }


}

export default LocationInput;



