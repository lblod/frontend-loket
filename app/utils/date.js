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
