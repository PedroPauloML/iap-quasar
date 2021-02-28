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
      <div class="q-pa-lg q-pb-xl bg-secondary">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <router-view />
        </transition>
      </div>
    </q-page-container>

    <Footer />
  </q-layout>
</template>

<script>
import Header from "../components/layouts/Header";
import Sidebar from "../components/layouts/Sidebar";
import Footer from "../components/layouts/Footer";

export default {
  name: "MainLayout",
  components: { Header, Sidebar, Footer },
  data() {
    return {
      leftDrawerOpen: false
    };
  }
};
</script>
