import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | data-list', function (hooks) {
  setupRenderingTest(hooks);

  test('it yields a data component', async function (assert) {
    await render(hbs`
      <DataList as |Data|>
        <Data>
          <:title>Foo</:title>
          <:content>Bar</:content>
        </Data>
      </DataList>
    `);

    assert.dom('[data-test-data-list]').hasText('Foo Bar');
  });

  test('it accepts extra attributes', async function (assert) {
    await render(hbs`
      <DataList data-foo="bar" as |Data|>
        <Data>
          <:title>Foo</:title>
          <:content>Bar</:content>
        </Data>
      </DataList>
    `);

    assert.dom('[data-test-data-list]').hasAttribute('data-foo', 'bar');
  });
});
