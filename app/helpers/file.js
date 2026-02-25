export function humanReadableSize(file) {
  //ripped from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
  const bytes = file.get('size');
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function filenameWithoutExtension(file) {
  const splits = file.get('filename').split('.');
  if (splits.length > 1)
    splits.splice(splits.length - 1, 1);
  return splits.join('');
}

export function extensionFormatted(file) {
  return file.get('extension').replaceAll(/\./g, "").toUpperCase();
}
