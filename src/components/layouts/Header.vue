<template>
  <q-header elevated class="bg-white text-dark" reveal :reveal-offset="10">
    <q-toolbar id="toolbar" class="q-py-sm q-px-md">
      <q-btn
        v-if="$q.screen.lt.sm"
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        class="q-mr-lg"
        @click="$emit('handleLeftDrawerStatus', !leftDrawerOpen)"
      />

      <div class="col col-sm-auto flex">
        <q-img
          v-if="$q.screen.gt.xs"
          :src="logoSRC"
          width="45px"
          class="q-mr-sm"
        />

        <div>
          <p class="text-primary text-weight-bold text-h6 q-mb-none">
            IAP
          </p>
          <p
            class="text-primary text-weight-regular text-subtitle2 q-mb-none"
            style="margin-top: -10px;"
          >
            Paulo Afonso
          </p>
        </div>
      </div>

      <div v-if="$q.screen.gt.sm" class="col no-wrap flex justify-center">
        <router-link
          v-for="(route, index) in routes"
          :key="index"
          :to="{ name: route.path_name }"
          v-slot="{ href, isActive, isExactActive }"
        >
          <q-btn
            :to="href"
            :class="{
              'text-primary':
                route.path_name == 'home' ? isExactActive : isActive
            }"
            height="100%"
            flat
            link
          >
            {{ route.title }}
          </q-btn>
        </router-link>
      </div>

      <div v-if="userSigned" class="col-auto no-wrap">
        <q-btn round flat color="grey-7">
          <q-icon name="notifications_none" />
        </q-btn>

        <q-btn round flat color="grey-7">
          <q-icon name="o_settings" />
        </q-btn>

        <q-btn round flat color="grey-7">
          <q-icon name="o_account_circle" />

          <q-menu
            v-model="profileMenu"
            offset-y
            min-width="200"
            max-width="300"
          >
            <q-list dense>
              <q-item>
                <q-item-section avatar class="q-py-sm">
                  <q-avatar>
                    <q-img src="https://picsum.photos/id/1012/100/100">
                      <template v-slot:placeholder>
                        <q-row
                          class="full-height ma-0 secondary darken-1"
                          align="center"
                          justify="center"
                        >
                          <q-progress-circular
                            indeterminate
                            color="primary"
                          ></q-progress-circular>
                        </q-row>
                      </template>
                    </q-img>
                  </q-avatar>
                </q-item-section>

                <q-item-section class="q-py-sm">
                  <p class="text-h6 q-ma-none text-no-wrap">
                    {{ $store.state.user.user.profile.name }}
                  </p>
                  <p
                    class="text-caption text-grey-7 q-ma-none"
                    style="margin-top: -8px"
                  >
                    {{ $store.state.user.user.email }}
                  </p>
                </q-item-section>
              </q-item>

              <q-separator></q-separator>

              <q-item clickable @click="signOut">
                <q-item-section avatar class="q-py-sm">
                  <q-icon name="logout" />
                </q-item-section>

                <q-item-section class="q-py-sm">
                  Sair
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <Authentication v-else class="col-auto" />
    </q-toolbar>
  </q-header>
</template>

<script>
import Authentication from "./Authentication";

import logoSRC from "assets/imgs/logo.svg";

export default {
  name: "Header",
  props: {
    leftDrawerOpen: {
      type: Boolean
    }
  },
  components: { Authentication },
  data() {
    return {
      drawer: false,
      routes: [
        {
          path_name: "home",
          title: "Início"
        },
        {
          path_name: "news",
          title: "Notícias"
        },
        {
          path_name: "verses_of_day",
          title: "Versículos do dia"
        },
        {
          path_name: "messages",
          title: "Mensagens"
        },
        {
          path_name: "schedules",
          title: "Agenda"
        },
        {
          path_name: "contact",
          title: "Contato"
        }
      ],
      profileMenu: false,
      logoSRC
    };
  },
  // created() {
  //   this.loadUser();
  // },
  methods: {
    signOut() {
      this.$q.cookies.remove("token");
      this.$store.dispatch("user/setUser", {});
      // location.reload();
    }
  }
};
</script>

<style lang="scss">
#toolbar {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
