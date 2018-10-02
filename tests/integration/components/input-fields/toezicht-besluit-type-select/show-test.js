import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | input-fields/toezicht-besluit-type-select/show', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{input-fields/toezicht-besluit-type-select/show}}`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      {{#input-fields/toezicht-besluit-type-select/show}}
        template block text
      {{/input-fields/toezicht-besluit-type-select/show}}
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
