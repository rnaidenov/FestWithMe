import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';



function FestivalInput ({festivals,updateSearchInput, style}) {
    return (
        <Paper zDepth={1} className='searchContainer' id="festivalField">
            <AutoComplete
                dataSource={festivals}
                filter={AutoComplete.caseInsensitiveFilter}
                hintText='Festival'
                fullWidth={true}
                inputStyle={style}
                hintStyle={style}
                onUpdateInput={(festivalName) => { updateSearchInput(festivalName) }}
            />
        </Paper>
    )

}

export default FestivalInput;