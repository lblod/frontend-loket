import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { Schema } from '@lblod/ember-rdfa-editor';
import {
  blockquote,
  bullet_list,
  doc,
  hard_break,
  heading,
  horizontal_rule,
  image,
  list_item,
  ordered_list,
  paragraph,
  repaired_block,
  text,
} from '@lblod/ember-rdfa-editor/nodes';
import {
  em,
  link,
  strikethrough,
  strong,
  underline,
} from '@lblod/ember-rdfa-editor/marks';
import {
  tableKeymap,
  tableMenu,
  tableNodes,
  tablePlugin,
} from '@lblod/ember-rdfa-editor/plugins/table';
import { headingsMenu } from '@lblod/ember-rdfa-editor/plugins/headings';
import { subscript } from '@lblod/ember-rdfa-editor/plugins/subscript';
import { superscript } from '@lblod/ember-rdfa-editor/plugins/superscript';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';

export default class RdfFormFieldsRichTextEditorComponent extends SimpleInputFieldComponent {
  editor;
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

  get schema() {
    return new Schema({
      nodes: {
        doc,
        paragraph,
        repaired_block,
        list_item,
        ordered_list,
        bullet_list,
        ...tableNodes({ tableGroup: 'block', cellContent: 'block+' }),
        heading,
        blockquote,
        horizontal_rule,
        text,
        image,
        hard_break,
      },
      marks: {
        link,
        em,
        strong,
        underline,
        strikethrough,
        subscript,
        superscript,
      },
    });
  }

  get widgets() {
    return [headingsMenu, tableMenu];
  }

  get plugins() {
    return [tablePlugin, tableKeymap];
  }

  @action
  handleRdfaEditorInit(editor) {
    this.editor = editor;

    // We only set the value if it contains actual content. This prevents the browser from focusing the editor field due to the content update.
    if (this.value) {
      editor.setHtmlContent(this.value);
    }
  }

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    //rdfaEditor setup is async, updateValue may be called before it is set
    if (this.editor) {
      const editorValue = this.editor.htmlContent;

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
