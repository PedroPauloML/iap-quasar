<template>
  <div class="flex">
    <q-btn flat :round="$q.screen.lt.sm" @click="$refs.menuSignIn.hide()">
      <span v-if="$q.screen.lt.sm">
        <q-icon name="person_add" color="grey-7" />
      </span>
      <span v-else>Cadastrar-se</span>

      <q-menu ref="menuSignUp" persistent offset-y>
        <q-card>
          <q-card-section>
            <p class="text-h6 q-ma-none">
              Cadastrar-se no Portal IAP
            </p>
            <p class="text-grey-7 q-ma-none">
              Informe os seus dados para cadastrar-se
            </p>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-form
              ref="signUpForm"
              v-model="signUpValid"
              @submit="signUpByEmail"
              lazy-validation
            >
              <p v-if="signUpError" class="red--text body-2 text-center">
                Ocorreu um erro ao tentar cadastrar-se
              </p>

              <q-input
                v-model="name"
                :rules="nameRules"
                label="Nome"
                required
                autocomplete="new-name"
              />

              <q-input
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
                autocomplete="new-email"
              />

              <q-input
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                @click:append="showPassword = !showPassword"
                autocomplete="new-password"
              />

              <q-input
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
                autocomplete="new-password-confirmation"
              />

              <div class="flex justify-between">
                <q-btn
                  flat
                  color="dark"
                  class="col q-mr-sm"
                  :disabled="signingUpByEmail"
                  @click="closeSignUpMenu"
                  v-close-popup
                >
                  Cancelar
                </q-btn>

                <q-btn
                  color="primary"
                  type="submit"
                  class="col"
                  :disabled="!signUpValid || signingUpByOAuth"
                  :loading="signingUpByEmail"
                >
                  Cadastrar
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-menu>
    </q-btn>

    <q-btn
      flat
      color="primary"
      :round="$q.screen.lt.sm"
      @click="$refs.menuSignUp.hide()"
    >
      <span v-if="$q.screen.lt.sm">
        <q-icon name="login"></q-icon>
      </span>
      <span v-else>Entrar</span>

      <q-menu ref="menuSignIn" persistent offset-y>
        <q-card>
          <q-card-section>
            <p class="text-h6 q-ma-none">
              Acessar o Portal IAP
            </p>
            <p class="text-grey-7 q-ma-none">
              Informe o e-mail e senha do seu usuário
            </p>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-form
              ref="signInForm"
              v-model="signInValid"
              lazy-validation
              @submit="signInByEmail"
            >
              <p v-if="signInError" class="red--text body-2 text-center">
                E-mail ou senha inválida
              </p>

              <q-input
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
                autocomplete="new-email"
              />

              <q-input
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                @click:append="showPassword = !showPassword"
                autocomplete="new-password"
              />

              <router-link
                :to="{ name: 'password_recover_request' }"
                v-slot="{ href }"
              >
                <q-btn
                  :to="href"
                  color="primary"
                  link
                  flat
                  class="q-mb-lg full-width"
                >
                  Esqueceu a sua senha?
                </q-btn>
              </router-link>

              <div class="flex justify-between">
                <q-btn
                  flat
                  color="dark"
                  class="col q-mr-sm"
                  :disabled="signingInByEmail"
                  @click="closeSignInMenu"
                  v-close-popup
                >
                  Cancelar
                </q-btn>

                <q-btn
                  color="primary"
                  type="submit"
                  class="col"
                  :disabled="!signInValid || signingInByOAuth"
                  :loading="signingInByEmail"
                >
                  Entrar
                </q-btn>
              </div>
            </q-form>
          </q-card-section>

          <!-- <q-separator class="mx-5" />

          <div class="flex flex-column align-center px-5 py-3">
            <p class="body-2">Acessar com a conta social</p>

            <q-btn
              text
              @click="signInByOAuth"
              :loading="signingInByOAuth"
              :disabled="signingInByEmail"
            >
              Google
            </q-btn>
          </div> -->
        </q-card>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      signUpMenu: false,
      signUpValid: true,
      signingUpByEmail: false,
      signingUpByOAuth: false,
      signUpError: false,

      signInMenu: false,
      signInValid: true,
      signingInByEmail: false,
      signingInByOAuth: false,
      signInError: false,

      name: "",
      nameRules: [v => !!v || "Nome é obrigatório"],
      email: "",
      emailRules: [
        v => !!v || "E-mail é obrigatório",
        v => /.+@.+\..+/.test(v) || "E-mail precisa ser válido"
      ],
      password: "",
      showPassword: false,
      passwordRules: [
        v => !!v || "Senha é obrigatório",
        v => v.length >= 8 || "Deve ter conter, no mínimo, 8 caracteres"
      ],
      passwordConfirmation: "",
      showPasswordConfirmation: false,
      passwordConfirmationRules: [
        v => !!v || "Confirmação de senha é obrigatório",
        v => v == this.password || "Senhas não coincidem"
      ]
    };
  },
  methods: {
    closeSignUpMenu() {
      this.signUpMenu = false;
      this.showPassword = false;
      this.name = null;
      this.$refs.signUpForm.reset();
      this.$refs.signUpForm.resetValidation();
    },
    closeSignInMenu() {
      this.signInMenu = false;
      this.showPassword = false;
      this.name = null;
      this.$refs.signInForm.reset();
      this.$refs.signInForm.resetValidation();
    },
    signInByEmail() {
      this.signInError = false;

      if (this.$refs.signInForm.validate()) {
        const users = require("../../data/users.json");

        this.signingInByEmail = true;

        setTimeout(() => {
          let user = users.find(
            u => u.email == this.email && u.password == this.password
          );

          if (user) {
            let token = user.token;
            this.closeSignInMenu();
            this.$q.cookies.set("token", token, { path: "/" });
            this.$store.dispatch("user/setUser", user);
            // location.reload();
          } else {
            this.signInError = true;
          }

          this.signingInByEmail = false;
        }, 1000);
      }
    },
    // signInByOAuth() {
    //   this.signInError = false;
    //   this.signingInByOAuth = true;

    //   setTimeout(() => {
    //     this.signingInByOAuth = false;
    //   }, 1000);
    // },
    signUpByEmail() {
      if (this.$refs.signUpForm.validate()) {
        this.signingUpByEmail = true;

        setTimeout(() => {
          // let user = {
          //   token: "user-2",
          //   email: this.email,
          //   password: this.password,
          //   profile: {
          //     name: this.name,
          //   },
          // };

          // if (user) {
          //   let jwt = user.token;
          //   this.$cookies.set("jwt", jwt);
          //   this.$store.dispatch("user/setUser", user);
          //   this.closeSignUpMenu();
          //   // location.reload();
          // } else {
          //   this.signUpError = true;
          // }
          // this.signingUpByEmail = false;

          this.$router.push({
            name: "confirmation_email",
            params: {
              email: this.email,
              password: this.password,
              profile: {
                name: this.name
              }
            }
          });
        }, 1000);
      }
    }
    // signUpByOAuth() {
    //   this.signInError = false;
    //   this.signingUpByOAuth = true;

    //   setTimeout(() => {
    //     this.signingUpByOAuth = false;
    //   }, 1000);
    // },
  }
};
</script>

<style scoped></style>
