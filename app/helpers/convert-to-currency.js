export default function convertToCurrency(value) {
  const formatter = new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
  });

  if (isNaN(value)) {
    return value;
  } else {
    return formatter.format(value);
  }
}
