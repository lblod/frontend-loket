import Component from '@glimmer/component';

// TODO: replace this with the real URIs or UUIDs
const PUBLICATION_STATUS_SKIN = {
  1: 'info',
  2: 'success',
};

export default class PublicationStatus extends Component {
  get statusSkin() {
    return PUBLICATION_STATUS_SKIN[this.args.id];
  }
}
