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
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

module.exports = {
  formatDate
}
