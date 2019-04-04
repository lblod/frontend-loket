import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import setupSession, { CLASSIFICATION_LABEL } from '../helpers/session';

module('Acceptance | toezicht index', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  test('authenticated users can visit /toezicht/inzendingen', async function(assert) {
    await setupSession(this.server);
    await visit('/toezicht/inzendingen');
    assert.equal(currentURL(), '/toezicht/inzendingen', 'user is on super-secret-url');
  });

  test('Making a new melding works', async function(assert){
    await setupSession(this.server);
    await visit('/toezicht/inzendingen');

    await click('[data-test-loket=new-melding-button]');
    assert.equal(currentURL(), '/toezicht/inzendingen/new', 'Clicked the "make new" button and our user is on the "new toezicht" route');
    assert.dom('[data-test-loket=next-step-button]').hasAttribute('class', /\bdisabled\b/, 'The "proceed" button is disabled by default');

    await click('[data-test-loket=new-melding-button]');
    assert.equal(currentURL(), '/toezicht/inzendingen', 'Clicked again and the user is now back on our secret url');
  });

  test('The inzending index page has a correct title', async function(assert) {
    this.server.logging = true;
    await setupSession(this.server);
    await visit('/toezicht/inzendingen');
    const sectionTitle = 'Toezicht';
    assert.dom(`[data-test-loket=inzendingen-page-title]`).includesText(sectionTitle, "Title is correct");
    assert.dom(`[data-test-loket=inzendingen-page-title]`).includesText(CLASSIFICATION_LABEL, "Classification is correct");
  });
});
