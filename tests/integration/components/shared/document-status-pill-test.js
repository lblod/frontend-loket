import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | shared/document-status-pill', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    const status = {
      uri: 'http://data.lblod.info/document-statuses/concept',
      label: 'concept'
    };
    this.set('status', status);
  });

  test('it displays a capitalized status label', async function(assert) {
    await render(hbs`{{shared/document-status-pill status}}`);

    assert.dom('[data-test-loket=document-status-pill]').hasText('Concept');
  });

  test('it displays the status uri as resource attribute', async function(assert) {
    await render(hbs`{{shared/document-status-pill status}}`);

    assert.dom('[data-test-loket=document-status-pill]').hasAttribute('resource', 'http://data.lblod.info/document-statuses/concept');
  });

  test('it does not display a label if no status is passed', async function(assert) {
    await render(hbs`{{shared/document-status-pill}}`);

    assert.dom('[data-test-loket=document-status-pill]').doesNotIncludeText();
  });
});
