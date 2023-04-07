import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { Schema } from '@lblod/ember-rdfa-editor';
import {
  block_rdfa,
  doc,
  hard_break,
  horizontal_rule,
  invisible_rdfa,
  paragraph,
  repaired_block,
  text,
} from '@lblod/ember-rdfa-editor/nodes';
import { inline_rdfa } from '@lblod/ember-rdfa-editor/marks';
import {
  em,
  strikethrough,
  strong,
  subscript,
  superscript,
  underline,
} from '@lblod/ember-rdfa-editor/plugins/text-style';
import {
  tableKeymap,
  tableNodes,
  tablePlugin,
} from '@lblod/ember-rdfa-editor/plugins/table';
import { image } from '@lblod/ember-rdfa-editor/plugins/image';
import { link, linkView } from '@lblod/ember-rdfa-editor/plugins/link';
import { blockquote } from '@lblod/ember-rdfa-editor/plugins/blockquote';
import { heading } from '@lblod/ember-rdfa-editor/plugins/heading';
import { code_block } from '@lblod/ember-rdfa-editor/plugins/code';
import {
  bullet_list,
  list_item,
  ordered_list,
} from '@lblod/ember-rdfa-editor/plugins/list';
import { placeholder } from '@lblod/ember-rdfa-editor/plugins/placeholder';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';

export default class RdfFormFieldsRichTextEditorComponent extends SimpleInputFieldComponent {
  @tracked editorController;
  inputId = 'richtext-' + guidFor(this);
  plugins = [tablePlugin, tableKeymap];

  nodeViews = (controller) => {
    return {
      link: linkView(this.linkOptions)(controller),
    };
  };

  schema = new Schema({
    nodes: {
      doc,
      paragraph,

      repaired_block,

      list_item,
      ordered_list,
      bullet_list,
      placeholder,
      ...tableNodes({ tableGroup: 'block', cellContent: 'block+' }),
      heading,
      blockquote,

      horizontal_rule,
      code_block,

      text,

      image,

      hard_break,
      invisible_rdfa,
      block_rdfa,
      link: link(this.linkOptions),
    },
    marks: {
      inline_rdfa,
      em,
      strong,
      underline,
      strikethrough,
      subscript,
      superscript,
    },
  });

  get linkOptions() {
    return {
      interactive: true,
    };
  }

  @action
  handleRdfaEditorInit(editorController) {
    this.editorController = editorController;

    // We only set the value if it contains actual content. This prevents the browser from focusing the editor field due to the content update.
    if (this.value) {
      editorController.setHtmlContent(this.value);
    }
  }

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    //rdfaEditor setup is async, updateValue may be called before it is set
    if (this.editorController) {
      const editorValue = this.editorController.htmlContent;

      // Only trigger an update if the value actually changed.
      // This prevents that the form observer is triggered even though no editor content was changed.
      if (this.value !== editorValue) {
        super.updateValue(editorValue);
      }
    }
  }

  loadProvidedValue() {
    super.loadProvidedValue();

    if (this.value == null) {
      // The editor returns an empty string if it contains no content, so we default to that to make the value comparison check works as expected.
      this.value = '';
    }
  }
}
