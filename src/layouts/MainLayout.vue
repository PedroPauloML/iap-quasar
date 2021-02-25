<template>
  <q-layout view="hHh Lpr lff">
    <Header
      :leftDrawerOpen="leftDrawerOpen"
      @handleLeftDrawerStatus="val => (leftDrawerOpen = val)"
    />
    <Sidebar
      v-if="$q.screen.lt.sm"
      :leftDrawerOpen="leftDrawerOpen"
      @handleLeftDrawerStatus="val => (leftDrawerOpen = val)"
    />

    <q-page-container>
      <div class="q-pa-lg q-pb-xl q-mb-xl bg-secondary">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <router-view />
        </transition>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import Header from "../components/layouts/Header";
import Sidebar from "../components/layouts/Sidebar";

export default {
  name: "MainLayout",
  components: { Header, Sidebar },
  data() {
    return {
      leftDrawerOpen: false
    };
  }
};
</script>
