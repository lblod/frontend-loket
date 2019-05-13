import { helper } from '@ember/component/helper';

export function leidinggevendenbeheerDisplayRrn(params/*, hash*/) {
  params = params[0];
  if(!params || params.length !== 11)
    return '';
  return `${params.slice(0,2)}.${params.slice(2,4)}.${params.slice(4,6)}-${params.slice(6,9)}.${params.slice(9,11)}`;
}

export default helper(leidinggevendenbeheerDisplayRrn);
