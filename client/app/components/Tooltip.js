import React from 'react';
import { Popup } from 'semantic-ui-react'
import '../../../node_modules/semantic-ui-css/components/popup.css';

const Tooltip = ({ component, text, position }) => {
    
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

export default Tooltip;