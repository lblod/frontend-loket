import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | toezicht/url-box', function(hooks) {
  setupRenderingTest(hooks);

  // A sample call:
  // {{toezicht/url-box urls=fileAddresses disabled=isSent onDelete=(action "deleteFileAddress")}}

  test('it renders nothing if no url is provided', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    await render(hbs`{{toezicht/url-box}}`);

    assert.equal(this.element.querySelector('[data-test-mn=url-box-list]').textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#toezicht/url-box}}
        template block text
      {{/toezicht/url-box}}
    `);

    assert.equal(this.element.querySelector('[data-test-mn=url-box-list]').textContent.trim(), '');
  });
});
