export function loadPublicServiceDetails(store, publicServiceId) {
  return store.findRecord('public-service', publicServiceId, {
    reload: true,
    include: 'concept,type,status,review-status',
  });
}
