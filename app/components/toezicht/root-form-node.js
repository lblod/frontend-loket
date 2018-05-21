import Component from '@ember/component';
import { inject as service } from '@ember/service';

const flatten = function(arr) {
  return [].concat(...arr);
};

export default Component.extend({
  store: service(),

  async save() {
      const walkFormNode = async (node) => {
        const formInputs = await node.get('children');
        const walkedInputs = await Promise.all(formInputs.map(async (input) => {
          const subforms = await input.get('dynamicSubforms');
          const walkedSubformNodes = await Promise.all(subforms.map(async (subform) => {
            const formNode = await subform.get('formNode');
            return walkFormNode(formNode);
          }));
          return [input.get('identifier'), ...flatten(walkedSubformNodes)];
        }));
        return flatten(walkedInputs);
      };

      const walkDisplayedFormNodes = async (node) => {
        const formInputs = await node.get('children');
        const walkedInputs = await Promise.all(formInputs.map(async (input) => {
          const subforms = await input.get('dynamicSubforms');
          const walkedSubformNodes = await Promise.all(subforms.map(async (subform) => {
            // TODO scope value comparison with matchKind (also support uuid/uri)
            const expectedKey = subform.get('key');
            const expectedValue = subform.get('value');
            const currentValue = this.get(`solution.${expectedKey}`);
            if (expectedValue == currentValue) {
              const formNode = await subform.get('formNode');
              return walkDisplayedFormNodes(formNode);
            } else {
              return [];
            }
          }));
          return [input.get('identifier'), ...flatten(walkedSubformNodes)];
        }));
        return flatten(walkedInputs);
      };

      const properties = await walkFormNode(this.get('model'));
      properties.sort((a, b) => a.length < b.length);
      console.log(properties);

      const displayedProperties = await walkDisplayedFormNodes(this.get('model'));
      displayedProperties.sort((a, b) => a.length < b.length);
      console.log(displayedProperties);


      const expandedDisplayedProperties = {};
      displayedProperties.forEach((prop) => {
        const pathSegments = prop.split('.');

        while(pathSegments.length) {
          const key = pathSegments.join('.');
          expandedDisplayedProperties[key] = true;
          pathSegments.pop();
        }
      });

      const nonDisplayedProperties = properties.filter(x => !displayedProperties.includes(x));
      console.log(nonDisplayedProperties);

      nonDisplayedProperties.forEach((prop) => {
        const pathSegments = prop.split('.');

        while(pathSegments.length) {
          const key = pathSegments.join('.');

          if(!expandedDisplayedProperties[key]) {
            try {
              console.log(`Setting prop ${key} to null`);
              this.set(`solution.${key}`, null);
            } catch (e) {
              console.log(`Couldn't set prop ${key}`);
            }
          }
          pathSegments.pop();
        }
      });

      const inputTypeMap = this.get('model.inputTypeMap');

      for(let i = 0; i < displayedProperties.length; i++) {
        const prop = displayedProperties[i];
        const propSegments = prop.split('.');

        const savePath = async (path) => {
          if (path.length == 0)
            return;

          const key = path.join('.');
          const kind = inputTypeMap[key];
          if (kind) {
            console.log(`Saving ${key}`);
            await (await this.get(`solution.${key}`)).save();
          }
          path.pop();
          await savePath(path);
        };

        await savePath(propSegments);
      }
  },

  didReceiveAttrs() {
    this._super(...arguments);
    console.log('no solution yet');
    var formSolution = this.get('store').createRecord('form-solution', {
      formNode: this.get('model')
    });
    this.set('solution', formSolution);
  },

  didInsertElement(){
    this._super(...arguments);
    this.get('onDynamicFormInit')(this);
  }
});
