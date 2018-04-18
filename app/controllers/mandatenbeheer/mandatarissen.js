import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  sort: 'is-bestuurlijke-alias-van.achternaam',
  page: 0,
  size: 20,

  isDisplayingSubroute: false,

  search: task(function* (searchData) {
   yield timeout(300);
   yield this.set('filter', searchData);
  }).restartable(),

  actions: {
    toggleSubrouteDisplay(){
      this.set('isDisplayingSubroute', !this.get('isDisplayingSubroute'));
    }
  }
});
