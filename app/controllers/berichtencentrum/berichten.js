import Controller               from '@ember/controller';
import { inject as service }    from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({

    router: service(),
    sort:   'is-bestuurlijke-alias-van.achternaam',
    page:   0,
    size:   20,

    hasActiveChildRoute: computed('router.currentRouteName', function() {
        return  this.get('router.currentRouteName').startsWith('berichtencentrum.berichten.')
                &&
                this.get('router.currentRouteName') != 'berichtencentrum.berichten.index';
      }),

    actions: {
        
        onNieuwBriefClicked() {
            
            if (this.get('router.currentRouteName') === 'berichtencentrum.berichten.new')
                this.transitionToRoute('berichtencentrum.berichten');
            else
                this.transitionToRoute('berichtencentrum.berichten.new');
            
        },

        actions: {
            onClose: function() {
                //router: Ember.inject.service('-routing');
                this.transitionTo('berichtencentrum.berichten');
            },
        },
    }

});
