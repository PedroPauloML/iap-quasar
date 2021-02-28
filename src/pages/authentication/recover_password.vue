<template>
  <div id="recover-password">
    <transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
      mode="out-in"
    >
      <div v-if="checkingTokenValidity" key="1">
        <q-linear-progress indeterminate class="mb-5"></q-linear-progress>

        <h3>Estamos lhe procurando. Aguarde um momento!</h3>
      </div>

      <div v-else-if="!checkingTokenValidity && validToken">
        <transition
          enter-active-class="animated fadeInDown"
          leave-active-class="animated fadeOutUp"
          mode="out-in"
        >
          <div v-if="!recoveredPassword" key="2.1" class="centered">
            <q-icon class="primary--text mb-5" size="70">
              mdi-lock-alert
            </q-icon>

            <div class="mb-10 text-center">
              <h1 class="primary--text">
                Recuperação de senha
              </h1>

              <h3>
                Você solicitou a recuperação de sua senha. Insira a nova senha
                abaixo para atualizá-la.
              </h3>

              <q-card class="recover-password-container">
                <q-card-text>
                  <v-form
                    ref="form"
                    v-model="recoverPasswordValid"
                    lazy-validation
                    @submit="
                      e => {
                        e.preventDefault();
                        e.stopPropagation();
                        recoverPassword();
                      }
                    "
                  >
                    <v-text-field
                      v-model="password"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="passwordRules"
                      :type="showPassword ? 'text' : 'password'"
                      label="Senha"
                      @click:append="showPassword = !showPassword"
                      @keyup.enter="recoverPassword"
                      autocomplete="new-password"
                    ></v-text-field>

                    <v-text-field
                      v-model="passwordConfirmation"
                      :append-icon="
                        showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      :rules="passwordConfirmationRules"
                      :type="showPasswordConfirmation ? 'text' : 'password'"
                      label="Confirmação de senha"
                      @click:append="
                        showPasswordConfirmation = !showPasswordConfirmation
                      "
                      @keyup.enter="recoverPassword"
                      autocomplete="new-password-confirmation"
                    ></v-text-field>

                    <q-btn
                      color="primary"
                      type="submit"
                      @click="recoverPassword"
                      :disabled="!recoverPassword"
                      :loading="resendingConfirmationEmail"
                      class="mt-3"
                    >
                      Atualizar senha
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

          <div v-else key="2.2" class="centered">
            <q-icon class="green--text text--darken-3 mb-5" size="70">
              mdi-check-circle-outline
            </q-icon>

            <div class="mb-10 text-center">
              <h1 class="green--text text--darken-3">
                Senha alterada com sucesso!
              </h1>

              <h3>
                A partir de agora você conseguirá acessar sua conta com a nova
                senha definida.
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

      <div
        v-else-if="!checkingTokenValidity && !validToken"
        key="3"
        class="centered"
      >
        <q-icon class="warning--text text--darken-2 mb-5" size="70">
          mdi-alert-outline
        </q-icon>

        <div class="mb-10 text-center">
          <h1 class="warning--text text--darken-2">
            Ops... Não identificamos sua conta!
          </h1>

          <h3 class="mb-5">
            Não conseguimos identificar a sua conta dentre os nossos usuários.
            Gostaria de enviar o e-mail de solicitação de recuperação de senha
            novamente?
          </h3>

          <router-link
            :to="{ name: 'password_recover_request' }"
            v-slot="{ href }"
          >
            <q-btn
              :to="href"
              type="button"
              color="primary mr-md-3 mb-3 mb-md-0"
            >
              Solicitar recuperação de senha
            </q-btn>
          </router-link>

          <router-link :to="{ name: 'home' }" v-slot="{ href }">
            <q-btn :to="href" type="button" color="light">
              Voltar para a página inicial
            </q-btn>
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkingTokenValidity: true,
      validToken: false,

      recoverPasswordValid: true,
      resendingConfirmationEmail: false,
      recoveredPassword: false,
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
    setTimeout(() => {
      let token = this.$route.query.token;
      if (token && token == "123456") {
        this.validToken = true;
        this.checkingTokenValidity = false;
      } else {
        this.validToken = false;
        this.checkingTokenValidity = false;
      }
    }, 2000);
  },
  methods: {
    recoverPassword() {
      if (this.$refs.form.validate()) {
        this.resendingConfirmationEmail = true;

        const users = require("../../data/users.json");

        setTimeout(() => {
          let user = users.find(u => u.email == "user@email.com");
          let jwt = user.token;
          this.$cookies.set("jwt", jwt);
          this.$store.dispatch("user/setUser", user);

          this.resendingConfirmationEmail = false;
          this.recoveredPassword = true;
        }, 1000);
      }
    }
  }
};
</script>

<style lang="scss">
#recover-password,
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

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
