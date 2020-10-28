'use strict';

const browsers = [
  'last 3 Chrome versions',
  'last 3 Firefox versions',
  'last 3 Safari versions'
];

const isCI = !!process.env.CI;
const isProduction = process.env.EMBER_ENV === 'production';

if (isCI || isProduction) {
  browsers.push('ie 11');
}

module.exports = {
  browsers
};
