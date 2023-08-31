import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class FormDataModel extends Model {
  @attr('datetime') datePublication;
  @attr financialYear;
  @attr description;
  @attr comment;
  @attr('date') firstDateInForce;
  @attr('date') dateNoLongerInForce;
  @attr authenticityType;
  @attr chartOfAccount;
  @attr taxType;
  @attr taxRate;
  @attr hasAdditionalTaxRate;
  @attr link;
  @attr taxRateAmmount;
  @attr sessionStartedAtTime;

  @hasMany('concept', {
    async: true,
    inverse: null,
  })
  types;

  @belongsTo('submission', {
    async: true,
    inverse: 'formData',
  })
  submission;

  @belongsTo('bestuurseenheid', {
    async: true,
    inverse: null,
  })
  isAbout;

  @belongsTo('bestuursorgaan', {
    async: true,
    inverse: null,
  })
  passedBy;

  @belongsTo('concept', {
    async: true,
    inverse: null,
  })
  decisionType;

  @belongsTo('concept', {
    async: true,
    inverse: null,
  })
  regulationType;
}
