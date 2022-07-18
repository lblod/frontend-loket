import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerMandatarisEditController extends Controller {
  @service currentSession;
  @service store;
  @service router;

  @tracked selectedContact;

  @action
  setMandaat(mandaat) {
    this.model.bekleedt = mandaat;
  }

  @action
  handleDateChange(attributeName, isoDate, date) {
    this.model[attributeName] = date;
  }

  @action
  onSave() {
    this.model.save();
  }

  @action
  onCancel() {
    this.router.transitionTo('eredienst-mandatenbeheer.mandatarissen');
  }
}
