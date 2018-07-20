import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    download(report) {
      window.location = `/rapporten/toezicht/${report.filename}`;
    }
  }
});
