export function downloadLink(rdo, filename) {
  const base = `/files/${rdo.id}/download`;
  return filename ? `${base}?name=${encodeURIComponent(filename)}` : base;
}

export function downloadSuccess(rdo) {
  return rdo.status === 'http://lblod.data.gift/file-download-statuses/success';
}

export function downloadOngoing(rdo) {
  const ongoingStatuses = [
    'http://lblod.data.gift/file-download-statuses/ongoing',
    'http://lblod.data.gift/file-download-statuses/ready-to-be-cached',
  ];
  return ongoingStatuses.includes(rdo.status);
}

export function downloadFailed(rdo) {
  return rdo.status === 'http://lblod.data.gift/file-download-statuses/failure';
}
