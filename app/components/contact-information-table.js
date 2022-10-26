import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ContactInformationTableComponent extends Component {
  @service router;
  constructor() {
    super(...arguments);
    console.log('args', this.args);
    console.log('selected contact', this.args.selectedContact);
    console.log('contacts', this.args.contacts);
    console.log(
      'is selected',
      this.args.contacts === this.args.selectedContact
    );
    // We check if there is a contact available for this person
    // This is false on edit because the arg is unavailable
    // We need to check only when not redirected to the edit page
    if (
      !this.args.hasContact &&
      this.router.currentRouteName !==
        'worship-ministers-management.minister.edit'
    ) {
      // If not contact we force the user to enter one
      this.args.onAddNewContact();
    }
    // if there is an address we want to check it by default
  }
  get isEditing() {
    return Boolean(this.args.editingContact);
  }
}
