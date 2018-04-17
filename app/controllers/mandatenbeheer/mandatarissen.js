import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  searchData: computed('persoonFilter', function(){
    return this.get('persoonFilter');
  }),
  actions: {
    search(){
      this.set('persoonFilter', this.get('searchData'));
    }
  }
});
