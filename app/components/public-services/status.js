import Component from '@glimmer/component';

const DOCUMENT_STATUS = {
  'http://lblod.data.gift/concepts/79a52da4-f491-4e2f-9374-89a13cde8ecd': {
    skin: 'warning',
    label: 'Ontwerp',
  },

  'http://lblod.data.gift/concepts/9bd8d86d-bb10-4456-a84e-91e9507c374c': {
    skin: 'success',
    label: 'Verzonden',
  },
};

export default class Status extends Component {
  get label() {
    return DOCUMENT_STATUS[this.args.uri]?.label;
  }
  get statusSkin() {
    return DOCUMENT_STATUS[this.args.uri]?.skin;
  }
}
