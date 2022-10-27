/* MIT License - Copyright © 2022 Dieter Luypaert <dieterluypaert@gmail.com> from https://github.com/moeriki/be-nrn

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const BIS_MONTH_INCREMENT_GENDER_UNKNOWN = 20;
const BIS_MONTH_INCREMENT_GENDER_KNOWN = 40;

const mod97 = (input) => String(97 - (Number(input) % 97)).padStart(2, '0');

export function isValidRijksregisternummer(nrn) {
  if (!(typeof nrn === 'string' && nrn.trim().length > 0)) return false;
  if (nrn.length !== 11) {
    return false;
  }
  const { birthDate, serial, checksum } = parse(nrn);
  const preNillies =
    parseInt(checksum) === parseInt(mod97(`${birthDate.join('')}${serial}`));
  const postNillies =
    parseInt(checksum) === parseInt(mod97(`2${birthDate.join('')}${serial}`));

  return preNillies || postNillies;
}

function getBirthDay(birthDate) {
  return birthDate[2];
}

function getBirthMonth(birthDate) {
  let birthMonth = birthDate[1];
  while (birthMonth >= BIS_MONTH_INCREMENT_GENDER_UNKNOWN) {
    birthMonth -= BIS_MONTH_INCREMENT_GENDER_UNKNOWN;
  }
  return birthMonth;
}

export function getBirthDate(nrn) {
  const parsedNrn = parse(nrn);
  const year = getBirthYear(parsedNrn); // Eg. '86' from '860814'
  const month = getBirthMonth(parsedNrn.birthDate); // Eg. 8 from '860814'
  const day = getBirthDay(parsedNrn.birthDate); // Eg. 14 from '860814'
  if (month === '00' || day === '00') {
    throw new Error('Birth date is unknown');
  }
  return `${year}-${month}-${day}`;
}

function getBirthYear(nrn) {
  const { birthDate, serial, checksum } = parse(nrn);
  const partialYear = birthDate[0]; // Eg. '86' from '860814'
  let year;
  const checksum19 = mod97(`${birthDate.join('')}${serial}`);
  const checksum20 = mod97(`2${birthDate.join('')}${serial}`);
  if (checksum19 === checksum) {
    year = Number(`19${partialYear}`);
  } else if (checksum20 === checksum) {
    year = Number(`20${partialYear}`);
  } else {
    throw new Error(
      `Could not calculate birthDate with invalid checksum of "${checksum}", expected "${checksum19}" for 1900 or "${checksum20}" for 2000`
    );
  }
  return year;
}

export function isBiologicalFemale(nrn) {
  const { serial } = parse(nrn);
  return Number(serial) % 2 === 0;
}

export function isBiologicalMale(nrn) {
  const { serial } = parse(nrn);
  return Number(serial) % 2 === 1;
}

export function isBirthDateKnown(nrn) {
  const { birthDate } = parse(nrn);
  const month = getBirthMonth(birthDate);
  const day = getBirthDay(birthDate);
  return (
    month !== '00' &&
    parseInt(month) <= 12 &&
    day !== '00' &&
    parseInt(day) <= 31
  );
}

export function isGenderKnown(nrn) {
  const { birthDate } = parse(nrn);
  const nrnMonth = parseInt(birthDate[1]);
  return (
    nrnMonth < BIS_MONTH_INCREMENT_GENDER_UNKNOWN ||
    nrnMonth >= BIS_MONTH_INCREMENT_GENDER_KNOWN
  );
}

function normalize(nrn) {
  if (typeof nrn === 'string') {
    return nrn.replace(/[^\d]+/g, '');
  }
  if (typeof nrn === 'object') {
    return `${nrn.birthDate.join('')}${nrn.serial}${nrn.checksum}`;
  }
  throw new Error('Could not normalize nrn of invalid type');
}

function parse(nrn) {
  if (typeof nrn === 'string') {
    const normalizedNrn = normalize(nrn);
    const birthDateString = normalizedNrn.slice(0, 6); // Eg. '860814' from '86081441359'
    const birthDate = [
      birthDateString.slice(0, 2),
      birthDateString.slice(2, 4),
      birthDateString.slice(4),
    ]; // Eg. ['86', '08', '14'] from '860814'
    const serial = normalizedNrn.slice(6, 9); // Eg. '413' from '86081441359'
    const checksum = normalizedNrn.slice(9, 11); // Eg. '59' from '86081441359'
    return { birthDate, serial, checksum };
  }
  if (typeof nrn === 'object') {
    return nrn;
  }
  throw new Error('Could not parse nrn of invalid type');
}
