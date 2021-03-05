<template>
  <q-layout view="hHh Lpr lff" class="bg-secondary">
    <Header
      :leftDrawerOpen="leftDrawerOpen"
      @handleLeftDrawerStatus="val => (leftDrawerOpen = val)"
    />
    <Sidebar
      v-if="$q.screen.lt.md"
      :leftDrawerOpen="leftDrawerOpen"
      @handleLeftDrawerStatus="val => (leftDrawerOpen = val)"
    />

    <q-page-container>
      <div class="q-pa-lg q-pb-xl q-mb-xl">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <router-view />
        </transition>

        <transition
          enter-active-class="animated fadeInDown"
          leave-active-class="animated fadeOutUp"
          mode="out-in"
        >
          <q-page-sticky
            v-if="showBackToTop"
            position="bottom-right"
            :offset="[18, 18]"
            class="z-fab"
          >
            <q-btn color="accent" fab @click="backToTop">
              <q-icon name="mdi-arrow-up" />
            </q-btn>
          </q-page-sticky>
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
      leftDrawerOpen: false,

      showBackToTop:
        window.scrollY > 200 &&
        window.scrollY <
          window.document.body.clientHeight - window.innerHeight + 200
    };
  },
  created() {
    window.onscroll = e => this.enableDisableBackToTop(e);
  },
  methods: {
    enableDisableBackToTop(e) {
      if (
        e.currentTarget.scrollY > 200 &&
        (e.currentTarget.scrollY <
          window.document.body.clientHeight - window.innerHeight - 200 ||
          !this.$q.screen.lt.md)
      ) {
        this.showBackToTop = true;
      } else {
        this.showBackToTop = false;
      }
    },
    backToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
};
</script>
