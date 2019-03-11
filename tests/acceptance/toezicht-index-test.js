import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import setupSession from '../helpers/session';
import { currentSession, authenticateSession, invalidateSession} from 'ember-simple-auth/test-support';

module('Acceptance | toezicht index', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  test('authenticated users can visit /toezicht/inzendingen', async function(assert) {

    await setupSession(this.server);

    await visit('/toezicht/inzendingen');
    assert.equal(currentURL(), '/toezicht/inzendingen', 'user is on super-secret-url');
  });
});
