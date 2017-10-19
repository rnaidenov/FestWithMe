import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

function PeopleSelector({ numPeople,selectNumPeople }) {


    const getOptions = () => {
        const options = [];
        for (let i = 1; i < 17; i++) {
            const option = i !== 1 ? `${i} people` : `${i} person`
            options.push(option);
        }
        return options;
    }

    const selectOptions = getOptions().map((option, idx) => {
        return (<MenuItem value={idx} primaryText={option} />);
    });

    return (
        <Paper zDepth={1} className='searchContainer' id="peopleField">
            <SelectField
                value={numPeople}
                onChange={(event, idx, value) => selectNumPeople(event, idx, value)}
                style={{ width: '100%' }}
            >
                {selectOptions}
            </SelectField>
        </Paper>
    )

}

export default PeopleSelector;