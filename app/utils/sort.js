/**
 * Sorts objects by their .order property
 * @param {{ order?: number }} a
 * @param {{ order?: number}} b
 * @returns {number}
 */
export function byOrder(a, b) {
  return a?.order - b?.order;
}
