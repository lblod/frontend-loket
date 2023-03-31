import { action } from '@ember/object';
import Component from '@glimmer/component';
import { toggleMarkAddFirst } from '@lblod/ember-rdfa-editor/commands';

// Headless variant of the Toolbar::Mark component https://github.com/lblod/ember-rdfa-editor/blob/master/addon/components/toolbar/mark.ts
export default class MarkComponent extends Component {
  get mark() {
    return this.args.controller.schema.marks[this.args.mark];
  }

  get isActive() {
    return this.args.controller.isMarkActive(this.mark);
  }

  @action
  toggle() {
    this.args.controller.focus();
    this.args.controller.doCommand(toggleMarkAddFirst(this.mark));
  }
}
