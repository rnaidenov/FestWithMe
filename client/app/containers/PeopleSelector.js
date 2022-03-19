import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
// import injectTapEventPlugin from 'react-tap-event-plugin';
// injectTapEventPlugin();



class PeopleSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = { numPeople: 0 };
    }

    selectNumPeople(event, index, numPeople) {
        this.setState({ numPeople })
        this.props.updateNumPeople(numPeople);
    };

    getOptions() {
        const options = [];
        for (let i = 1; i < 17; i++) {
            const option = i !== 1 ? `${i} people` : `${i} person`
            options.push(option);
        }
        return options;
    }

    render() {

        const { numPeople } = this.state;
        const { value, inputStyle } = this.props;
        const menuOptionStyle = { ...inputStyle, fontSize:'20px', paddingLeft:'0px' };
        const labelStyle =  {...inputStyle, float:'left' };
        
        const selectOptions = this.getOptions().map((option, idx) => {
            return (<MenuItem
                key={idx + 1}
                value={idx + 1}
                style={menuOptionStyle}
                primaryText={option}
            />);
        });

        return (
            <Paper zDepth={1} className='searchContainer' id="peopleField">
                <Select
                    // TODO:
                    value={ value || numPeople }
                    onChange={(event, idx, value) => this.selectNumPeople(event, idx, value)}
                    style={{ width: '100%' }}
                    labelStyle={labelStyle}
                >
                    {selectOptions}
                </Select>
            </Paper>
        )
    }
}

export default PeopleSelector;