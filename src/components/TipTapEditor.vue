<template>
  <QuasarTiptap
    v-bind="options"
    @update="onUpdate"
    :class="{ readonly: readonly }"
    :style="customMaxSize"
  />
</template>

<script>
import { QuasarTiptap, RecommendedExtensions } from "quasar-tiptap";
import "quasar-tiptap/lib/index.css";

export default {
  name: "TipTapEditor",
  props: {
    value: { type: String, required: true },
    readonly: Boolean,
    maxSize: String
  },
  components: {
    QuasarTiptap
  },
  data() {
    return {
      options: {
        content: this.value,
        editable: !this.readonly,
        showToolbar: !this.readonly,
        showBubble: false,
        extensions: [...RecommendedExtensions.filter(ext => ext != "ODoc")],
        toolbar: []
      },
      json: "",
      html: ""
    };
  },
  watch: {
    value(newValue) {
      if (!this.editable) {
        this.options.value = newValue;
      }
    }
  },
  computed: {
    customMaxSize() {
      return {
        "--custom-max-size": this.maxSize || "60vh"
      };
    }
  },
  methods: {
    onUpdate({ getJSON, getHTML }) {
      let htmlToPlainText = getHTML();
      htmlToPlainText = htmlToPlainText.replace(
        /<style([\s\S]*?)<\/style>/gi,
        ""
      );
      htmlToPlainText = htmlToPlainText.replace(
        /<script([\s\S]*?)<\/script>/gi,
        ""
      );
      htmlToPlainText = htmlToPlainText.replace(/<\/div>/gi, "\n");
      htmlToPlainText = htmlToPlainText.replace(/<\/li>/gi, "\n");
      htmlToPlainText = htmlToPlainText.replace(/<li>/gi, "  *  ");
      htmlToPlainText = htmlToPlainText.replace(/<\/ul>/gi, "\n");
      htmlToPlainText = htmlToPlainText.replace(/<\/p>/gi, "\n");
      htmlToPlainText = htmlToPlainText.replace(/<br\s*[\/]?>/gi, "\n");
      htmlToPlainText = htmlToPlainText.replace(/<[^>]+>/gi, "");
      this.$emit("input", { plainText: htmlToPlainText, html: getHTML() });
    }
  }
};
</script>

<style lang="scss">
.tiptap-editor {
  .editor__content {
    overflow: hidden;
    max-height: var(--custom-max-size);
  }

  &:not(.readonly) {
    border: 1px solid #eee;

    .editor__content {
      overflow: auto;
    }

    .menubar {
      flex-wrap: nowrap;
      overflow: auto;
    }
  }
}
</style>
