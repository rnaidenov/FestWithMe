'use strict';

function formatDate (date) {
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

    // If day is before the 10th it needs to have a 0 in the beginning
    let dd;
    day.charAt(0) != '0' && day < 10 ? dd = `0${day}` : dd = day

    return `${year}-${mm}-${dd}`;
}

module.exports = {
  formatDate
}
