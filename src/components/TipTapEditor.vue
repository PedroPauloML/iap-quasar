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
      console.log("TipTapEditor value changed");
      if (!this.editable) {
        console.log("Changing QuasarTiptap value");
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
      this.$emit("input", getHTML());
    }
  }
};
</script>

<style lang="scss">
.tiptap-editor:not(.readonly) {
  border: 1px solid #eee;

  .editor__content {
    overflow: auto;
    max-height: var(--custom-max-size);
  }

  .menubar {
    flex-wrap: nowrap;
    overflow: auto;
  }
}
</style>
