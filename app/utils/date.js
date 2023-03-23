/**
 * Formatting the date by the following format DD-MM-YYYY
 * @param {Date} date
 * @returns {String} formatted date
 */
export function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}-${month}-${year}`;
}

/** This can be used to compare 2 dates without them having to be the same exact time.
 * @param {Date} dateA
 * @param {Date} dateB
 * @returns {boolean}
 */
export function isSameIsoDate(dateA, dateB) {
  if (
    !(
      Boolean(dateA) &&
      isValidDate(dateA) &&
      Boolean(dateB) &&
      isValidDate(dateB)
    )
  ) {
    return false;
  }

  return toIsoDateString(dateA) === toIsoDateString(dateB);
}

function isValidDate(date) {
  return !isNaN(date);
}

function toIsoDateString(date) {
  let day = `${date.getDate()}`.padStart(2, '0');
  let month = `${date.getMonth() + 1}`.padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
}
