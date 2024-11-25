import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | bbcdr/document-status', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const status = {
      uri: 'http://data.lblod.info/document-statuses/concept',
      label: 'concept',
    };
    this.set('status', status);
  });

  test('it displays a capitalized status label', async function (assert) {
    await render(hbs`<Bbcdr::DocumentStatus @status={{this.status}} />`);

    assert.dom('[data-test-loket=document-status-pill]').hasText('Concept');
  });

  test('it displays the status uri as resource attribute', async function (assert) {
    await render(hbs`<Bbcdr::DocumentStatus @status={{this.status}} />`);

    assert
      .dom('[data-test-loket=document-status-pill]')
      .hasAttribute(
        'resource',
        'http://data.lblod.info/document-statuses/concept',
      );
  });

  test('it does not display a label if no status is passed', async function (assert) {
    await render(hbs`<Bbcdr::DocumentStatus />`);

    assert.dom('[data-test-loket=document-status-pill]').doesNotIncludeText();
  });
});
