import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | bbcdr/report-table', function (hooks) {
  setupRenderingTest(hooks);

  test('it displays each report as a row in the table', async function (assert) {
    const reports = [
      {
        created: new Date(),
        modified: new Date(),
        status: { label: 'concept' },
        lastModifier: {},
        bestuurseenheid: {},
        files: [
          { filename: 'test-1', extension: 'xml' },
          { filename: 'test-2', extension: 'xbrl' },
          { filename: 'test-3', extension: 'txt' },
        ],
      },
      {
        created: new Date(),
        modified: new Date(),
        status: { label: 'verstuurd' },
        lastModifier: {},
        bestuurseenheid: {},
        files: [{ filename: 'test-1', extension: 'xml' }],
      },
    ];
    this.set('reports', reports);

    await render(hbs`<Bbcdr::ReportTable @content={{this.reports}} />`);

    assert
      .dom('[data-test-loket=bbcdr-report-table-body] tr')
      .exists({ count: 2 });
  });

  test('it displays a message if there are no reports', async function (assert) {
    this.set('reports', []);
    await render(hbs`<Bbcdr::ReportTable @content={{this.reports}} />`);

    assert
      .dom('[data-test-loket=bbcdr-report-table-body] tr:first-child')
      .hasText('Geen rapporten gevonden');
  });

  test('it displays all files for a report', async function (assert) {
    const reports = [
      {
        created: new Date(),
        modified: new Date(),
        status: { label: 'concept' },
        files: [
          { filename: 'test-1', extension: 'xml' },
          { filename: 'test-2', extension: 'xbrl' },
          { filename: 'test-3', extension: 'txt' },
        ],
      },
      {
        created: new Date(),
        modified: new Date(),
        status: { label: 'verstuurd' },
        files: [{ filename: 'test-1', extension: 'xml' }],
      },
      {
        created: new Date(),
        modified: new Date(),
        status: { label: 'verstuurd' },
        files: [],
      },
    ];
    this.set('reports', reports);

    await render(hbs`<Bbcdr::ReportTable @content={{this.reports}} />`);

    assert
      .dom(
        '[data-test-loket=bbcdr-report-table-body] tr:nth-child(1) td[data-test-loket=bbcdr-report-table-files-column] [data-test-loket=bbcdr-file-miniature]'
      )
      .exists({ count: 3 });
    assert
      .dom(
        '[data-test-loket=bbcdr-report-table-body] tr:nth-child(2) td[data-test-loket=bbcdr-report-table-files-column] [data-test-loket=bbcdr-file-miniature]'
      )
      .exists({ count: 1 });
    assert
      .dom(
        '[data-test-loket=bbcdr-report-table-body] tr:nth-child(3) td[data-test-loket=bbcdr-report-table-files-column] [data-test-loket=bbcdr-file-miniature]'
      )
      .doesNotExist();
  });

  test('it displays a link to open the report details route', async function (assert) {
    const reports = [
      {
        created: new Date(),
        modified: new Date(),
        status: { label: 'concept' },
        files: [
          { filename: 'test-1', extension: 'xml' },
          { filename: 'test-2', extension: 'xbrl' },
          { filename: 'test-3', extension: 'txt' },
        ],
      },
      {
        created: new Date(),
        modified: new Date(),
        status: { label: 'verstuurd' },
        files: [],
      },
    ];
    this.set('reports', reports);

    await render(hbs`<Bbcdr::ReportTable @content={{this.reports}} />`);

    for (let i = 0; i < reports.length; i++) {
      assert
        .dom(
          `[data-test-loket=bbcdr-report-table-body] tr:nth-child(${
            i + 1
          }) td[data-test-loket=bbcdr-report-table-open-details-column] a`
        )
        .exists({ count: 1 });
    }
  });
});
