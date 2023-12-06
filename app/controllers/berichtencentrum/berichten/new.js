import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import { COMMUNICATION_TYPES } from 'frontend-loket/models/bericht';

export default class BerichtencentrumBerichtenNewController extends Controller {
  @service currentSession;
  @service router;
  @service store;

  communicationTypes = Object.values(COMMUNICATION_TYPES);

  get hasNeededData() {
    const { dossiernummer, type, description, files } = this.model.formData;
    return !!dossiernummer && !!type && !!description && files.length > 0;
  }

  @action async handleDelete(file) {
    this.model.formData.files.splice(
      this.model.formData.files.indexOf(file),
      1
    );
    await file.destroyRecord();
  }

  @action async handleFinishUpload(fileId) {
    let file = await this.store.findRecord('file', fileId);
    this.model.formData.files.push(file);
  }

  save = dropTask(async (event) => {
    event.preventDefault();

    const { dossiernummer, type, description, files } = this.model.formData;
    const now = new Date();

    const abb = (
      await this.store.query('bestuurseenheid', {
        'filter[:uri:]':
          'http://data.lblod.info/id/bestuurseenheden/141d9d6b-54af-4d17-b313-8d1c30bc3f5b',
      })
    ).at(0);

    const message = this.store.createRecord('bericht', {
      verzonden: now,
      aangekomen: now,
      typeCommunicatie: type,
      van: abb,
      naar: this.currentSession.group,
      inhoud: '',
      bijlagen: files,
    });

    //The creator field must only be set at the end when all data is in the
    //database. This field is used to trigger the
    //vendor-data-distribution-service and should not be triggered too soon.
    //Store the default value, set it to a placeholder and restore later
    const creatorDefault = message.creator;
    message.creator = 'pending';
    await message.save();

    const conversation = this.store.createRecord('conversatie', {
      dossiernummer,
      betreft: description,
      currentTypeCommunicatie: type,
      reactietermijn: 'P30D',
      berichten: [message],
      laatsteBericht: message,
    });
    await conversation.save();

    //Restore the default value and save again
    message.creator = creatorDefault;
    await message.save();

    this.router.transitionTo(
      'berichtencentrum.berichten.conversatie',
      conversation.id
    );
  });
}
