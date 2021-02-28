<template>
  <div id="password-recover-request">
    <transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
      mode="out-in"
    >
      <div v-if="!requestPasswordRecoverSended" key="1" class="centered">
        <q-icon class="primary--text mb-5" size="70">
          mdi-lock-alert
        </q-icon>

        <div class="mb-10 text-center">
          <h1 class="primary--text">
            Recuperação de senha
          </h1>

          <h3>
            Você esqueceu a sua senha? Informe o seu e-mail abaixo para podermos
            lhe ajudar.
          </h3>

          <q-card class="password-recover-request-container">
            <q-card-text>
              <v-form
                ref="form"
                v-model="sendPasswordRecoverRequestValid"
                lazy-validation
                @submit="
                  e => {
                    e.preventDefault();
                    e.stopPropagation();
                    sendPasswordRecoverRequest();
                  }
                "
              >
                <p>
                  Insira o e-mail cadastrado na conta do seu usuário para
                  enviarmos o e-mail de recuperação de senha.
                </p>

                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  @keyup.enter="sendPasswordRecoverRequest"
                  class="mb-3"
                  autocomplete="new-email"
                ></v-text-field>

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
              </v-form>
            </q-card-text>
          </q-card>

          <router-link :to="{ name: 'home' }" v-slot="{ href }">
            <q-btn :to="href" color="light" type="button">
              Voltar para a página inicial
            </q-btn>
          </router-link>
        </div>
      </div>

      <div v-else key="2" class="centered">
        <q-icon class="green--text text--darken-3 mb-5" size="70">
          mdi-check-circle-outline
        </q-icon>

        <div class="mb-10 text-center">
          <h1 class="green--text text--darken-3">
            Solicitação de recuperação de senha enviada!
          </h1>

          <h3>
            Acesse o link enviado para a sua caixa de e-mail para recuperar a
            sua senha.
          </h3>
        </div>

        <router-link :to="{ name: 'home' }" v-slot="{ href }">
          <q-btn :to="href" color="primary" type="button">
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
