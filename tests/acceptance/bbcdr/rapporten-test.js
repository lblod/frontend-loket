import { module, test } from 'qunit';
import {
  visit,
  click,
  currentRouteName,
  currentURL
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import session from '../../helpers/session';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | bbcdr/rapporten', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    await session( this.server );
  });

  test('visiting /bbcdr/rapporten shows a data-table listing all reports', async function(assert){
    const gebruiker = this.server.create('gebruiker', {
      voornaam: 'Jane',
      achternaam: 'Doe'
    });

    const bestuurseenheid = this.server.create('bestuurseenheid', {
      id: '974816591f269bb7d74aa1720922651529f3d3b2a787f5c60b73e5a0384950a4',
      naam: 'Vlavirgem'
    });

    const documentStatus = this.server.create('document-status', {
      label: 'concept'
    });

    const file1 = this.server.create('file', {
      filename: 'test-1',
      extension: 'xml'
    });

    const file2 = this.server.create('file', {
      filename: 'test-2',
      extension: 'xbrl'
    });

    this.server.create('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
      status: documentStatus,
      lastModifier: gebruiker,
      bestuurseenheid: bestuurseenheid,
      files: [ file1, file2 ]
    });

    this.server.create('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
      status: documentStatus,
      lastModifier: gebruiker,
      bestuurseenheid: bestuurseenheid,
      files: [ file1 ]
    });

    this.server.create('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
      status: documentStatus,
      lastModifier: gebruiker,
      bestuurseenheid: bestuurseenheid,
      files: []
    });

    await visit('/bbcdr/rapporten');

    assert.dom(`[data-test-loket=bbcdr-report-table]`).exists();
    assert.dom(`[data-test-loket=bbcdr-report-table-body] tr`).exists( { count: 3 });
  });

  test('visiting /bbcdr/rapporten shows a button to create a new report', async function(assert){
    await visit('/bbcdr/rapporten');

    await click('[data-test-loket=bbcdr-create-report-btn]');
    assert.equal(currentRouteName(), 'bbcdr.rapporten.new', 'Clicking the create button opens the create panel');

    await click('[data-test-loket=bbcdr-create-report-btn]');
    assert.equal(currentRouteName(), 'bbcdr.rapporten.index', 'Clicking the create button again closes the create panel');
  });

  test('clicking the detail link on bbcdr report opens the bbcdr report details', async function(assert) {
    this.server.create('bbcdr-report', {
      id: '1234',
      created: new Date(),
      modified: new Date(),
      files: []
    });

    await visit('/bbcdr/rapporten');

    await click('[data-test-loket=bbcdr-report-table-open-details-column] a');
    assert.equal(currentRouteName(), 'bbcdr.rapporten.edit', 'Clicking the details link opens the detail panel');
    assert.ok(currentURL().endsWith('/1234'), 'Clicking the details link opens the details of the selected report');

    await click('[data-test-loket=bbcdr-report-edit-header] a[data-test-loket=bbcdr-close-panel-btn]');
    assert.equal(currentRouteName(), 'bbcdr.rapporten.index', 'Clicking the close icon in the header closes the detail panel');

    await click('[data-test-loket=bbcdr-report-table-open-details-column] a');
    assert.equal(currentRouteName(), 'bbcdr.rapporten.edit', 'Clicking the details link opens the detail panel');
    assert.ok(currentURL().endsWith('/1234'), 'Clicking the details link opens the details of the selected report');

    await click('[data-test-loket=bbcdr-report-edit-buttons] a[data-test-loket=bbcdr-close-panel-btn]');
    assert.equal(currentRouteName(), 'bbcdr.rapporten.index', 'Clicking the close button in the footer closes the detail panel');
  });
});
