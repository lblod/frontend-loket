import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | bbcdr/report-edit', function (hooks) {
  setupRenderingTest(hooks);

  test('it displays the report details', async function (assert) {
    const report = {
      created: new Date(),
      modified: new Date(),
      lastModifier: {},
      bestuurseenheid: {},
      status: {
        label: 'concept',
        uri: 'http://data.lblod.info/document-statuses/concept',
      },
      files: [
        { filename: 'test-1', extension: 'xml' },
        { filename: 'test-2', extension: 'xbrl' },
      ],
    };
    this.set('report', report);

    await render(hbs`{{bbcdr/report-edit report=report}}`);

    assert
      .dom('[data-test-loket=bbcdr-file-card]')
      .exists({ count: 2 }, 'Displays 2 file cards');
  });

  test('it displays a file upload iff status is concept and less than 2 files have been uploaded', async function (assert) {
    this.store = this.owner.lookup('service:store');
    const conceptStatus = this.store.createRecord('document-status', {
      label: 'concept',
      uri: 'http://data.lblod.info/document-statuses/concept',
    });

    const verstuurdStatus = this.store.createRecord('document-status', {
      label: 'verstuurd',
      uri: 'http://data.lblod.info/document-statuses/verstuurd',
    });

    const reportWith1File = {
      created: new Date(),
      modified: new Date(),
      status: conceptStatus,
      files: [{ filename: 'test-1', extension: 'xml' }],
    };
    this.set('report', reportWith1File);
    await render(hbs`{{bbcdr/report-edit report=report}}`);

    assert.dom('[data-test-loket=bbcdr-file-upload]').exists({ count: 1 });

    const reportWith2Files = {
      created: new Date(),
      modified: new Date(),
      status: conceptStatus,
      files: [
        { filename: 'test-1', extension: 'xml' },
        { filename: 'test-2', extension: 'xbrl' },
      ],
    };
    this.set('report', reportWith2Files);
    await settled();
    assert.dom('[data-test-loket=bbcdr-file-upload]').doesNotExist();

    const reportInSentState = {
      created: new Date(),
      modified: new Date(),
      status: verstuurdStatus,
      files: [{ filename: 'test-1', extension: 'xml' }],
    };
    this.set('report', reportInSentState);
    await settled();
    assert.dom('[data-test-loket=bbcdr-file-upload]').doesNotExist();
  });

  test('it displays only a close button if the report is in the sent state', async function (assert) {
    this.store = this.owner.lookup('service:store');
    const verstuurdStatus = this.store.createRecord('document-status', {
      label: 'verstuurd',
      uri: 'http://data.lblod.info/document-statuses/verstuurd',
    });

    const report = {
      created: new Date(),
      modified: new Date(),
      status: verstuurdStatus,
      files: [
        { filename: 'test-1', extension: 'xml' },
        { filename: 'test-2', extension: 'xml' },
      ],
    };
    this.set('report', report);
    await render(hbs`{{bbcdr/report-edit report=report}}`);

    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-close-panel-btn]'
      )
      .exists({ count: 1 });
    assert
      .dom('[data-test-loket=bbcdr-report-edit-buttons] .button')
      .exists({ count: 1 });
  });

  test('it enables the sent button iff the report is not in the sent state and 2 files have been uploaded', async function (assert) {
    this.store = this.owner.lookup('service:store');
    const conceptStatus = this.store.createRecord('document-status', {
      label: 'concept',
      uri: 'http://data.lblod.info/document-statuses/concept',
    });

    const verstuurdStatus = this.store.createRecord('document-status', {
      label: 'verstuurd',
      uri: 'http://data.lblod.info/document-statuses/verstuurd',
    });

    const file1 = this.store.createRecord('file', {
      filename: 'test-1',
      extension: 'xml',
    });

    const file2 = this.store.createRecord('file', {
      filename: 'test-2',
      extension: 'xbrl',
    });

    const unsavedReport = this.store.createRecord('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
      status: conceptStatus,
      files: [],
    });
    this.set('report', unsavedReport);
    await render(hbs`{{bbcdr/report-edit report=report}}`);

    assert.ok(unsavedReport.isNew, 'The report isNew');
    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]'
      )
      .exists({ count: 1 });
    // dom(...).isDisabled() doesn't work on an anchor-tag
    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]'
      )
      .hasClass('button--disabled');

    const unsavedReportWith2Files = this.store.createRecord('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
      status: conceptStatus,
      files: [file1, file2],
    });
    this.set('report', unsavedReportWith2Files);
    await settled();

    assert.ok(unsavedReportWith2Files.isNew, 'The report isNew');
    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]'
      )
      .exists({ count: 1 });
    // dom(...).isDisabled() doesn't work on an anchor-tag
    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]'
      )
      .doesNotHaveClass('button--disabled');

    const reportWith1File = {
      created: new Date(),
      modified: new Date(),
      status: conceptStatus,
      files: [file1],
    };
    this.set('report', reportWith1File);
    await settled();

    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]'
      )
      .exists({ count: 1 });
    // dom(...).isDisabled() doesn't work on an anchor-tag
    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]'
      )
      .hasClass('button--disabled');

    const reportWith2Files = {
      created: new Date(),
      modified: new Date(),
      status: conceptStatus,
      files: [file1, file2],
    };
    this.set('report', reportWith2Files);
    await settled();

    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]'
      )
      .exists({ count: 1 });
    // dom(...).isDisabled() doesn't work on an anchor-tag
    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]'
      )
      .doesNotHaveClass('button--disabled');

    const reportInSentState = {
      created: new Date(),
      modified: new Date(),
      status: verstuurdStatus,
      files: [file1, file2],
    };
    this.set('report', reportInSentState);
    await settled();
    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]'
      )
      .doesNotExist();
  });
});
