<template>
  <div id="confirm-account">
    <transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
      mode="out-in"
    >
      <div v-if="checkingTokenValidity" key="1">
        <q-linear-progress indeterminate class="q-mb-lg" />

        <p class="text-h6 text-weight-bold">
          Estamos lhe procurando. Aguarde um momento!
        </p>
      </div>

      <div
        v-else-if="!checkingTokenValidity && validToken"
        key="2"
        class="confirmed-account centered"
      >
        <q-icon
          name="mdi-check-circle-outline"
          color="green-9"
          size="70px"
          class="q-mb-lg"
        />

        <div class="q-mb-xl text-center">
          <h1 class="text-green-9 text-h4 text-weight-bold q-ma-none">
            Sua conta foi confirmada!
          </h1>

          <p class="text-h6 text-weight-bold">
            A partir de agora você poderá acessar sua conta no IAP Paulo Afonso.
            Aproveite!
          </p>

          <p class="text-h6 text-weight-bold">
            Para iniciar faça login na página incial.
          </p>
        </div>

        <router-link :to="{ name: 'home' }" v-slot="{ href }">
          <q-btn :to="href" color="primary" type="button">
            Voltar para a página inicial
          </q-btn>
        </router-link>
      </div>

      <div
        v-else-if="!checkingTokenValidity && !validToken"
        key="3"
        class="not-confirmed-account"
      >
        <transition
          enter-active-class="animated fadeInDown"
          leave-active-class="animated fadeOutUp"
          mode="out-in"
        >
          <div v-if="!emailResended" key="3.1" class="centered">
            <q-icon
              name="mdi-alert-outline"
              color="yellow-9"
              size="70px"
              class="q-mb-lg"
            >
            </q-icon>

            <div class="q-mb-xl text-center">
              <h1 class="text-yellow-9 text-h4 text-weight-bold q-ma-none">
                Ops... Não identificamos sua conta!
              </h1>

              <p class="text-h6 text-weight-bold">
                Não conseguimos identificar a sua conta dentre os nossos
                usuários. Gostaria de enviar o e-mail de confirmação de conta
                novamente?
              </p>

              <q-card class="resend-confirmation-email-container">
                <q-card-section>
                  <q-form
                    ref="form"
                    @submit="resendConfirmationEmail"
                    lazy-validation
                  >
                    <p>
                      Insira o e-mail cadastrado na conta do seu usuário para
                      re-enviarmos o e-mail de confirmação.
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
                      :disabled="!resendConfirmationEmailValid"
                      :loading="resendingConfirmationEmail"
                    >
                      Re-enviar e-mail de confirmação
                    </q-btn>
                  </q-form>
                </q-card-section>
              </q-card>

              <router-link :to="{ name: 'home' }" v-slot="{ href }">
                <q-btn
                  :to="href"
                  flat
                  color="primary"
                  :loading="resendingConfirmationEmail"
                >
                  Voltar para a página inicial
                </q-btn>
              </router-link>
            </div>
          </div>

          <div v-else key="3.2" class="centered">
            <q-icon
              name="mdi-check-circle-outline"
              color="green-9"
              size="70px"
              class="q-mb-lg"
            />

            <div class="q-mb-xl text-center">
              <h1 class="text-green-9 text-h4 text-weight-bold q-ma-none">
                E-mail de confirmação re-enviado!
              </h1>

              <p class="text-h6 text-weight-bold">
                Acesse o link enviado para a sua caixa de e-mail para confirmar
                a sua conta.
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
    </transition>
  </div>
</template>

<script>
import AuthenticationRequest from "src/services/requests/authentication";

export default {
  data() {
    return {
      // Page status
      checkingTokenValidity: true,
      validToken: false,

      // Resend confirmation e-mail
      resendConfirmationEmailValid: true,
      resendConfirmationEmailError: "",
      resendingConfirmationEmail: false,
      emailResended: false,
      email: "",
      emailRules: [
        v => !!v || "E-mail é obrigatório",
        v => /.+@.+\..+/.test(v) || "E-mail precisa ser válido",
        () =>
          !this.resendConfirmationEmailError ||
          this.resendConfirmationEmailError
      ]
    };
  },
  created() {
    let token = this.$route.query.token;

    AuthenticationRequest.confirm_email(token)
      .then(res => {
        if (res) {
          this.validToken = true;
          this.checkingTokenValidity = false;
        }
      })
      .catch(err => {
        if (err) {
          this.validToken = false;
          this.checkingTokenValidity = false;
        }
      });
  },
  methods: {
    resendConfirmationEmail() {
      this.$refs.form.validate(false).then(valid => {
        if (valid) {
          this.resendConfirmationEmailError = "";
          this.resendingConfirmationEmail = true;

          AuthenticationRequest.resend_confirmation_mail(this.email)
            .then(res => {
              if (res) {
                this.emailResended = true;
                this.resendingConfirmationEmail = false;
              }
            })
            .catch(err => {
              if (err) {
                this.resendConfirmationEmailError =
                  err.response.data.error.message;
                this.resendingConfirmationEmail = false;
                this.$refs.email.validate();
              }
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#confirm-account,
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.resend-confirmation-email-container {
  max-width: 600px;
  padding: 12px;
  margin: 20px auto;
}
</style>
