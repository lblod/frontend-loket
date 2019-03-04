import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | toezicht/url-line', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders the correct link for a cached url', async function(assert) {
    
    //--- when url is provided (a cached resource was found)
    const id = 5;
    const filename = 'somefile.png'; 
    const url = EmberObject.create({
      address: 'someURL',
      cacheResource: EmberObject.create({ id: id, filename: filename }),
    });

    this.set('url', url);
    const linkText = 'Download voorbeeld';
    //let link = `/files/${id}/download?name=${filename}`;

    await render(hbs`{{toezicht/url-line url=this.url}}`);
    assert.equal(this.element.textContent.trim(), linkText);
    //assert.equal(this.element.querySelector('a').getAttribute('href'), link);
    
    // Template block usage:
    await render(hbs`
      {{#toezicht/url-line url=this.url}}
        template block text
      {{/toezicht/url-line}}
    `);
    assert.equal(this.element.textContent.trim(), linkText);

    //--- when url is not provided (a cached resource was not found)
    await render(hbs`{{toezicht/url-line}}`);
    assert.equal(this.element.textContent.trim(), '');
    
    // Template block usage:
    await render(hbs`
      {{#toezicht/url-line}}
        template block text
      {{/toezicht/url-line}}
    `);
    assert.equal(this.element.textContent.trim(), '');
  });

});
