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
            <q-form ref="signUpForm" @submit="signUpByEmail" lazy-validation>
              <p
                v-if="signUpErrorMessage"
                class="text-red text-body2 text-center q-mb-none"
              >
                {{ signUpErrorMessage }}
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
                label="Senha"
                v-model="password"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click.stop="showPassword = !showPassword"
                    color="grey-5"
                    class="cursor-pointer"
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
                    :name="showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'"
                    @click.stop="
                      showPasswordConfirmation = !showPasswordConfirmation
                    "
                    color="grey-5"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>

              <router-link
                :to="{ name: 'resend_confirmation_email' }"
                v-slot="{ href }"
              >
                <q-btn
                  :to="href"
                  color="primary"
                  link
                  flat
                  class="q-mb-lg full-width"
                >
                  Re-enviar e-mail de confirmação de conta
                </q-btn>
              </router-link>

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
                  :disabled="signingUpByOAuth"
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
            <q-form ref="signInForm" lazy-validation @submit="signInByEmail">
              <p
                v-if="signInErrorMessage"
                class="text-red text-body2 text-center q-mb-none"
              >
                {{ signInErrorMessage }}
              </p>

              <q-input
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
                autocomplete="new-email"
              />

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
                    @click.stop="showPassword = !showPassword"
                    color="grey-5"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>

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
                  :disabled="signingInByOAuth"
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
import AuthenticationRequest from "src/services/requests/authentication";

export default {
  data() {
    return {
      signingUpByEmail: false,
      signingUpByOAuth: false,
      signUpErrorMessage: "",

      signingInByEmail: false,
      signingInByOAuth: false,
      signInErrorMessage: "",

      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",

      nameRules: [v => !!v || "Nome é obrigatório"],
      emailRules: [
        v => !!v || "E-mail é obrigatório",
        v => /.+@.+\..+/.test(v) || "E-mail precisa ser válido"
      ],
      passwordRules: [
        v => !!v || "Senha é obrigatório",
        v => v.length >= 8 || "Deve ter conter, no mínimo, 8 caracteres"
      ],
      passwordConfirmationRules: [
        v => !!v || "Confirmação de senha é obrigatório",
        v => v == this.password || "Senhas não coincidem"
      ],

      showPassword: false,
      showPasswordConfirmation: false
    };
  },
  methods: {
    closeSignUpMenu() {
      this.showPassword = false;
      this.showPasswordConfirmation = false;
      this.signUpErrorMessage = "";
      this.name = "";
      this.email = "";
      this.password = "";
      this.passwordConfirmation = "";
    },
    closeSignInMenu() {
      this.showPassword = false;
      this.showPassword = false;
      this.showPasswordConfirmation = false;
      this.signInErrorMessage = "";
      this.password = "";
      this.email = "";
    },
    signInByEmail() {
      this.$refs.signInForm.validate(false).then(valid => {
        if (valid && !this.signingInByEmail) {
          this.signingInByEmail = true;
          this.signInErrorMessage = "";

          AuthenticationRequest.sign_in(this.email, this.password)
            .then(res => {
              if (res) {
                let user = res.data;

                if (user) {
                  let token = user.token;
                  this.closeSignInMenu();
                  this.$q.cookies.set("token", token, { path: "/" });
                  this.$store.dispatch("user/setUser", user);
                  // location.reload();
                }
              }
            })
            .catch(err => {
              if (err) {
                console.log(err);
                this.signInErrorMessage = err.response.data.error.message;
                this.signingInByEmail = false;
              }
            });
        }
      });
    },
    // signInByOAuth() {
    //   this.signInError = false;
    //   this.signingInByOAuth = true;

    //   setTimeout(() => {
    //     this.signingInByOAuth = false;
    //   }, 1000);
    // },
    signUpByEmail() {
      this.$refs.signUpForm.validate(false).then(valid => {
        if (valid && !this.signingUpByEmail) {
          this.signingUpByEmail = true;

          let params = {
            user: {
              email: this.email,
              password: this.password,
              password_confirmation: this.passwordConfirmation,
              profile_attributes: {
                name: this.name
              }
            }
          };

          AuthenticationRequest.sign_up(params)
            .then(res => {
              if (res) {
                this.$router.push({
                  name: "confirmation_email",
                  params: { email: this.email }
                });
              }
            })
            .catch(err => {
              if (err) {
                if (err.response.data.error.full_message) {
                  this.signUpErrorMessage = err.response.data.error.full_message.split(
                    ": "
                  )[1];
                } else {
                  this.signUpErrorMessage = err.response.data.error.message;
                }
                this.signingUpByEmail = false;
              }
            });
        }
      });
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
