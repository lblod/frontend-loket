import Controller               from '@ember/controller';
import { inject as service }    from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  router: service(),
  showPreferences: false,

  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('berichtencentrum.berichten.')
        && this.get('router.currentRouteName') != 'berichtencentrum.berichten.index';
  }),

  actions: {
    showPreferences: function() {
      this.set('showPreferences', true);
    },
    hidePreferences: function() {
      this.set('showPreferences', false);
    }
  }
});
