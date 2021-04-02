<template>
  <div v-if="$route.params.email" id="sended-confirmation-email">
    <q-icon
      name="mdi-check-circle-outline"
      color="green-9"
      size="70px"
      class="q-mb-lg"
    />

    <div class="q-mb-xl text-center">
      <h1 class="text-green-9 text-h4 text-weight-bold q-ma-none">
        Um e-mail de confirmação foi enviado para o seu endereço de e-mail!
      </h1>

      <p class="text-h6 text-weight-bold">
        Acesse o link enviado para a sua caixa de e-mail (<span
          class="text-weight-regular"
          >{{ $route.params.email }}</span
        >) para confirmar a sua conta
      </p>
    </div>

    <router-link :to="{ name: 'home' }" v-slot="{ href }">
      <q-btn :to="href" color="primary">
        Voltar para a página inicial
      </q-btn>
    </router-link>
  </div>
</template>

<script>
export default {
  mounted() {
    if (!this.$route.params.email) {
      this.$router.replace({ name: "404" });
    }
  }
};
</script>

<style lang="scss" scoped>
#sended-confirmation-email {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
