import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const PastEvent = () => (
    <div className='soldOutWrap'>
        <div className='loaderSmileyWrap'>
            <CircularProgress
                size={100}
                mode="determinate"
                thickness={3}
                value={100}
                color="#7f3e5d"
                className='determinateCircle' />
            <p className='smiley' id='sad'>:(</p>
        </div>
        <p className='waitingMsg' id='soldOutLabel'>It seems that this event has finished.</p>
    </div>
)


export { PastEvent };