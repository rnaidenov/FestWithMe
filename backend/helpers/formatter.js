'use strict';

function formatDate(eventDate, change) {
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

  return `${date.getFullYear()}-${monthFormat}-${dayFormat}`;
}

module.exports = {
  formatDate
}
