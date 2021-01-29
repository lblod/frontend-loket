import { empty, oneWay } from '@ember/object/computed';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { task } from 'ember-concurrency';
import { or } from 'ember-awesome-macros';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class BerichtencentrumConversatieReactieComponent extends Component {
  @service() router;
  @service() store;
  @service() currentSession;

  @tracked isExpanded = false;
  @tracked cantSend = or('ensureOriginator.isRunning', empty('bijlagen.[]'));
  @tracked originator;
  @tracked bijlage;
  @tracked inhoud;

  @oneWay('currentSession.userContent') currentUser;
  @oneWay('currentSession.groupContent.naam') bestuursEenheidNaam;

  constructor() {
    super(...arguments);
    this.ensureOriginator.perform();
    this.initInputState();
  }

  // Initializes the input state so it appears the component was not
  // used before.
  initInputState() {
    this.inhoud = '';
    this.bijlagen = A();
  }

  @task(function *() {
    const berichten = yield this.args.conversatie.berichten;
    const sortedBerichten = berichten.sortBy('verzonden')
    const ourGroup = yield this.currentSession.group;

    // find first sender of message that is not our group
    for( let bericht of sortedBerichten){
      let sender = yield bericht.van;
      if( sender && sender.id !== ourGroup.id ) {
        this.originator = sender;
        return;
      }
    }

    // if no originator could be found, we reset the property
    this.originator = null;
  }) ensureOriginator;

  @action
    async verstuurBericht() {
      const bestuurseenheid = await this.currentSession.group;
      const user = await this.currentSession.user;

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
          typeCommunicatie        : this.args.conversatie.currentTypeCommunicatie
        });

        await reactie.save();
        this.args.conversatie.berichten.pushObject(reactie);
        this.args.conversatie.laatsteBericht = reactie;
        await this.args.conversatie.save();
      }
      catch (err) {
        alert (err.message);
      }
    }

  @action
    attachFile(file) {
      this.bijlagen.pushObject(file);
    }

  @action
    deleteFile(file) {
      this.bijlagen.removeObject(file);
    }

  @action
    expandMe() {
      this.initInputState();
      this.expand();
    }

  @action
    collapseMe() {
      this.collapse();
    }

  @action 
    collapse() {
      this.isExpanded = false;
    }

  @action
    expand() {
      this.isExpanded = true;
    }
}
