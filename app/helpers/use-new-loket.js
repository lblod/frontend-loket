import Helper from '@ember/component/helper';
import { service } from '@ember/service';

export default class UseNewLoket extends Helper {
  @service newLoket;

  compute() {
    return this.newLoket.shouldUseNewLoket;
  }
}
