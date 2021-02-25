<template>
  <Editor
    api-key="l4rkxarmxtzrjz7dcgrafbar7pz0nanf9cks59fii2v8ytyn"
    :value="value"
    @input="changeValue"
    :init="{
      height: 500,
      content_css: '/tinymce/styles/custom.css',
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount',
      ],
      toolbar: [
        {
          name: 'history',
          items: ['undo', 'redo'],
        },
        {
          name: 'styles',
          items: ['fontsizeselect', 'formatselect', 'forecolor'],
        },
        {
          name: 'formatting',
          items: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'blockquote',
            'removeformat',
          ],
        },
        {
          name: 'alignment',
          items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify'],
        },
        {
          name: 'indentation',
          items: ['bullist', 'numlist', 'outdent', 'indent'],
        },
        {
          name: 'plugins',
          items: ['emoticons', 'link', 'paste', 'image', 'media', 'fullscreen'],
        },
      ],
      formats: {
        bold: { inline: 'span', styles: { fontWeight: 'bold' } },
        italic: { inline: 'span', styles: { fontStyle: 'italic' } },
        strikethrough: {
          inline: 'span',
          styles: { 'text-decoration': 'line-through' },
        },
        underline: {
          inline: 'span',
          styles: { 'text-decoration': 'underline' },
        },
      },
      default_link_target: '_blank',
      language_url: '/tinymce/langs/pt_BR.js',
      language: 'pt_BR',
    }"
  />
</template>

<script>
import Editor from "@tinymce/tinymce-vue";

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  components: { Editor },
  methods: {
    changeValue(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style></style>
