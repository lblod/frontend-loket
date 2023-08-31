import Model, { attr, belongsTo } from '@ember-data/model';

export default class ParticipationModel extends Model {
  @attr description;
  @attr role;

  @belongsTo('bestuurseenheid', {
    async: true,
    inverse: null,
  })
  participatingBestuurseenheid;
}

export const ROLES = {
  APPLICANT:
    'http://lblod.data.gift/concepts/d8b8f3d1-7574-4baf-94df-188a7bd84a3a',
};
