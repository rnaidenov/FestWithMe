'use strict';

function formatDate (date,format) {
  const [day, month, year] = date.split(/\s/);
  const months = new Map ([
    ['January', '01'],
    ['February', '02'],
    ['March', '03'],
    ['April', '04'],
    ['May', '05'],
    ['June', '06'],
    ['July', '07'],
    ['August', '08'],
    ['September', '09'],
    ['October', '10'],
    ['November', '11'],
    ['December', '12'],
  ]);

  let mm = months.get(month);

  if(!mm) {
    for (let m of months.keys()) {
      if (m.includes(month)) {
        mm = months.get(m);
        break;
      }
    }
  }


  let formattedDate;
  format == 'flights' ? formattedDate = `${year}-${mm}-${day}` : formattedDate = `${day}/${mm}/${year}`
  console.log(formattedDate);
  return formattedDate;
}

module.exports = {
  formatDate
}
