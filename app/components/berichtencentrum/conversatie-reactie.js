import { empty, oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { task } from 'ember-concurrency';
import { or } from 'ember-awesome-macros';

export default Component.extend({
  router: service(),
  store: service(),
  currentSession: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    this.ensureOriginator.perform();
  },

  // Initializes the input state so it appears the component was not
  // used before.
  initInputState(){
    this.setProperties({
      inhoud: '',
      bijlagen: A()
    });
  },

  isExpanded: false,
  cantSend: or('ensureOriginator.isRunning', empty('bijlagen')),
  currentUser: oneWay('currentSession.userContent'),
  bestuursEenheidNaam: oneWay('currentSession.groupContent.naam'),

  ensureOriginator: task(function *() {
    const berichten = (yield this.get('conversatie.berichten')).sortBy('verzonden');
    const ourGroup = yield this.get('currentSession.group');

    // find first sender of message that is not our group
    for( let bericht of berichten ){
      let sender = yield bericht.van;
      if( sender && sender.id !== ourGroup.id ) {
        this.set('originator', sender);
        return;
      }
    }

    // if no originator could be found, we reset the property
    this.set('originator', null);
  }),

  actions: {
    async verstuurBericht() {
      const bestuurseenheid = await this.get('currentSession.group');
      const user = await this.get('currentSession.user');

      try {
        this.collapse();

        const reactie = await this.store.createRecord('bericht', {
          inhoud                  : this.inhoud,
          // aangekomen              : new Date(),
          verzonden               : new Date(),
          van                     : bestuurseenheid,
          auteur                  : user,
          naar                    : this.originator,
          bijlagen                : this.bijlagen,
          typeCommunicatie        : this.conversatie.currentTypeCommunicatie
        });

        await reactie.save();
        this.conversatie.berichten.pushObject(reactie);
        this.conversatie.set('laatsteBericht', reactie);
        await this.conversatie.save();
      }
      catch (err) {
        alert (err.message);
      }
    },

    attachFile: function (file) {
      this.bijlagen.pushObject(file);
    },

    deleteFile: function (file) {
      this.bijlagen.removeObject(file);
    },

    expandMe: function() {
      this.initInputState();
      this.expand();
    },

    collapseMe: function () {
      this.collapse();
    }
  },

  collapse: function() {
    this.set('isExpanded', false);
  },

  expand: function() {
    this.set('isExpanded', true);
  }
});
