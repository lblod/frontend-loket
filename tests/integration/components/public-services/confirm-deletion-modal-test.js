import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import ConfirmDeletionModal from 'frontend-loket/components/public-services/confirm-deletion-modal';
import { timeout } from 'ember-concurrency';

const MODAL = {
  ELEMENT: '[data-test-confirm-deletion-modal=modal]',
  DELETE_BUTTON: '[data-test-confirm-deletion-modal=delete-button]',
  CANCEL_BUTTON: '[data-test-confirm-deletion-modal=cancel-button]',
};

module(
  'Integration | Component | public-services/confirm-deletion-modal',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      let modalsService = this.owner.lookup('service:modals');

      await render(hbs`<AuModalContainer /><EpmModalContainer />`);

      modalsService.open(ConfirmDeletionModal, {
        deleteHandler: () => {},
      });

      await settled();

      assert.dom(MODAL.ELEMENT).exists();
    });

    test('it calls the deleteHandler when the delete button is clicked', async function (assert) {
      let modalsService = this.owner.lookup('service:modals');

      await render(hbs`<AuModalContainer /><EpmModalContainer />`);
      modalsService.open(ConfirmDeletionModal, {
        deleteHandler: () => {
          assert.step('deleted');
        },
      });

      await settled();
      let deleteButton = document.querySelector(MODAL.DELETE_BUTTON);
      await click(deleteButton);

      assert
        .dom(MODAL.ELEMENT)
        .doesNotExist('it closes the modal after the deletion succeeded');

      assert.verifySteps(['deleted']);
    });

    test("it doesn't call the deleteHandler if the modal is closed without clicking the delete button", async function (assert) {
      let modalsService = this.owner.lookup('service:modals');

      await render(hbs`<AuModalContainer /><EpmModalContainer />`);
      modalsService.open(ConfirmDeletionModal, {
        deleteHandler: () => {
          assert.step('deleted');
        },
      });

      await settled();
      let cancelButton = document.querySelector(MODAL.CANCEL_BUTTON);
      await click(cancelButton);
      assert.dom(MODAL.ELEMENT).doesNotExist();
      assert.verifySteps([]);
    });

    test('it ignores modal close requests while the deleteHandler is running', async function (assert) {
      this.isOpen = true;

      this.data = {
        deleteHandler: async () => {
          await timeout(100);
          assert.step('deleted');
        },
      };

      this.close = () => {
        this.set('isOpen', false);
        assert.step('closed');
      };

      await render(hbs`
        <AuModalContainer /><EpmModalContainer />
        {{#if this.isOpen}}
          <PublicServices::ConfirmDeletionModal @close={{this.close}} @data={{this.data}} />
        {{/if}}
      `);

      let deleteButton = document.querySelector(MODAL.DELETE_BUTTON);
      let cancelButton = document.querySelector(MODAL.CANCEL_BUTTON);

      click(deleteButton);
      click(cancelButton);

      await settled();

      assert
        .dom(MODAL.ELEMENT)
        .doesNotExist('it closes the modal after the deletion succeeded');

      assert.verifySteps(['deleted', 'closed']);
    });
  }
);
