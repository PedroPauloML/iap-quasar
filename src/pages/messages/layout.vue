<template>
  <div id="messages-layout" class="container">
    <Header :back_route="back_route" v-model="filters" :searching="searching" />

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >
      <router-view
        @filterByTag="filterByTag"
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
        query: this.$route.params.query,
        date: this.$route.params.date
          ? this.$moment(this.$route.params.date, "YYYY-MM-DD").format()
          : ""
      },
      searching: false
    };
  },
  methods: {
    setBackRoute(route) {
      this.back_route = route;
    },
    filterByTag(tag) {
      this.filters.query = tag;
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
