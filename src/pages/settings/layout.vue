<template>
  <div id="schedules-layout" class="container">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-3">
        <q-list separator class="settings-list">
          <q-item-label header class="text-weight-medium text-black"
            >Configurações da conta</q-item-label
          >

          <q-separator />

          <q-item
            v-for="(link, index) in links"
            :key="index"
            :clickable="link.route.name != $route.name"
            :v-ripple="link.route.name != $route.name"
            :to="link.route.name != $route.name ? link.route : null"
            :active="link.route.name == $route.name"
            active-class="actived-item"
          >
            <q-item-section>
              <q-item-label>{{ link.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-12 col-sm-9">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [{ label: "Perfil", route: { name: "settings_profile" } }]
    };
  }
};
</script>

<style lang="scss">
.settings-list {
  background-color: #fff;
  border: 1px solid #bbb;
  border-radius: 3px;

  .actived-item {
    border-left: 3px solid $primary;
    font-weight: 500;
  }
}

.settings-content {
  background-color: #fff;
  border: 1px solid #bbb;
  border-radius: 3px;
  padding: 15px;
}
</style>
