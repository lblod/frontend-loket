import BaseTable from './base-table';

export default class RdfFormFieldsEstimatedCostTableShowComponent extends BaseTable {
  constructor() {
    super(...arguments);
    this.entries = this.loadEstimatedCostEntries();
  }
}
