<template>
  <div id="profile" class="settings-content">
    <p class="text-h5">Perfil</p>

    <q-separator spaced />

    <div class="row q-col-gutter-lg reverse-wrap">
      <div class="col-12 col-sm-9">
        <q-form ref="profileForm" @submit="updateProfile" class="q-mb-lg">
          <q-input
            label="Nome"
            ref="name"
            v-model="name"
            hint="Esse é o nome que irá aparecer para os outros usuários quando você fizer um comentário, criar alguma publicação, etc."
          />

          <q-btn
            label="Atualizar perfil"
            type="submit"
            color="positive"
            class="q-mt-lg"
            :loading="updatingProfile"
          />
        </q-form>
      </div>

      <div class="col-12 col-sm-3">
        <p class="text-weight-medium">Imagem do perfil</p>

        <q-img src="https://picsum.photos/id/1012/200/200" class="avatar">
          <template v-slot:placeholder>
            <q-row
              class="full-height ma-0 secondary darken-1"
              align="center"
              justify="center"
            >
              <q-progress-circular
                indeterminate
                color="primary"
              ></q-progress-circular>
            </q-row>
          </template>
        </q-img>
      </div>
    </div>
  </div>
</template>

<script>
import UserRequest from "src/services/requests/user";

export default {
  data() {
    return {
      name: this.$store.state.user.user.profile.name,

      updatingProfile: false
    };
  },
  methods: {
    updateProfile() {
      this.$refs.profileForm.validate(false).then(valid => {
        if (valid && !this.updatingProfile) {
          this.updatingProfile = true;

          let params = {
            profile_attributes: {
              id: this.$store.state.user.user.profile.id,
              name: this.name
            }
          };

          UserRequest.update(this.$store.state.user.user.id, params)
            .then(res => {
              if (res) {
                this.updatingProfile = false;

                this.$store.dispatch("user/setUser", res.data);
                this.$q.notify({
                  message: "Perfil atualizado com sucesso",
                  icon: "check",
                  color: "positive"
                });
              }
            })
            .catch(err => {
              if (err) console.log(err);
              this.updatingProfile = false;

              this.$q.notify({
                message:
                  "Ocorreu um erro ao tentar atualizar o seu perfil. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                icon: "info",
                color: "negative"
              });
            });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.avatar {
  width: 100%;
  border-radius: 50%;
}
</style>
