<template>
  <QuasarTiptap
    v-bind="options"
    @update="onUpdate"
    :class="{ readonly: readonly }"
  />
</template>

<script>
import { QuasarTiptap, RecommendedExtensions } from "quasar-tiptap";
import "quasar-tiptap/lib/index.css";

export default {
  props: {
    value: String,
    readonly: Boolean
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
  methods: {
    onUpdate({ getJSON, getHTML }) {
      this.$emit("input", getHTML());
    }
  }
};
</script>

<style lang="scss">
.tiptap-editor:not(.readonly) {
  border: 1px solid #eee;

  .editor__content {
    max-height: 60vh;
    overflow: auto;
  }
}
</style>
