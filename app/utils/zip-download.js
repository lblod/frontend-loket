// Source: https://github.com/Touffy/client-zip?tab=readme-ov-file#quick-start
export function triggerZipDownload(zipBlob, filename) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(zipBlob);
  link.href = url;
  link.download = filename ? filename : ''; // The browser generates a filename if we don't provide one
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
