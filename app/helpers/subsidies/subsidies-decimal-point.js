export default function commasToDecimalPointsFix(input) {
  return input.replace(/[^0-9/-]/g, '.');
}
