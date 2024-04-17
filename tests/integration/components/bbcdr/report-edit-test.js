import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | bbcdr/report-edit', function (hooks) {
  setupRenderingTest(hooks);

  test('it displays the report details', async function (assert) {
    let store = this.owner.lookup('service:store');
    let report = store.createRecord('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
    });

    report.status = store.createRecord('document-status', {
      label: 'concept',
      uri: 'http://data.lblod.info/document-statuses/concept',
    });

    report.files = [
      store.createRecord('file', {
        filename: 'test-1',
        extension: 'xml',
      }),
      store.createRecord('file', {
        filename: 'test-2',
        extension: 'xbrl',
      }),
    ];

    this.setProperties({ report, reportFiles: await report.files });

    await render(hbs`
      <Bbcdr::report-edit
        @report={{this.report}}
        @reportFiles={{this.reportFiles}}
      />
    `);

    assert
      .dom('[data-test-loket=bbcdr-file-card]')
      .exists({ count: 2 }, 'Displays 2 file cards');
  });

  test('it displays a file upload if status is concept and less than 2 files have been uploaded', async function (assert) {
    let store = this.owner.lookup('service:store');
    let reportWith1File = store.createRecord('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
    });

    reportWith1File.status = store.createRecord('document-status', {
      label: 'concept',
      uri: 'http://data.lblod.info/document-statuses/concept',
    });

    reportWith1File.files = [
      store.createRecord('file', { filename: 'test-1', extension: 'xml' }),
    ];

    this.setProperties({
      report: reportWith1File,
      reportFiles: await reportWith1File.files,
    });

    await render(hbs`
      <Bbcdr::ReportEdit
        @report={{this.report}}
        @reportFiles={{this.reportFiles}}
      />
    `);

    assert.dom('[data-test-loket=bbcdr-file-upload]').exists({ count: 1 });

    let reportWith2Files = store.createRecord('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
    });
    reportWith2Files.files = [
      store.createRecord('file', { filename: 'test-1', extension: 'xml' }),
      store.createRecord('file', { filename: 'test-2', extension: 'xbrl' }),
    ];

    this.setProperties({
      report: reportWith2Files,
      reportFiles: await reportWith2Files.files,
    });

    await settled();
    assert
      .dom('[data-test-loket=bbcdr-file-upload]')
      .doesNotExist("it doesn't show the file uploader if 2 files are present");

    let sentStatus = store.createRecord('document-status', {
      label: 'verstuurd',
      uri: 'http://data.lblod.info/document-statuses/verstuurd',
    });

    let reportInSentState = store.createRecord('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
    });
    reportInSentState.status = sentStatus;
    reportInSentState.files = [
      store.createRecord('file', { filename: 'test-1', extension: 'xml' }),
    ];

    this.setProperties({
      report: reportInSentState,
      reportFiles: await reportInSentState.files,
    });
    await settled();
    assert.dom('[data-test-loket=bbcdr-file-upload]').doesNotExist();
  });

  test('it displays only a close button if the report is in the sent state', async function (assert) {
    let store = this.owner.lookup('service:store');

    store.push({
      data: {
        id: '1234',
        type: 'bbcdr-report',
      },
    });

    let report = store.peekRecord('bbcdr-report', '1234');

    let sentStatus = store.createRecord('document-status', {
      label: 'verstuurd',
      uri: 'http://data.lblod.info/document-statuses/verstuurd',
    });
    report.status = sentStatus;
    report.files = [
      store.createRecord('file', { filename: 'test-1', extension: 'xml' }),
      store.createRecord('file', { filename: 'test-2', extension: 'xbrl' }),
    ];

    this.setProperties({ report, reportFiles: await report.files });
    await render(hbs`
      <Bbcdr::ReportEdit
        @report={{this.report}}
        @reportFiles={{this.reportFiles}}
      />`);

    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-close-panel-btn]',
      )
      .exists({ count: 1 });

    assert
      .dom('[data-test-loket=bbcdr-already-submitted-message]')
      .exists(
        { count: 1 },
        'It shows a message that the report was already submitted before',
      );

    assert.dom('[data-test-loket=bbcdr-send-btn]').doesNotExist();
    assert.dom('[data-test-loket=bbcdr-save-btn]').doesNotExist();
    assert.dom('[data-test-loket=bbcdr-cancel-btn]').doesNotExist();
    assert.dom('[data-test-loket=bbcdr-delete-btn]').doesNotExist();
  });

  test('it enables the "send to government" button if the report is not in the sent state and 2 files have been uploaded', async function (assert) {
    let store = this.owner.lookup('service:store');
    let conceptStatus = store.createRecord('document-status', {
      label: 'concept',
      uri: 'http://data.lblod.info/document-statuses/concept',
    });

    let sentStatus = store.createRecord('document-status', {
      label: 'verstuurd',
      uri: 'http://data.lblod.info/document-statuses/verstuurd',
    });

    let file1 = store.createRecord('file', {
      filename: 'test-1',
      extension: 'xml',
    });

    let file2 = store.createRecord('file', {
      filename: 'test-2',
      extension: 'xbrl',
    });

    let unsavedReport = store.createRecord('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
    });

    unsavedReport.status = conceptStatus;
    this.set('report', unsavedReport);

    await render(
      hbs`<Bbcdr::ReportEdit @report={{this.report}} @reportFiles={{this.reportFiles}} />`,
    );

    assert.true(unsavedReport.isNew, 'The report isNew');
    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]',
      )
      .exists({ count: 1 })
      .isDisabled();

    let unsavedReportWith1File = store.createRecord('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
    });
    unsavedReportWith1File.status = conceptStatus;
    unsavedReportWith1File.files = [file1];
    this.setProperties({
      report: unsavedReportWith1File,
      reportFiles: await unsavedReportWith1File.files,
    });
    await settled();

    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]',
      )
      .exists({ count: 1 })
      .isDisabled();

    let unsavedReportWith2Files = store.createRecord('bbcdr-report', {
      created: new Date(),
      modified: new Date(),
    });
    unsavedReportWith2Files.status = conceptStatus;
    unsavedReportWith2Files.files = [file1, file2];

    this.setProperties({
      report: unsavedReportWith2Files,
      reportFiles: await unsavedReportWith2Files.files,
    });
    await settled();

    assert.true(unsavedReportWith2Files.isNew, 'The report isNew');
    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]',
      )
      .exists({ count: 1 })
      .isNotDisabled();

    store.push({
      data: {
        id: '1234',
        type: 'bbcdr-report',
      },
    });

    let reportInSentState = store.peekRecord('bbcdr-report', '1234');
    reportInSentState.status = sentStatus;
    reportInSentState.files = [file1, file2];

    this.setProperties({
      report: reportInSentState,
      reportFiles: await reportInSentState.files,
    });
    await settled();

    assert
      .dom(
        '[data-test-loket=bbcdr-report-edit-buttons] [data-test-loket=bbcdr-send-btn]',
      )
      .doesNotExist();
  });
});
