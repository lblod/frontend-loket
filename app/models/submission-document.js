import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubmissionDocument extends Model {
  @attr uri;
  @belongsTo('submission', {
    async: true,
    inverse: 'submissionDocument',
  })
  submission;
}
