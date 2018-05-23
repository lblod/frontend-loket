import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
export default Controller.extend({
  queryParams: ['gemeente', 'page'],
  gemeente: '',
  page: 0,
  size: 10,
  updateSearch: task(function*(value) {
    console.log(value);
    yield timeout(500);
    this.set('page',0);
    this.set('gemeente', value);
  }).restartable()
});
