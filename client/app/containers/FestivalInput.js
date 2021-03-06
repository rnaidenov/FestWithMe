import React from 'react';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadFestivals } from '../actions/searchActions';


@connect(store => {
    return {
        festivals: store.festivals,
    }
})

class FestivalInput extends React.Component {

    constructor(props){
        super(props);
        this.state = { festivalName : '' };
        this.errorMessage = 'Please enter the name of the festival you\'re going to';
    }

    componentWillMount() {
        this.props.dispatch(loadFestivals());
    }

    updateFestivalField(festivalName) {
        this.setState({ festivalName });
        this.props.updateFestivalInput(festivalName);
    }

    render () {

        const { festivalName } = this.state;
        const { value, inputStyle, errorStyle, festivals, missingFestival } = this.props;
        
        return (
            <Paper zDepth={1} className='searchContainer' id="festivalField">
                <AutoComplete
                    id='FESTIVAL_INPUT'
                    dataSource={festivals}
                    filter={AutoComplete.caseInsensitiveFilter}
                    hintText={ missingFestival ? '' : 'Festival' }
                    fullWidth={true}
                    inputStyle={inputStyle}
                    hintStyle={inputStyle}
                    errorText={(missingFestival && !festivalName.length) && this.errorMessage}
                    errorStyle={errorStyle}
                    searchText={ value || festivalName }
                    onUpdateInput={(festivalName) => { this.updateFestivalField(festivalName) }}
                />
            </Paper>
        )
    }

}

export default FestivalInput;