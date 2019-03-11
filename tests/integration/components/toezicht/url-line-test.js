import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | toezicht/url-line', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders the correct link for a cached url', async function(assert) {
    //--- when url is provided (a cached resource was found)
    const expectedLinkText = 'Download voorbeeld';
    const id = 5;
    const filename = 'somefile.png'; 
    const url = EmberObject.create({
      address: 'someURL',
      replicatedFile: EmberObject.create({
        id: id,
        filename: filename,
        downloadLink: `/files/${id}/download?name=${filename}`
      }),
    });

    this.set('url', url);
    const expectedLinkHref = `/files/${id}/download?name=${filename}`;
    
    await render(hbs`{{toezicht/url-line url=this.url}}`);
    assert.equal(this.element.textContent.trim(), expectedLinkText);
    assert.equal(this.element.querySelector('a').getAttribute('href'), expectedLinkHref);
    
    // Template block usage:
    await render(hbs`
    {{#toezicht/url-line url=this.url}}
    template block text
    {{/toezicht/url-line}}
    `);
    assert.equal(this.element.textContent.trim(), expectedLinkText);
  });

  test('it renders nothing if the url is not cached', async function(assert) {
    //--- when url is not provided (a cached resource was not found)
    const expectedLinkText = 'Geen voorbeeld';
    await render(hbs`{{toezicht/url-line}}`);
    assert.equal(this.element.textContent.trim(), expectedLinkText);
    
    // Template block usage:
    await render(hbs`
      {{#toezicht/url-line}}
        template block text
      {{/toezicht/url-line}}
    `);
    assert.equal(this.element.textContent.trim(), expectedLinkText);
  });
});
