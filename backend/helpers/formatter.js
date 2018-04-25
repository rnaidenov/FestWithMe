'use strict';

const formatDate = (eventDate, change, flightsFormat) => {
  const date = new Date(eventDate);
  if (change) {
    const { more, days } = change;
    if (more) {
      date.setDate(date.getDate() + days);
    } else {
      date.setDate(date.getDate() - days);
    }
  }
  const month = date.getMonth() + 1;
  const monthFormat = month < 10 ? `0${month}` : month

  const day = date.getDate();
  const dayFormat = day < 10 ? `0${day}` : day
  const year = date.getFullYear();

  return flightsFormat ? `${_getStrippedYear(year)}${monthFormat}${dayFormat}` : `${year}-${monthFormat}-${dayFormat}`;
}


const _getStrippedYear = (year) => {
  const yearSplit = String(year).split("");
  const yearDigitsNum = yearSplit.length;
  return `${yearSplit[yearDigitsNum-2]}${yearSplit[yearDigitsNum-1]}`
}

module.exports = {
  formatDate
}
