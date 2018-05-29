import Component from '@ember/component';
import { inject as service } from '@ember/service';
import isDynamicSubformValueMatch from '../../utils/toezicht/is-dynamic-subform-value-match';

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
            const key = subform.get('key');
            const currentValue = this.get(`solution.${key}`);
            if (isDynamicSubformValueMatch(subform, key, currentValue)) {
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

    await this.saveHasMany(inputTypeMap, displayedProperties);

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

    await this.get('solution').save();
    return this.get('solution');
  },

  isHasManyType(kind){
    return kind.endsWith('[]');
  },

  async saveHasMany(inputTypeMap, properties){
    //TODO: this is not going to work for nested hasMany relations (we need a generic solution)
    let hasManyProperties = properties.filter(prop => this.isHasManyType(inputTypeMap[prop] || ""));
    await Promise.all(hasManyProperties.map(async (prop)=> {
      let objects = await this.get(`solution.${prop}`);
      await Promise.all(objects.map(o => o.save()));
    }));
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('model', this.get('solution.formNode'));
  },

  didInsertElement(){
    this._super(...arguments);
    this.get('onDynamicFormInit')(this);
  }
});
