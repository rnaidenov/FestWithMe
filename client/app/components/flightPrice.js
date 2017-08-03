import React from 'react';


function Price ({amount,currency}) {

  if (amount) {
    return (
      <div>
        {currency} {amount}
      </div>
    )
  }
  return (
    <div>
      Soemthing.
    </div>
  )



}

export default Price;
