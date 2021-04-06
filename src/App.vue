<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  created() {
    // if (this.$q.cookies.get("token")) {
    //   const users = require("./data/users.json");
    //   let user = users.find(u => u.token == this.$q.cookies.get("token"));
    //   if (user) this.$store.dispatch("user/setUser", user);
    // }
  }
};
</script>
