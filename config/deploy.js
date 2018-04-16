/* eslint-env node */
'use strict';

module.exports = function(deployTarget) {
  let ENV = {
    build: {
      environment: 'production'
    },
    'ssh-index': {
      username: 'root',
      host: 'dock.semte.ch',
      remoteDir: '/data/digitaal-loket/dev-mdb/loket-app',
      agent: process.env.SSH_AUTH_SOCK,
      port: 2275,
      allowOverwrite: true
    },
    'rsync': {
      dest: '/data/digitaal-loket/dev-mdb/loket-app',
      username: 'root',
      host: 'dock.semte.ch',
      port: 2275,
      delete: false,
      privateKey: process.env.SSH_AUTH_SOCK,
      arg:['--verbose']
    }
  };

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV['ssh-index'] = {
      username: 'root',
      host: 'dock.semte.ch',
      remoteDir: '/data/digitaal-loket/mdb/loket-app',
      agent: process.env.SSH_AUTH_SOCK,
      port: 2275,
      allowOverwrite: true
    };

    ENV['rsync'] = {
      dest: '/data/digitaal-loket/mdb/loket-app',
      username: 'root',
      host: 'dock.semte.ch',
      port: 2275,
      delete: false,
      privateKey: process.env.SSH_AUTH_SOCK,
      arg:['--verbose']
    };
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
