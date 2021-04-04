<template>
  <div id="recover-password" class="centered">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >
      <div v-if="checkingTokenValidity" key="1">
        <q-linear-progress indeterminate class="q-mb-lg" />

        <p class="text-h6 text-weight-bold">
          Estamos lhe procurando. Aguarde um momento!
        </p>
      </div>

      <div v-else-if="!checkingTokenValidity && validToken">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <div v-if="!recoveredPassword" key="2.1" class="centered">
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
                Você solicitou a recuperação de sua senha. Insira a nova senha
                abaixo para atualizá-la.
              </p>

              <q-card class="recover-password-container">
                <q-card-section>
                  <p
                    v-if="recoverPasswordError"
                    class="text-red text-body2 text-center q-mb-none"
                  >
                    {{ recoverPasswordError }}
                  </p>

                  <q-form ref="form" @submit="recoverPassword" lazy-validation>
                    <q-input
                      label="Senha"
                      v-model="password"
                      :rules="passwordRules"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          class="cursor-pointer"
                          @click="showPassword = !showPassword"
                        />
                      </template>
                    </q-input>

                    <q-input
                      label="Confirmação de senha"
                      v-model="passwordConfirmation"
                      :rules="passwordConfirmationRules"
                      :type="showPasswordConfirmation ? 'text' : 'password'"
                      autocomplete="new-password-confirmation"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="
                            showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'
                          "
                          class="cursor-pointer"
                          @click="
                            showPasswordConfirmation = !showPasswordConfirmation
                          "
                        />
                      </template>
                    </q-input>

                    <q-btn
                      color="primary"
                      type="submit"
                      :loading="resendingConfirmationEmail"
                      class="q-mt-md"
                    >
                      Atualizar senha
                    </q-btn>
                  </q-form>
                </q-card-section>
              </q-card>

              <router-link :to="{ name: 'home' }" v-slot="{ href }">
                <q-btn :to="href" flat color="primary">
                  Voltar para a página inicial
                </q-btn>
              </router-link>
            </div>
          </div>

          <div v-else key="2.2" class="centered">
            <q-icon
              name="mdi-check-circle-outline"
              color="green-9"
              size="70px"
              class="q-mb-lg"
            />

            <div class="q-mb-xl text-center">
              <h1 class="text-h4 text-weight-bold text-green-8 q-ma-none">
                Senha alterada com sucesso!
              </h1>

              <p class="text-h6 text-weight-bold">
                A partir de agora você conseguirá acessar sua conta com a nova
                senha definida.
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

      <div
        v-else-if="!checkingTokenValidity && !validToken"
        key="3"
        class="centered"
      >
        <q-icon
          name="mdi-alert-outline"
          color="yellow-10"
          size="70px"
          class="q-mb-lg"
        />

        <div class="q-mb-xl text-center">
          <h1 class="text-h4 text-weight-bold text-yellow-10 q-ma-none">
            Ops... Não identificamos sua conta!
          </h1>

          <p class="text-h6 text-weight-bold q-mb-lg">
            Não conseguimos identificar a sua conta dentre os nossos usuários.
            Gostaria de enviar o e-mail de solicitação de recuperação de senha
            novamente?
          </p>

          <router-link
            :to="{ name: 'password_recover_request' }"
            v-slot="{ href }"
          >
            <q-btn
              :to="href"
              type="button"
              color="primary"
              class="q-mr-md-md q-mb-md q-mb-md-none"
            >
              Solicitar recuperação de senha
            </q-btn>
          </router-link>

          <router-link :to="{ name: 'home' }" v-slot="{ href }">
            <q-btn :to="href" color="white" text-color="black">
              Voltar para a página inicial
            </q-btn>
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AuthenticationRequest from "src/services/requests/authentication";

export default {
  data() {
    return {
      checkingTokenValidity: true,
      validToken: false,

      token: this.$route.query.token,

      recoverPasswordValid: true,
      resendingConfirmationEmail: false,
      recoveredPassword: false,
      recoverPasswordError: "",
      password: "",
      showPassword: false,
      passwordRules: [
        v => !!v || "Senha é obrigatório",
        v => v.length >= 8 || "Senha deve conter, no mínimo, 8 caracteres"
      ],
      passwordConfirmation: "",
      showPasswordConfirmation: false,
      passwordConfirmationRules: [
        v => !!v || "Confirmação de senha é obrigatória",
        v => v == this.password || "Senhas não coincidem"
      ]
    };
  },
  created() {
    AuthenticationRequest.check_password_recover_token(this.token)
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
    recoverPassword() {
      this.$refs.form.validate(false).then(valid => {
        if (valid) {
          this.resendingConfirmationEmail = true;

          AuthenticationRequest.recover_password(
            this.token,
            this.password,
            this.passwordConfirmation
          )
            .then(res => {
              if (res) {
                this.resendingConfirmationEmail = false;
                this.recoveredPassword = true;
              }
            })
            .catch(err => {
              if (err) {
                if (err.response.data.error.full_message) {
                  this.recoverPasswordError = err.response.data.error.full_message.split(
                    ": "
                  )[1];
                } else {
                  this.recoverPasswordError = err.response.data.error.message;
                }
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
.recover-password-container {
  max-width: 600px;
  padding: 12px;
  margin: 20px auto;
}

.btn-text-wrap span.q-btn__content {
  white-space: normal;
  flex: 1;
}
</style>
