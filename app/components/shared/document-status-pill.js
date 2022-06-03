/* eslint-disable ember/no-classic-components, ember/no-classic-classes, ember/require-tagless-components */
import { alias } from '@ember/object/computed';
import Component from '@ember/component';

const DocumentStatusPillComponent = Component.extend({
  tagName: 'label',
  classNames: ['au-c-pill'],
  attributeBindings: ['resource', 'data-test-loket'],
  status: null,
  resource: alias('status.uri'),
  'data-test-loket': 'document-status-pill',
});

DocumentStatusPillComponent.reopenClass({
  positionalParams: ['status'],
});

export default DocumentStatusPillComponent;
