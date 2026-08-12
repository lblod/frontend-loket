import Model, { attr, belongsTo } from '@warp-drive/legacy/model';

export default class SubmissionDocument extends Model {
  @attr uri;
  @belongsTo('submission', {
    async: true,
    inverse: 'submissionDocument',
  })
  submission;
}
