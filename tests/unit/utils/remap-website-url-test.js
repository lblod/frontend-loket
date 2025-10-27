import { remapUrl } from 'frontend-loket/utils/remap-website-url';
import { module, test } from 'qunit';

module('Unit | Util | remapUrl', function () {
  test('it maps urls to different ones based on a urlMap object', function (assert) {
    assert.equal(
      remapUrl('https://foo.be', {
        'https://foo.be': 'https://bar.be',
      }),
      'https://bar.be',
    );

    assert.equal(
      remapUrl('https://foo.be', {
        'https://bar.be': 'https://baz.be',
      }),
      'https://foo.be',
      "it returns the url as-is if it's not part of the url map",
    );

    assert.equal(
      remapUrl('https://foo.be/path', {
        'https://foo.be': 'https://bar.be',
      }),
      'https://bar.be/path',
      'it partially replaces the domain in the url',
    );

    assert.equal(
      remapUrl('http://foo.be/path', {
        'https://foo.be': 'https://bar.be',
      }),
      'http://foo.be/path',
      'it only replaces the domain if the protocol also matches',
    ); // Should we try to support this? I don't think it will actually happen.

    assert.equal(
      remapUrl('https://foo.be', {
        'https://foo.be': '',
      }),
      '/',
      'it falls back to / if the resulting url is empty',
    ); // Support for the local development setup without having to know the port the app is running on
  });
});
