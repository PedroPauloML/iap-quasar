<template>
  <q-drawer
    :value="leftDrawerOpen"
    @input="val => $emit('handleLeftDrawerStatus', val)"
    bordered
    content-class="bg-gradient-primary-accent"
  >
  </q-drawer>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    leftDrawerOpen: {
      type: Boolean
    }
  }
};
</script>

<style></style>
