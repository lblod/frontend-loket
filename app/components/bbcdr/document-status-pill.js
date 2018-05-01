import { alias } from '@ember/object/computed';
import Component from '@ember/component';

const DocumentStatusPillComponent = Component.extend({
  tagName: 'label',
  classNames: ['pill', 'pill--clickable'],
  attributeBindings: ['resource'],
  status: null,
  resource: alias('status.uri')
});

DocumentStatusPillComponent.reopenClass({
  positionalParams: ['status']
});

export default DocumentStatusPillComponent;
