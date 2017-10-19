import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';

class LocationInput extends React.Component{

    constructor(props){
        super(props);
        this.state = {location: 'location_off'};
    }

    hoverLocation() {
        this.state.location == 'location_off' ? this.setState({ hoverLocation: true }) : null;
    }
    
    hoverOutLocation() {
        this.setState({ hoverLocation: false });
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

        const {locationField,location,updateLocationField,
               toggleLocation, hoverLocation,hoverOutLocation,style} = this.props;

        return (
            <Paper zDepth={1} className='searchContainer' id="cityField">
                <TextField
                    hintText='City'
                    className='locationTextField'
                    fullWidth={true}
                    inputStyle={style}
                    hintStyle={style}
                    onChange={(e) => updateLocationField(e)}
                    value={locationField}
                />
                <i className="material-icons locationIcon" id={location}
                    onMouseEnter={() => this.hoverLocation()}
                    onClick={() => toggleLocation()}
                    onMouseLeave={() => this.hoverOutLocation()}
                >
                {location}
                {this.state.hoverLocation ? toolTip : null}
                </i>
            </Paper>
        )
    }


}

export default LocationInput;



