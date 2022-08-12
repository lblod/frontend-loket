import Component from '@glimmer/component';

const LIFECYCLE_STATUS = {
  CONCEPT:
    'http://lblod.data.gift/concepts/79a52da4-f491-4e2f-9374-89a13cde8ecd',
  ACTIVE:
    'http://data.lblod.info/id/concept/ipdc-thema/27d784f8-e7ea-4f18-88f8-02d427033009',
  NOT_ACTIVE:
    'http://data.lblod.info/id/concept/ipdc-thema/12873bfb-d2cc-4cc5-9255-1bf0ca2747f9',
};

const LABEL = {
  'http://lblod.data.gift/concepts/79a52da4-f491-4e2f-9374-89a13cde8ecd':
    'Ontwerp',
  'http://data.lblod.info/id/concept/ipdc-thema/27d784f8-e7ea-4f18-88f8-02d427033009':
    'Actief',
  'http://data.lblod.info/id/concept/ipdc-thema/12873bfb-d2cc-4cc5-9255-1bf0ca2747f9':
    'Stopgezet',
};

const PUBLICATION_STATUS_SKIN = {
  [LIFECYCLE_STATUS.ACTIVE]: 'success',
  [LIFECYCLE_STATUS.NOT_ACTIVE]: 'error',
  [LIFECYCLE_STATUS.CONCEPT]: 'warning',
};

export default class Status extends Component {
  get label() {
    return LABEL[this.args.uri];
  }
  get statusSkin() {
    return PUBLICATION_STATUS_SKIN[this.args.uri];
  }
}
