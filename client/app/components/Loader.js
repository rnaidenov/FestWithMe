import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';

@connect(store => {
    return {
      searchResults: store.searchResults
    }
})

class Loader extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { searchResults } = this.props;
        const { loaderValue, text, color } = searchResults || {};

        return (
            <div className="loaderWrap">
                <div className='smileyWrap'>
                    <CircularProgress
                        size={100}
                        mode="determinate"
                        thickness={3}
                        value={loaderValue}
                        color={color}
                        className='determinateCircle' />
                    <CircularProgress
                        size={100}
                        thickness={3}
                        color="#7c5652"
                        className='indeterminateCircle' />
                </div>
                <div className="waitingMsgWrap">
                    <p className='waitingMsg'>
                        {text || ''}
                    </p>
                </div>
            </div>
        )
    }
}


export { Loader };