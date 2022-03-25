// TODO: This file can be removed once Dutch is the default locale in ember-appuniversum: https://github.com/appuniversum/ember-appuniversum/pull/209
import AuDatePicker from '@appuniversum/ember-appuniversum/components/au-date-picker';

// TODO: we're overriding "private" apis for now since it's temporary code
// and it allows us to simply remove this file without changing the component invocations.
export default class DutchAuDatePicker extends AuDatePicker {
  get adapter() {
    return BELGIAN_FORMAT_ADAPTER;
  }

  get localization() {
    return DUTCH_LOCALIZATION;
  }
}

const DUTCH_LOCALIZATION = {
  buttonLabel: 'Kies een datum',
  placeholder: 'DD.MM.JJJJ',
  selectedDateMessage: 'De geselecteerde datum is',
  prevMonthLabel: 'Vorige maand',
  nextMonthLabel: 'Volgende maand',
  monthSelectLabel: 'Maand',
  yearSelectLabel: 'Jaar',
  closeLabel: 'Sluit venster',
  keyboardInstruction: 'Gebruik de pijltjestoetsen om te navigeren',
  calendarHeading: 'Kies een datum',
  dayNames: getLocalizedDays(),
  monthNames: getLocalizedMonths(),
  monthNamesShort: getLocalizedMonths('short'),
};

const BELGIAN_FORMAT_ADAPTER = {
  parse: function (value = '', createDate) {
    const matches = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (matches) {
      return createDate(matches[3], matches[2], matches[1]);
    }
  },
  format: formatDate,
};

function getLocalizedMonths(monthFormat = 'long') {
  let someYear = 2021;
  return [...Array(12).keys()].map((monthIndex) => {
    let date = new Date(someYear, monthIndex);
    return intl({ month: monthFormat }).format(date);
  });
}

function getLocalizedDays(weekdayFormat = 'long') {
  let someSunday = new Date('2021-01-03');
  return [...Array(7).keys()].map((index) => {
    let weekday = new Date(someSunday.getTime());
    weekday.setDate(someSunday.getDate() + index);
    return intl({ weekday: weekdayFormat }).format(weekday);
  });
}

function intl(options) {
  return new Intl.DateTimeFormat('nl-BE', options);
}

function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return '';
  }

  let day = `${date.getDate()}`.padStart(2, '0');
  let month = `${date.getMonth() + 1}`.padStart(2, '0');

  return `${day}.${month}.${date.getFullYear()}`;
}
