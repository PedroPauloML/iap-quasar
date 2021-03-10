<template>
  <div id="password-recover-request">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >
      <div v-if="!requestPasswordRecoverSended" key="1" class="centered">
        <q-icon
          name="mdi-lock-alert"
          color="primary"
          size="70px"
          class="q-mb-lg"
        />

        <div class="mb-10 text-center">
          <h1 class="text-primary text-h4 text-weight-bold q-ma-none">
            Recuperação de senha
          </h1>

          <p class="text-h6 text-weight-bold">
            Você esqueceu a sua senha? Informe o seu e-mail abaixo para podermos
            lhe ajudar.
          </p>

          <q-card class="password-recover-request-container">
            <q-card-section>
              <q-form
                ref="form"
                @submit="sendPasswordRecoverRequest"
                lazy-validation
              >
                <p>
                  Insira o e-mail cadastrado na conta do seu usuário para
                  enviarmos o e-mail de recuperação de senha.
                </p>

                <q-input
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  @keyup.enter="sendPasswordRecoverRequest"
                  class="q-mb-md"
                  autocomplete="new-email"
                ></q-input>

                <q-btn
                  color="primary"
                  type="submit"
                  @click="sendPasswordRecoverRequest"
                  :disabled="!sendPasswordRecoverRequest"
                  :loading="resendingConfirmationEmail"
                  class="btn-text-wrap"
                >
                  Enviar solicitação de recuperação de senha
                </q-btn>
              </q-form>
            </q-card-section>
          </q-card>

          <router-link :to="{ name: 'home' }" v-slot="{ href }">
            <q-btn :to="href" flat text-color="primary">
              Voltar para a página inicial
            </q-btn>
          </router-link>
        </div>
      </div>

      <div v-else key="2" class="centered">
        <q-icon
          name="mdi-check-circle-outline"
          color="green-8"
          size="70px"
          class="q-mb-lg"
        />

        <div class="q-mb-xl text-center">
          <h1 class="text-h4 text-weight-bold text-green-8 q-ma-none">
            Solicitação de recuperação de senha enviada!
          </h1>

          <p class="text-h6 text-weight-bold">
            Acesse o link enviado para a sua caixa de e-mail para recuperar a
            sua senha.
          </p>
        </div>

        <router-link :to="{ name: 'home' }" v-slot="{ href }">
          <q-btn :to="href" color="primary">
            Voltar para a página inicial
          </q-btn>
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sendPasswordRecoverRequestValid: true,
      sendPasswordRecoverRequestError: "",
      resendingConfirmationEmail: false,
      requestPasswordRecoverSended: false,
      email: "",
      emailRules: [
        v => !!v || "E-mail é obrigatório",
        v => /.+@.+\..+/.test(v) || "E-mail precisa ser válido",
        () =>
          !this.sendPasswordRecoverRequestError ||
          this.sendPasswordRecoverRequestError
      ]
    };
  },
  methods: {
    sendPasswordRecoverRequest() {
      this.sendPasswordRecoverRequestError = "";

      if (this.$refs.form.validate()) {
        const users = require("../../data/users.json");

        this.resendingConfirmationEmail = true;

        setTimeout(() => {
          let user = users.find(u => u.email == this.email);

          if (user) {
            this.sendPasswordRecoverRequestError = "";
            this.requestPasswordRecoverSended = true;
          } else {
            this.sendPasswordRecoverRequestError =
              "Não foi encontrado nenhum usuáro com esse e-mail. " +
              "Verifique se o e-mail informado está correto.";
            this.$refs.form.validate();
          }

          this.resendingConfirmationEmail = false;
        }, 1000);
      }
    }
  }
};
</script>

<style lang="scss">
#password-recover-request,
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.password-recover-request-container {
  max-width: 600px;
  padding: 12px;
  margin: 20px auto;
}

.btn-text-wrap span.q-btn__content {
  white-space: normal;
  flex: 1;
}
</style>
