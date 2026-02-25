export function downloadLink(rdo) {
  return `/files/${rdo.get('id')}/download`;
}

export function downloadSuccess(rdo) {
  return (
    rdo.get('status') === 'http://lblod.data.gift/file-download-statuses/success'
  );
}

export function downloadOngoing(rdo) {
  const ongoingStatuses = [
    'http://lblod.data.gift/file-download-statuses/ongoing',
    'http://lblod.data.gift/file-download-statuses/ready-to-be-cached',
  ];
  return ongoingStatuses.includes(rdo.get('status'));
}

export function downloadFailed(rdo) {
  return (
    rdo.get('status') === 'http://lblod.data.gift/file-download-statuses/failure'
  );
}
