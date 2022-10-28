import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ContactInformationTableComponent extends Component {
  @service router;
  constructor() {
    super(...arguments);
    if (
      !this.args.hasContact &&
      !this.router.currentRouteName.includes('.edit')
    ) {
      this.args.onAddNewContact();
    }
  }
  get isEditing() {
    return Boolean(this.args.editingContact);
  }
}
