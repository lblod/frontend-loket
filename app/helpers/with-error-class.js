import { helper } from '@ember/component/helper';

export function withErrorClass([hasError,classes]) {
  if (hasError) {
    return `${classes} input-field--error`;
  }
  else {
    return classes;
  }
}

export default helper(withErrorClass);
