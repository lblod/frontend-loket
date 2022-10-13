import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

const LOKET_MODULE_CARD = {
  TITLE: '[data-test-loket-module-card="title"]',
  DESCRIPTION: '[data-test-loket-module-card="description"]',
  LINK: '[data-test-loket-module-card="link"]',
  EXTRA_INFORMATION_LINK:
    '[data-test-loket-module-card="extra-information-link"]',
  USER_MANUAL_LINK: '[data-test-loket-module-card="user-manual-link"]',
};

module('Integration | Component | loket-module-card', function (hooks) {
  setupRenderingTest(hooks);

  test('it can render a title', async function (assert) {
    this.title = 'Foo';

    await render(hbs`
      <LoketModuleCard>
        <:title>{{this.title}}</:title>
      </LoketModuleCard>
    `);

    assert.dom(LOKET_MODULE_CARD.TITLE).hasText('Foo');

    this.set('title', 'Bar');
    assert.dom(LOKET_MODULE_CARD.TITLE).hasText('Bar');

    await render(hbs`
      <LoketModuleCard />
    `);

    assert.dom(LOKET_MODULE_CARD.TITLE).doesNotExist();
  });

  test('it can render a description', async function (assert) {
    this.description = 'Foo';

    await render(hbs`
      <LoketModuleCard>
        <:description>{{this.description}}</:description>
      </LoketModuleCard>
    `);

    assert.dom(LOKET_MODULE_CARD.DESCRIPTION).hasText('Foo');

    this.set('description', 'Bar');
    assert.dom(LOKET_MODULE_CARD.DESCRIPTION).hasText('Bar');

    await render(hbs`
      <LoketModuleCard />
    `);

    assert.dom(LOKET_MODULE_CARD.DESCRIPTION).doesNotExist();
  });

  test('it has a block to render the module link', async function (assert) {
    await render(hbs`
      <LoketModuleCard>
        <:link>
          Foo
        </:link>
      </LoketModuleCard>
    `);

    assert.dom(LOKET_MODULE_CARD.LINK).hasText('Foo');
  });

  test('it can show a link to an external page where users can get more information about the module', async function (assert) {
    await render(hbs`
      <LoketModuleCard
        @extraInformationLink={{this.link}}
      />
    `);

    assert
      .dom(LOKET_MODULE_CARD.EXTRA_INFORMATION_LINK)
      .doesNotExist("it doesn't show the link if none is given");

    this.set('link', 'https://extra-information.test');

    assert
      .dom(LOKET_MODULE_CARD.EXTRA_INFORMATION_LINK)
      .hasAttribute('href', 'https://extra-information.test');
  });

  test('it can show a link to a user manual', async function (assert) {
    await render(hbs`
      <LoketModuleCard
        @userManualLink={{this.link}}
      />
    `);

    assert
      .dom(LOKET_MODULE_CARD.USER_MANUAL_LINK)
      .doesNotExist("it doesn't show the link if none is given");

    this.set('link', 'https://user-manual.test');

    assert
      .dom(LOKET_MODULE_CARD.USER_MANUAL_LINK)
      .hasAttribute('href', 'https://user-manual.test');
  });
});
