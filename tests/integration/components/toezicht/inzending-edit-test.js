import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | toezicht/inzending-edit', function(hooks) {
  setupRenderingTest(hooks);

  test('Sending an empty form fails', async function(assert) {
    this.set('model', EmberObject.create({
      formNode: true,
      inzendingVoorToezicht: EmberObject.create({
        besluitType: EmberObject.create({ id: 1})
      }),
    }));

    await render(hbs`
    {{toezicht/inzending-edit
      model=model
      canSend=true
    }}`);
    await click('[data-test-loket="submit-button"]');
    assert
    .dom('[data-test-loket="warning-message"]')
    .exists('Aandacht wordt getoond als de gebruiker wil een nul vormuleer versturen.');
  });

  test('Verwijder button is shown/hidden correctly', async function(assert){
    this.set('model', EmberObject.create({
      formNode: true,
      isNew: true,
      inzendingVoorToezicht: EmberObject.create({
        besluitType:EmberObject.create({ id:1 })
      }),
    }));
    await render(hbs`
    {{toezicht/inzending-edit
      model=model
      canSend=true
    }}`);
    assert
      .dom('[data-test-loket="dismiss-button"]')
      .doesNotExist('The verwijder button is not shown when creating a new toezicht.');

    this.set('model', EmberObject.create({
      id: 1,
      formNode: true,
      isNew: false,
      inzendingVoorToezicht: EmberObject.create({
        id: 1,
        besluitType:EmberObject.create({ id:1 }),
        status:EmberObject.create({
          id: 1,
          isVerstuurd:true,
        })
      }),
    }));
    await render(hbs`
    {{toezicht/inzending-edit
      model=model
      canSend=true
    }}`);
    assert
      .dom('[data-test-loket="dismiss-button"]')
      .doesNotExist('The verwijder button is not shown for already sent toezichts.');
  });

  test('Bewaar button is shown/hidden correctly', async function(assert){

    this.set('model', EmberObject.create({
      formNode: true,
      isNew: true,
      inzendingVoorToezicht: EmberObject.create({
        besluitType:EmberObject.create({ id:1 })
      }),
    }));
    await render(hbs`
    {{toezicht/inzending-edit
      model=model
      canSend=true
    }}`);
    assert
      .dom('[data-test-loket="bewaar-button"]')
      .exists('The Bewaar button is shown when creating a new toezicht.');

    this.set('model', EmberObject.create({
      id: 1,
      formNode: true,
      isNew: false,
      inzendingVoorToezicht: EmberObject.create({
        id: 1,
        besluitType:EmberObject.create({ id:1 }),
        status:EmberObject.create({
          id: 1,
          isVerstuurd:true,
        })
      }),
    }));
    await render(hbs`
    {{toezicht/inzending-edit
      model=model
      canSend=true
    }}`);
    assert
      .dom('[data-test-loket="bewaar-button"]')
      .doesNotExist('The Bewaar button is not shown for already sent toezichts.');

    this.set('model', EmberObject.create({
      id: 1,
      formNode: true,
      isNew: false,
      inzendingVoorToezicht: EmberObject.create({
        id: 1,
        besluitType:EmberObject.create({ id:1 }),
        status:EmberObject.create({
          id: 1,
          isConcept:true,
        })
      }),
    }));
    await render(hbs`
    {{toezicht/inzending-edit
      model=model
      canSend=true
      canSave=true
    }}`);
    assert
      .dom('[data-test-loket="bewaar-button"]')
      .exists('The Bewaar button is shown for toezichts in the "concept" status.');
  });

  test('Verstuur button is shown/hidden correctly', async function(assert){
    this.set('model', EmberObject.create({
      id: 1,
      formNode: true,
      isNew: false,
      inzendingVoorToezicht: EmberObject.create({
        id: 1,
        besluitType:EmberObject.create({ id:1 }),
        status:EmberObject.create({
          id: 1,
          isVerstuurd:true,
        })
      }),
    }));
    await render(hbs`
    {{toezicht/inzending-edit
      model=model
      canSend=true
    }}`);
    assert
      .dom('[ddata-test-loket="submit-button"]')
      .doesNotExist('The Vestuur button is not shown for already sent toezichts.');
  });

  test('There is always at least one close button', async function(assert){
    this.set('model', EmberObject.create({
      formNode: true,
      isNew: true,
      inzendingVoorToezicht: EmberObject.create({
        besluitType:EmberObject.create({id:1})
      }),
    }));
    await render(hbs`
    {{toezicht/inzending-edit
      model=model
      canSend=true
    }}`);
    assert
    .dom('[data-test-loket="bewaar-button"]')
    .exists('There is at least one close button when model is provided.');

    this.set('model', EmberObject.create({ formNode: true }));
    await render(hbs`
    {{toezicht/inzending-edit model=model}}`);
    //await this.pauseTest();
    assert
      .dom('[data-test-loket=close-button]')
      .exists('There is at least one close button even when no model is provided.');
  });
});
