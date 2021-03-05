<template>
  <q-drawer
    :value="leftDrawerOpen"
    @input="val => $emit('handleLeftDrawerStatus', val)"
    bordered
    content-class="flex content-between"
  >
    <q-list class="full-width">
      <q-item class="q-pt-md">
        <q-item-section avatar>
          <q-avatar>
            <q-img :src="logoSRC" width="50px" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <p class="text-h6 q-ma-none text-primary text-no-wrap">
            IAP
          </p>
          <p
            class="text-caption text-primary q-ma-none"
            style="margin-top: -8px"
          >
            Paulo Afonso
          </p>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <router-link
        v-for="(route, index) in routes"
        :key="index"
        :to="{ name: route.path_name }"
        v-slot="{ href }"
      >
        <q-item
          :to="href"
          :exact="route.path_name == 'home'"
          active-class="bg-primary-lighten-2 text-white"
          class="text-weight-bold"
        >
          <q-item-section>{{ route.title }}</q-item-section>
        </q-item>
      </router-link>
    </q-list>

    <div class="full-width q-py-md bg-primary-lighten-2 text-center text-white">
      <p class="q-mb-none">
        Igreja Adventista da Promessa
      </p>
      <p class="q-mb-none text-weight-bold">
        Paulo Afonso
      </p>
    </div>
  </q-drawer>
</template>

<script>
import logoSRC from "assets/imgs/logo.svg";

export default {
  name: "Sidebar",
  props: {
    leftDrawerOpen: {
      type: Boolean
    }
  },
  data() {
    return {
      logoSRC,

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
      ]
    };
  }
};
</script>

<style></style>
