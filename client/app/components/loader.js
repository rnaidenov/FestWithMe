import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { connect } from 'react-redux';

import { loadavg } from 'os';



@connect(store => {
    return {
      searchResults: store.searchResults
    }
  })

class Loader extends React.Component {

    constructor(props) {
        super(props);
        this.state={ loaderValue:0 };
    }
    

    // async increaseLoader(loadedValue, maxLoadValue){
    //     let difference=maxLoadValue - loadedValue;

    //     while(this.state.loaderValue < maxLoadValue) {
    //         await setTimeout(() => {
    //             this.setState({ loaderValue: maxLoadValue - difference });
    //             difference = Math.floor(difference/1.2)-1;
    //         }, 1);
    //         console.log("LOADED VALUE: " + loadedValue);
    //         console.log("LOADER VALUE: " +this.state.loaderValue);
    //         if(loadedValue > this.state.loaderValue){
    //             this.setState({ loaderValue: loadedValue });
    //             break;
    //         }
    //         console.log(this.state.loaderValue);
    //     }
    // }


    render() {

        

        // const { loadedValue, maxLoadValue, color, text } = this.props;
        // const { loaderValue } = this.state;
        const { searchResults } = this.props;
        const { loaderValue, text, color, searching, isActive } = searchResults || {};

        
        

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