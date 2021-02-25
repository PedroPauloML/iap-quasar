<template>
  <v-app>
    <Header />

    <v-main class="secondary">
      <v-container id="main-container" class="py-5">
        <transition name="slide-y-transition" mode="out-in">
          <router-view></router-view>
        </transition>

        <transition name="slide-y-reverse-transition" mode="out-in">
          <v-speed-dial v-if="showBackToTop" fixed bottom right>
            <template v-slot:activator>
              <q-btn color="accent" fab @click="backToTop">
                <q-icon>mdi-arrow-up</q-icon>
              </q-btn>
            </template>
          </v-speed-dial>
        </transition>
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
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
          !this.$vuetify.breakpoint.mobile)
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

<style>
#main-container {
  max-width: 1200px !important;
}
</style>
