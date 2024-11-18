export default function mandatenbeheerDisplayRrn(rrn) {
  if (rrn?.length !== 11) return '';

  // prettier-ignore
  return `${rrn.slice(0,2)}.${rrn.slice(2,4)}.${rrn.slice(4,6)}-${rrn.slice(6,9)}.${rrn.slice(9,11)}`;
}
