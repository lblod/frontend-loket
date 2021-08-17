import Component from '@glimmer/component';

export default class SharedFooterHeadingComponent extends Component {
  get hostname() {
    return document.location.hostname;
  }
}
