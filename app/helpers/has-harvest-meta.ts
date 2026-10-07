export default function hasHarvestMeta(record: {
  vendor?: unknown;
  source?: unknown;
  sourceId?: unknown;
  harvestDate?: unknown;
  harvestJob?: unknown;
  harvestLink?: unknown;
}) {
  return (
    record.vendor ||
    record.source ||
    record.sourceId ||
    record.harvestDate ||
    record.harvestJob ||
    record.harvestLink
  );
}
