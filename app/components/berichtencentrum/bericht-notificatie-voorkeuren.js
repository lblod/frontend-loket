import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BerichtencentrumBerichtNotificatieVoorkeurenComponent extends Component {
  @service currentSession;

  @tracked wilMailOntvangen = this.currentSession.group.wilMailOntvangen;
  @tracked emailAddress = this.currentSession.group.mailAdres;

  @action
  savePreferences(event) {
    event.preventDefault();

    let group = this.currentSession.group;
    group.mailAdres = this.emailAddress;
    group.wilMailOntvangen = this.wilMailOntvangen;
    group.save();

    this.args.close();
  }
}
