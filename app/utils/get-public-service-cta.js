export async function getPublicServiceCta(product) {
  let callToAction;

  const procedures = await product.procedures;

  let i = 0;
  while (!callToAction && i < procedures.length) {
    const procedure = procedures[i];
    const websites = await procedure.websites;
    if (websites.length) {
      callToAction = websites[0];
    }
    i++;
  }

  if (!callToAction) {
    // We fall back to the "website url" in case the "procedure url" is not filled in in IPDC
    const websites = await product.websites;
    callToAction = websites.at(0);
  }

  return callToAction;
}
