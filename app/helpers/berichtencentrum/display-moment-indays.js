import { helper } from '@ember/component/helper';
import moment from 'moment';

export function momentDurationToDays(params/*, hash*/) {
  const duration = params[0];
  if(!duration)
    return '';
  return moment.duration(duration).asDays();
}

export default helper(momentDurationToDays);
