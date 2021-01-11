import Component from '@glimmer/component';
import { reads } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerFractieTableRowComponent extends Component {
  @tracked editMode = false;

  get isValid() {
    return this.args.fractie && this.args.fractie.naam && this.args.fractie.hasDirtyAttributes;
  }

  @reads('args.fractie.bestuursorganenInTijd.firstObject.bindingStart') bestuursperiodeStart;
  @reads('args.fractie.bestuursorganenInTijd.firstObject.bindingEinde') bestuursperiodeEnd;

  @action
    cancel() {
      this.editMode = false;
      this.args.onCancel(this.args.fractie);
      this.fractie.rollbackAttributes();
    }

  @action
    save() {
      this.editMode = false;
      this.args.onSave(this.args.fractie);
    }
  }
