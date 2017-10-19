import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import injectTapEventPlugin from 'react-tap-event-plugin';


const selectorStyle = {
    width:'100%'
}

class PeopleSelector extends React.Component {

    constructor(props){
        super(props);
        this.state={numPeople:0};
    }
    
    componentWillMount() {
        injectTapEventPlugin();
    }

    selectNumPeople (event, index, numPeople) {
        console.log(index)
        this.setState({numPeople})
    };

    getOptions () {
        const options = [];
        for(let i=1;i<17;i++) {
            const option = i!==1 ? `${i} people` : `${i} person`
            options.push(option);
        }
        return options;
    }

    

    render () {

        const selectOptions = this.getOptions().map((option,idx) => {
            return (<MenuItem value={idx} primaryText={option} />);
        });

        return (
            <Paper zDepth={1} className='searchContainer' id="peopleField">
                <SelectField
                    value={this.state.numPeople}
                    onChange={(event,idx,value) => this.selectNumPeople(event,idx,value)}
                    style={selectorStyle}
                >
                {selectOptions}
                </SelectField>
            </Paper>
        )
    }
}

function PeopleSelector () {

    
}

export default PeopleSelector;