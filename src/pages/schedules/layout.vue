<template>
  <div id="schedules-layout">
    <Header :back_route="back_route" v-model="filters" :searching="searching" />
    <transition name="slide-y-transition" mode="out-in">
      <router-view
        @clearInputSearch="clearInputSearch"
        @setBackRoute="setBackRoute"
        v-model="filters"
        :searching="searching"
        v-on:searching="(value) => (searching = value)"
      ></router-view>
    </transition>
  </div>
</template>

<script>
import Header from "../../components/schedules/Header";
export default {
  components: { Header },
  data() {
    return {
      back_route: null,
      filters: {
        search: this.$route.query.search,
        date: this.$route.query.date
          ? this.$moment(this.$route.query.date, "YYYY-MM-DD").format()
          : "",
      },
      searching: false,
    };
  },
  methods: {
    setBackRoute(route) {
      this.back_route = route;
    },
    clearInputSearch() {
      this.filters = {
        search: "",
        date: "",
      };
    },
  },
};
</script>

<style></style>
