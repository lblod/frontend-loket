import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | value-with-placeholder', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a placeholder if the given value is falsy', async function (assert) {
    this.value = undefined;
    await render(hbs`<ValueWithPlaceholder @value={{this.value}} />`);
    assert.dom(this.element).hasText('-');

    this.set('value', null);
    assert.dom(this.element).hasText('-');

    this.set('value', '');
    assert.dom(this.element).hasText('-');

    this.set('value', 0);
    assert.dom(this.element).hasText('-');

    this.set('value', 'not falsy');
    assert
      .dom(this.element)
      .hasText('not falsy', 'it shows the value if it is truthy');
  });

  test('it allows you to customize the non-falsy value is rendered by using the :value named block', async function (assert) {
    this.value = ['foo', 'bar'];

    await render(hbs`
      <ValueWithPlaceholder @value={{this.value}}>
        <:value as |someArray|>
          <ul data-test-ul>
            {{#each someArray as |value|}}
              <li data-test-li>{{value}}</li>
            {{/each}}
          </ul>
        </:value>
      </ValueWithPlaceholder>
    `);

    assert.dom('[data-test-li]').exists({ count: 2 });
    assert.dom('[data-test-ul]').hasText('foo bar');

    this.set('value', []);
    assert
      .dom(this.element)
      .hasText(
        '-',
        'it uses the handlebars definition of falsy which considers empty arrays falsy',
      );
  });
});
