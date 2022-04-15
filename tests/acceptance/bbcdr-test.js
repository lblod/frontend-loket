import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import session from '../helpers/session';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | bbcdr', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /bbcdr/ without login redirects to /login', async function (assert) {
    await visit('/bbcdr');

    assert.equal(currentURL(), '/login');
  });

  test('visiting /bbcdr/ with login shows bbcdr', async function (assert) {
    await session(this.server);

    await visit('/bbcdr/');

    assert.ok(currentURL().startsWith('/bbcdr'));
  });

  test('visiting /bbcdr/ with only bbcdr access shows bbcdr', async function (assert) {
    await session(this.server, { roles: ['LoketLB-bbcdrGebruiker'] });

    await visit('/bbcdr/');

    assert.ok(currentURL().startsWith('/bbcdr'));
  });

  test('visiting /bbcdr/ with incorrect access rights does not show bbcdr', async function (assert) {
    await session(this.server, { roles: ['LoketLB-berichtenGebruiker'] });

    await visit('/bbcdr/');

    assert.notOk(currentURL().startsWith('/bbcdr'));
  });
});
