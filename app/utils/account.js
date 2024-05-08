/**
 *  This loads the account including all the needed relationships
 * @param {} store
 * @param {string} accountId
 */
export async function loadAccountData(store, accountId) {
  return await store.findRecord('account', accountId, {
    include: 'gebruiker.bestuurseenheden.classificatie',
  });
}
