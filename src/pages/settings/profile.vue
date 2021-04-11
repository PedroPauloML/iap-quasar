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

        <q-img :src="avatar" class="avatar">
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

        <q-btn
          label="Atualizar imagem"
          color="primary"
          outline
          class="block q-mx-auto q-mt-md"
          @click="openAvatarDialog"
        />

        <q-dialog :value="avatarDialog" @input="closeAvatarDialog">
          <q-card class="dialog-container">
            <q-card-section class="text-h5 text-center text-weight-bold">
              Atualizar imagem do perfil
            </q-card-section>

            <q-form ref="avatarForm" @submit="updateAvatar">
              <q-card-section>
                <Cropper
                  ref="avatar"
                  :value="avatar"
                  @input="val => (newAvatar = val)"
                  :currentImage="currentAvatar"
                  imageName="Imagem"
                  :aspectRatio="1 / 1"
                  linear-actions-button
                />
              </q-card-section>

              <q-card-actions>
                <q-space></q-space>
                <q-btn
                  type="button"
                  color="grey"
                  dark
                  @click="closeAvatarDialog"
                  :disabled="updatingAvatar"
                >
                  Cancelar
                </q-btn>

                <q-btn
                  color="primary"
                  type="submit"
                  :loading="updatingAvatar"
                  :disable="!newAvatar"
                >
                  Atualizar
                </q-btn>
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import UserRequest from "src/services/requests/user";

import Cropper from "src/components/Cropper";

export default {
  components: { Cropper },
  data() {
    return {
      // Profile variables
      name: this.$store.state.user.user.profile.name,

      // Avatar dialog variables
      avatarDialog: false,
      avatar: this.$store.state.user.user.profile.avatar.url || "",
      newAvatar: "",
      currentAvatar: this.$store.state.user.user.profile.avatar.url || "",

      // Loading variables
      updatingProfile: false,
      updatingAvatar: false
    };
  },
  methods: {
    // Profile
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
    },

    // Avatar
    openAvatarDialog() {
      this.avatarDialog = true;
    },
    closeAvatarDialog() {
      this.avatarDialog = false;
    },
    updateAvatar() {
      this.$refs.avatarForm.validate(false).then(async valid => {
        if (valid && !this.updatingAvatar) {
          this.updatingAvatar = true;

          let formData = new FormData();
          formData.set("avatar", this.newAvatar);

          UserRequest.updateAvatar(this.$store.state.user.user.id, formData)
            .then(res => {
              if (res) {
                this.updatingAvatar = false;

                this.newAvatar = "";
                this.avatar = res.data.profile.avatar.url || "";
                this.currentAvatar = res.data.profile.avatar.url || "";

                this.closeAvatarDialog();

                this.$store.dispatch("user/setUser", res.data);

                this.$q.notify({
                  message: "Avatar atualizado com sucesso",
                  icon: "check",
                  color: "positive"
                });
              }
            })
            .catch(err => {
              this.updatingAvatar = false;

              if (err.response && err.response.data.error.message) {
                this.$q.notify({
                  message: err.response.data.error.message,
                  icon: "info",
                  color: "negative"
                });
              } else {
                this.$q.notify({
                  message:
                    "Ocorreu um erro ao tentar atualizar a imagem do perfil. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                  icon: "info",
                  color: "negative"
                });
              }
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
