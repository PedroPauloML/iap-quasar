<template>
  <div id="verses-of-day-layout" class="container">
    <Header :back_route="back_route" v-model="filters" :searching="searching" />
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >
      <router-view
        @clearInputSearch="clearInputSearch"
        @setBackRoute="setBackRoute"
        v-model="filters"
        :searching="searching"
        v-on:searching="value => (searching = value)"
      ></router-view>
    </transition>
  </div>
</template>

<script>
import Header from "../../components/verse_of_day/Header";
export default {
  components: { Header },
  data() {
    return {
      back_route: null,
      filters: {
        search: this.$route.query.search,
        date: this.$route.query.date
          ? this.$moment(this.$route.query.date, "YYYY-MM-DD").format()
          : ""
      },
      searching: false
    };
  },
  methods: {
    setBackRoute(route) {
      this.back_route = route;
    },
    clearInputSearch() {
      this.filters = {
        search: "",
        date: ""
      };
    }
  }
};
</script>

<style></style>
