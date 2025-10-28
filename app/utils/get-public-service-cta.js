import { remapWebsiteUrl } from './remap-website-url';

export async function getPublicServiceCta(product) {
  let callToAction;

  const procedures = await product.procedures;
  let i = 0;
  while (!callToAction && i < procedures.length) {
    const procedure = procedures[i];
    const websites = await procedure.websites;
    if (websites.length) {
      callToAction = websites[0];
      // We're modifying the actual record data here, so it will be marked as 'dirty'
      // Ideally we would update the urls before they are pushed into the store, but that is more complex to setup
      // Since we're only displaying this data the dirty state shouldn't cause any problems.
      remapWebsiteUrl(callToAction);
    }
    i++;
  }

  return callToAction;
}
