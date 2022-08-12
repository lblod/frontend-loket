import Component from '@glimmer/component';

export default class TranslationStatus extends Component {
  get isFullyTranslated() {
    // TODO: Replace this with the correct id
    return this.args.id === '2';
  }
}
