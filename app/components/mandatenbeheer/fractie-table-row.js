import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerFractieTableRowComponent extends Component {
  @tracked editMode = false;

  constructor() {
    super(...arguments);
    this.editMode = this.args.editMode;
  }

  get isValid() {
    return (
      this.args.fractie &&
      this.args.fractie.naam &&
      this.args.fractie.hasDirtyAttributes
    );
  }

  get bestuursperiode() {
    return this.args.fractie.hasMany('bestuursorganenInTijd').value()?.at(0);
  }

  get bestuursperiodeStart() {
    return this.bestuursperiode?.bindingStart;
  }

  get bestuursperiodeEnd() {
    return this.bestuursperiode?.bindingEinde;
  }

  @action
  cancel() {
    this.editMode = false;
    this.args.onCancel(this.args.fractie);
    if (this.fractie) {
      this.fractie.rollbackAttributes();
    }
  }

  @action
  save() {
    this.editMode = false;
    this.args.onSave(this.args.fractie);
  }

  @action
  async remove() {
    await this.fractie.destroyRecord();
  }
}
