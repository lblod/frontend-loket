// Inlined from https://github.com/mu-semtech/ember-mu-transform-helpers
import DateTimeTransform from './datetime';

export default class DateTransform extends DateTimeTransform {
  serialize(date) {
    if (date instanceof Date) {
      return formatISODate(date);
    } else {
      return null;
    }
  }
}

function formatISODate(date) {
  let month = `${date.getMonth() + 1}`.padStart(2, '0');
  let day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
