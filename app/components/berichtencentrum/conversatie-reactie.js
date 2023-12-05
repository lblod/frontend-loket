import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class BerichtencentrumConversatieReactieComponent extends Component {
  @service() router;
  @service() store;
  @service() currentSession;

  @tracked isExpanded = false;
  @tracked originator;
  @tracked bijlagen;
  @tracked inhoud;

  get cantSend() {
    return this.ensureOriginator.isRunning || this.bijlagen.length == 0;
  }

  constructor() {
    super(...arguments);
    this.ensureOriginator();
    this.initInputState();
  }

  // Initializes the input state so it appears the component was not
  // used before.
  initInputState() {
    this.inhoud = '';
    this.bijlagen = A();
  }

  ensureOriginator() {
    const ourGroup = this.currentSession.group;

    // find first sender of message that is not our group
    for (let bericht of this.args.berichten) {
      let sender = bericht.van;
      if (sender?.id !== ourGroup.id) {
        this.originator = sender;
        return;
      }
    }

    // if no originator could be found, we reset the property
    this.originator = null;
  }

  verstuurBericht = task(async () => {
    const bestuurseenheid = this.currentSession.group;
    const user = this.currentSession.user;

    try {
      this.collapse();

      const reactie = await this.store.createRecord('bericht', {
        inhoud: this.inhoud,
        // aangekomen              : new Date(),
        verzonden: new Date(),
        van: bestuurseenheid,
        auteur: user,
        naar: this.originator,
        bijlagen: this.bijlagen,
        typeCommunicatie: this.args.conversatie.currentTypeCommunicatie,
      });

      //The creator field must only be set at the end when all data is in the
      //database. This field is used to trigger the
      //vendor-data-distribution-service and should not be triggered too soon.
      //Store the default value, set it to a placeholder and restore later
      const creatorDefault = reactie.creator;
      reactie.creator = 'pending';
      await reactie.save();

      this.args.conversatie.berichten.push(reactie);
      this.args.conversatie.laatsteBericht = reactie;
      await this.args.conversatie.save();

      //Restore the default value and save again
      reactie.creator = creatorDefault;
      await reactie.save();
    } catch (err) {
      alert(err.message);
    }
  });

  verstuurBerichtAlsABB = task(async () => {
    const bestuurseenheid = this.currentSession.group;
    const user = this.currentSession.user;
    const abb = (
      await this.store.query('bestuurseenheid', {
        'filter[:uri:]':
          'http://data.lblod.info/id/bestuurseenheden/141d9d6b-54af-4d17-b313-8d1c30bc3f5b',
      })
    ).at(0);

    try {
      this.collapse();

      const reactie = await this.store.createRecord('bericht', {
        inhoud: this.inhoud,
        // aangekomen              : new Date(),
        verzonden: new Date(),
        van: abb,
        auteur: user,
        naar: bestuurseenheid,
        bijlagen: this.bijlagen,
        typeCommunicatie: this.args.conversatie.currentTypeCommunicatie,
      });

      //The creator field must only be set at the end when all data is in the
      //database. This field is used to trigger the
      //vendor-data-distribution-service and should not be triggered too soon.
      //Store the default value, set it to a placeholder and restore later
      const creatorDefault = reactie.creator;
      reactie.creator = 'pending';
      await reactie.save();

      this.args.conversatie.berichten.push(reactie);
      this.args.conversatie.laatsteBericht = reactie;
      await this.args.conversatie.save();

      //Restore the default value and save again
      reactie.creator = creatorDefault;
      await reactie.save();
    } catch (err) {
      alert(err.message);
    }
  });

  @action
  async attachFile(fileId) {
    let file = await this.store.findRecord('file', fileId);
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
