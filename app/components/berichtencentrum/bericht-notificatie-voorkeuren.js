import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BerichtencentrumBerichtNotificatieVoorkeurenComponent extends Component {
  @service() currentSession;

  @tracked wilMailOntvangen = this.currentSession.groupContent.wilMailOntvangen
  @tracked emailAddress = this.currentSession.groupContent.mailAdres

  @action
    commit() {
      // get all variables
      let emailAddress = this.emailAddress;
      let wilMailOntvangen = this.wilMailOntvangen;
      let group = this.currentSession.groupContent;

      // close the popup
      this.args.close(); // close the popup

      // save the lot
      group.mailAdres = emailAddress;
      group.wilMailOntvangen = wilMailOntvangen;

      group.save();
    }
}

