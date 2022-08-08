import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { restartableTask } from 'ember-concurrency';
import { timeout } from 'node_modules/ember-concurrency/addon/index';

export default class RdfFormFieldsRichTextEditorComponent extends SimpleInputFieldComponent {
  editorController;
  inputId = 'richtext-' + guidFor(this);

  get editorOptions() {
    return {
      showToggleRdfaAnnotations: false,
      showInsertButton: false,
      showRdfa: false,
      showRdfaHighlight: false,
      showRdfaHover: false,
      showPaper: false,
      showSidebar: false,
    };
  }

  get toolbarOptions() {
    return {
      showTextStyleButtons: true,
      showListButtons: true,
      showIndentButtons: true,
    };
  }

  @action
  handleRdfaEditorInit(editorController) {
    this.editorController = editorController;

    if (this.value) {
      console.log('value', this.value);
      editorController.setHtmlContent(this.value);
    }

    // We attach the event handler _after_ setting the initial value
    // so the setting doesn't trigger the event itself.
    editorController.onEvent('contentChanged', () => {
      console.log('contentChanged', this.inputId);
      this.handleContentChanged.perform();
    });
  }

  @restartableTask
  *handleContentChanged() {
    yield timeout(300);

    this.updateValue();
  }

  @action
  updateValue() {
    //rdfaEditor setup is async, updateValue may be called before it is set
    if (this.editorController) {
      const editorValue = this.editorController.htmlContent;

      if (editorValue !== this.value) {
        super.updateValue(editorValue);
      }
    }
  }
}
