import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | toezicht/url-line', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    
    let url = EmberObject.create({
      address: 'someURL',
      cacheResource: EmberObject.create({ id: 5 }),
    });

    this.set('url', url);
    let linkText = 'Download voorbeeld';

    await render(hbs`{{toezicht/url-line url=this.url}}`);
    assert.equal(this.element.textContent.trim(), linkText);
    
    // Template block usage:
    await render(hbs`
      {{#toezicht/url-line url=this.url}}
        template block text
      {{/toezicht/url-line}}
    `);
   
    assert.equal(this.element.textContent.trim(), linkText);
  });
});
