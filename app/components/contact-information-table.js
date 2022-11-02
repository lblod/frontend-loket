import Component from '@glimmer/component';

export default class ContactInformationTableComponent extends Component {
  get isEditing() {
    return Boolean(this.args.editingContact);
  }
}
