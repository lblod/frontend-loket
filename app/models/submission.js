import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Submission extends Model {
  @attr('datetime', {
    defaultValue() {
      return new Date();
    },
  })
  created;

  @attr('datetime', {
    defaultValue() {
      return new Date();
    },
  })
  modified;

  @attr('datetime') sentDate;
  @attr('datetime') receivedDate;
  @attr source;
  @attr uri;
  @attr href;

  @belongsTo('bestuurseenheid', {
    async: true,
    inverse: null,
    polymorphic: true, // This shouldn't be needed since the inverse is `null`, but without it EmberData throws an error, probably a bug
  })
  organization;

  @belongsTo('vendor', {
    async: true,
    inverse: null,
  })
  publisher;

  @belongsTo('submission-document', {
    async: true,
    inverse: 'submission',
  })
  submissionDocument;

  @belongsTo('submission-document-status', {
    async: true,
    inverse: null,
  })
  status;

  @belongsTo('gebruiker', {
    async: true,
    inverse: null,
  })
  creator;

  @belongsTo('gebruiker', {
    async: true,
    inverse: null,
  })
  lastModifier;
  @belongsTo('form-data', {
    async: true,
    inverse: 'submission',
  })
  formData;

  @belongsTo('job', {
    async: true,
    inverse: null,
  })
  job;

  @hasMany('file', {
    async: true,
    inverse: null,
  })
  files;
}
