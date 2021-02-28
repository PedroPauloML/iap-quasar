<template>
  <q-footer class="bg-primary-lighten-1">
    <div class="row">
      <div class="col-12 flex justify-center">
        <router-link
          v-for="(route, index) in routes"
          :key="index"
          :to="{ name: route.path_name }"
          v-slot="{ href, isActive, isExactActive }"
        >
          <q-btn
            :to="href"
            color="white"
            flat
            rounded
            link
            :class="{
              'q-my-sm': true,
              'text-primary': isExactActive,
              'bg-primary-lighten-2': isExactActive
            }"
          >
            {{ route.title }}
          </q-btn>
        </router-link>
      </div>

      <div class="col-12 q-py-md bg-primary-lighten-2 text-center text-white">
        Igreja Adventista da Promessa — <strong>Paulo Afonso</strong>
      </div>
    </div>
  </q-footer>
</template>

<script>
import { colors } from "quasar";
const { lighten } = colors;

export default {
  data() {
    return {
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

<style lang="scss">
$primary-lighten-1: lighten($primary, 5%);
$primary-lighten-2: lighten($primary, 10%);

.bg-primary-lighten-1 {
  background-color: $primary-lighten-1;
}
.bg-primary-lighten-2 {
  background-color: $primary-lighten-2;
}
</style>
