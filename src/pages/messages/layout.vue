<template>
  <div id="messages-layout" class="container">
    <Header :back_route="back_route" v-model="filters" :searching="searching" />

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >
      <router-view
        @resetFilters="resetFilters"
        @setBackRoute="setBackRoute"
        :filters="filters"
        :searching="searching"
        v-on:searching="value => (searching = value)"
      ></router-view>
    </transition>
  </div>
</template>

<script>
import Header from "../../components/messages/Header";
export default {
  components: { Header },
  data() {
    return {
      back_route: null,
      filters: {
        query: this.$route.query.query,
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
    resetFilters() {
      this.filters = {
        query: "",
        date: ""
      };
    }
  }
};
</script>

<style></style>
