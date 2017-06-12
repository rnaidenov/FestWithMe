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

  const mm = months.get(month);

  let formattedDate;
  format == 'flights' ? formattedDate = `${year}-${mm}-${day}` : formattedDate = `${day}/${mm}/${year}`
  return formattedDate;
}

module.exports = {
  formatDate
}
