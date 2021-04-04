<template>
  <div id="password-recover-request" class="centered">
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
                  label="E-mail"
                  ref="email"
                  v-model="email"
                  :rules="emailRules"
                  class="q-mb-md"
                  autocomplete="new-email"
                ></q-input>

                <q-btn
                  color="primary"
                  type="submit"
                  :loading="resendingConfirmationEmail"
                  class="btn-text-wrap"
                >
                  Enviar solicitação de recuperação de senha
                </q-btn>
              </q-form>
            </q-card-section>
          </q-card>

          <router-link :to="{ name: 'home' }" v-slot="{ href }">
            <q-btn
              :to="href"
              flat
              text-color="primary"
              :disable="resendingConfirmationEmail"
            >
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
import AuthenticationRequest from "src/services/requests/authentication";

export default {
  data() {
    return {
      sendPasswordRecoverRequestValid: true,
      passwordRecoverRequestError: "",
      resendingConfirmationEmail: false,
      requestPasswordRecoverSended: false,
      email: "",
      emailRules: [
        v => !!v || "E-mail é obrigatório",
        v => /.+@.+\..+/.test(v) || "E-mail precisa ser válido",
        () =>
          !this.passwordRecoverRequestError || this.passwordRecoverRequestError
      ]
    };
  },
  watch: {
    email() {
      if (!!this.passwordRecoverRequestError)
        this.passwordRecoverRequestError = "";
    }
  },
  methods: {
    sendPasswordRecoverRequest() {
      this.$refs.form.validate(false).then(valid => {
        if (valid) {
          this.passwordRecoverRequestError = "";
          this.resendingConfirmationEmail = true;

          AuthenticationRequest.request_password_recover(this.email)
            .then(res => {
              if (res) {
                this.passwordRecoverRequestError = "";
                this.requestPasswordRecoverSended = true;
              }
            })
            .catch(err => {
              if (err) {
                this.passwordRecoverRequestError =
                  err.response.data.error.message;
                this.$refs.email.validate();
                this.resendingConfirmationEmail = false;
              }
            });
        }
      });
    }
  }
};
</script>

<style lang="scss">
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
