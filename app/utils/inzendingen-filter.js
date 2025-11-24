import { tracked } from '@glimmer/tracking';

export default class InzendingenFilter {
  @tracked bestuurseenheidIds;
  @tracked classificatieIds;
  @tracked governingBodyClassificationIds;
  @tracked marCodeIds;
  @tracked provincieIds;
  @tracked besluitTypeIds;
  @tracked regulationTypeIds;
  @tracked sessionDateFrom;
  @tracked sessionDateTo;
  @tracked sentDateFrom;
  @tracked sentDateTo;
  @tracked statusUri;
  @tracked dateOfEntryIntoForceFrom;
  @tracked dateOfEntryIntoForceTo;
  @tracked endDateFrom;
  @tracked endDateTo;

  constructor(params) {
    const keys = Object.keys(params);
    keys.forEach((key) => (this[key] = params[key]));
  }

  get keys() {
    return [
      'bestuurseenheidIds',
      'classificatieIds',
      'governingBodyClassificationIds',
      'marCodeIds',
      'provincieIds',
      'besluitTypeIds',
      'regulationTypeIds',
      'sessionDateFrom',
      'sessionDateTo',
      'sentDateFrom',
      'sentDateTo',
      'statusUri',
      'dateOfEntryIntoForceFrom',
      'dateOfEntryIntoForceTo',
      'endDateFrom',
      'endDateTo',
    ];
  }

  reset() {
    this.keys.forEach((key) => (this[key] = null));
  }
}
