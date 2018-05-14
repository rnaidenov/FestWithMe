import React from 'react';
import { Popup } from 'semantic-ui-react'
import '../../../node_modules/semantic-ui-css/components/popup.css';

class Tooltip extends React.Component {
 

    constructor(props){
        super(props);
    }


    render() {


        const { component, text, position } = this.props;

        return (
            <Popup
              trigger={component}
              content={text}
              position={position}
              size='tiny'
              style={{ 'textAlign': 'center' }}
            />
        )
    }

}

export default Tooltip;