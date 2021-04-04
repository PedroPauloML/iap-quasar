<template>
  <div class="centered">
    <q-icon name="mail_outline" color="primary" size="70px" class="q-mb-lg">
    </q-icon>

    <div class="q-mb-xl text-center">
      <h1 class="text-primary text-h4 text-weight-bold q-mt-none">
        Re-enviar e-mail de confirmação de conta
      </h1>

      <q-card class="resend-confirmation-email-container">
        <q-card-section>
          <q-form ref="form" @submit="resendConfirmationEmail" lazy-validation>
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
          :disable="resendingConfirmationEmail"
          class="q-mt-lg"
        >
          Voltar para a página inicial
        </q-btn>
      </router-link>
    </div>
  </div>
</template>

<script>
import AuthenticationRequest from "src/services/requests/authentication";

export default {
  data() {
    return {
      resendConfirmationEmailError: "",
      resendingConfirmationEmail: false,
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
  watch: {
    email() {
      if (!!this.resendConfirmationEmailError)
        this.resendConfirmationEmailError = "";
    }
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

<style></style>
