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

  return callToAction;
}
