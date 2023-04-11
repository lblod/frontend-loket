import Component from '@glimmer/component';

export default class ExtraFormattingOptionsComponent extends Component {
  menuItems = [
    { mark: 'underline', label: 'Onderstreept', icon: 'underlined' },
    { mark: 'strikethrough', label: 'Doorstreept', icon: 'strikethrough' },
    { mark: 'subscript', label: 'Subscript', icon: 'subscript' },
    { mark: 'superscript', label: 'Superscript', icon: 'superscript' },
  ];

  get isAnyMenuItemActive() {
    return this.menuItems.some(({ mark: name }) => {
      const { controller } = this.args;
      const mark = controller.schema.marks[name];
      return controller.isMarkActive(mark);
    });
  }
}
