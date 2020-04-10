import Model, {attr, belongsTo, hasMany} from '@ember-data/model';

export default class Submission extends Model {
  @attr('datetime', {
    defaultValue(){ return new Date();}
  }) created;

  @attr('datetime', {
    defaultValue(){ return new Date();}
  }) modified;

  @attr('datetime') sentDate;
  @attr('datetime') receivedDate;
  @belongsTo('gebruiker') creator;
  @belongsTo('gebruiker') lastModifier;
  @belongsTo('form-data') formData;
  @attr source;

  @attr uri;
  @attr href;
  @belongsTo('bestuurseenheid') organization;
  @belongsTo('vendor') publisher;
  @belongsTo('submission-document') submissionDocument;
  @belongsTo('submission-document-status') status;
  @hasMany('file') files;
  @belongsTo('automatic-submission-task') task;

  get creatorLabel() {
    return this.task.get('created') ? 'Automatisch bij publicatie' : this.creator.get('fullName');
  }

  get lastModifierLabel() {
    return this.lastModifier.get('fullName') ? this.lastModifier.get('fullName') : 'Automatisch aangemaakt bij publicatie';
  }
}

