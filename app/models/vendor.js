import Model, { attr } from '@warp-drive/legacy/model';

export const NO_PROVENANCE_VENDOR_ID = 'none';
export const ALL_VENDORS_ID = 'all';

export default class VendorModel extends Model {
  @attr name;
}
