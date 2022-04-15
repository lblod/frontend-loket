import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module(
  'Integration | Component | berichtencentrum/bericht-new',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`{{berichtencentrum/bericht-new}}`);

      assert.dom(this.element).hasText('');

      // Template block usage:
      await render(hbs`
      {{#berichtencentrum/bericht-new}}
        template block text
      {{/berichtencentrum/bericht-new}}
    `);

      assert.dom(this.element).hasText('template block text');
    });
  }
);
