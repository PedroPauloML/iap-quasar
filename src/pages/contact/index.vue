<template>
  <div id="contact" class="mb-5">
    <h1 class="mb-3">Contato</h1>

    <p>
      A Igreja Adventista da Promessa é o resultado de uma oração feita com fé.
      A IAP baseia-se nas doutrinas bíblicas que considera fundamentais para
      satisfazer as exigências divinas de restauração do ser humano. É uma
      Igreja que crê, que recebe e que depende do poder do Espírito Santo.
    </p>

    <p>
      Nossa missão é adorar a Deus, proclamar a Jesus Cristo e fazer discípulos
      no poder do Espírito Santo. Nossa visão é que cada promessista seja
      missionário no poder do Espírito Santo.
    </p>

    <p>
      Hoje, estamos em 18 países e totalizamos cerca de 80 mil membros. Nossa
      atuação se dá por meio de diferentes ministérios: Ensino, Junta de
      Missões, Música e Adoração, Mulheres, Jovens, Crianças e Adolescentes e
      Vida Pastoral.
    </p>

    <p>
      Na cidade de <b>Paulo Afonso/BA</b> estamos localizados na
      <b>R. 13 de Maio, 42 - Centenário</b>. Você pode entender melhor nossa
      localização no mapa abaixo.
    </p>

    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.429330050006!2d-38.23084368521069!3d-9.38366299327536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7093a030e8ca5ff%3A0xbfc888c7a70febb9!2sR.%2013%20de%20maio%2C%2042%20-%20Centenario%2C%20Paulo%20Afonso%20-%20BA%2C%2048605-600!5e0!3m2!1spt-BR!2sbr!4v1596210950708!5m2!1spt-BR!2sbr"
      frameborder="0"
      style="border:0;"
      allowfullscreen=""
      aria-hidden="false"
      tabindex="0"
      class="rounded mb-5"
    ></iframe>

    <p>
      Nossa igreja local é gerenciada por um grupo de pessoas. Dentre elas:
    </p>

    <div
      id="representatives"
      class="d-flex flex-wrap flex-column flex-sm-row justify-space-around"
    >
      <div
        v-for="(integrant, index) in integrants"
        :key="index"
        class="d-flex flex flex-sm-column align-start align-sm-center mb-5"
      >
        <div style="position: relative;" class="mb-4 mr-3 mr-sm-0">
          <q-img
            :src="integrant.photo"
            aspect-ratio="1"
            :width="$vuetify.breakpoint.smAndUp ? 150 : 80"
            :max-width="$vuetify.breakpoint.smAndUp ? 150 : 80"
            :height="$vuetify.breakpoint.smAndUp ? 150 : 80"
            :max-height="$vuetify.breakpoint.smAndUp ? 150 : 80"
            class="rounded-circle"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0 secondary darken-1"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-row>
            </template>
          </q-img>
          <q-tooltip
            v-if="userSigned"
            top
            :disabled="$vuetify.breakpoint.mobile"
          >
            <template v-slot:activator="{ on, attrs }">
              <q-btn
                color="red"
                class="white--text delete-integrant"
                fab
                :x-small="$vuetify.breakpoint.xsOnly"
                :small="$vuetify.breakpoint.smAndUp"
                @click="deleteIntegrant(index)"
                :loading="index == integrantIndexForDelete"
                :disabled="integrantIndexForDelete != null"
                v-bind="attrs"
                v-on="on"
              >
                <q-icon small>mdi-delete</q-icon>
              </q-btn>
            </template>
            <span>Excluir</span>
          </q-tooltip>

          <q-tooltip
            v-if="userSigned"
            top
            :disabled="$vuetify.breakpoint.mobile"
          >
            <template v-slot:activator="{ on, attrs }">
              <q-btn
                color="accent"
                class="white--text edit-integrant"
                fab
                :x-small="$vuetify.breakpoint.xsOnly"
                :small="$vuetify.breakpoint.smAndUp"
                :disabled="integrantIndexForDelete != null"
                @click="openIntegrantUpdateDialog(index)"
                v-bind="attrs"
                v-on="on"
              >
                <q-icon small>mdi-pencil</q-icon>
              </q-btn>
            </template>
            <span>Editar</span>
          </q-tooltip>
        </div>
        <div class="flex text-center">
          <span class="d-block display-1 font-weight-thin">
            {{ integrant.name }}
          </span>
          <span class="d-block font-weight-bold">{{ integrant.role }}</span>
          <span class="d-block overline">{{ integrant.contact }}</span>
        </div>
      </div>

      <div
        v-if="userSigned"
        class="d-flex flex flex-sm-column align-center justify-center mb-5"
      >
        <q-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <q-btn
              color="primary"
              fab
              :disabled="integrantIndexForDelete != null"
              @click="newIntegrant"
              v-bind="attrs"
              v-on="on"
            >
              <q-icon large>mdi-plus</q-icon>
            </q-btn>
          </template>
          <span>Adicionar novo integrante</span>
        </q-tooltip>
      </div>
    </div>

    <p>
      Faça-nos uma visita! Estramos de braços abertos para recebê-lo e a
      disposição para orar por você e compartilhar o que Deus tem a nos falar.
    </p>

    <Integrant
      :data="selectedIntegrant"
      :opened="integrantDialogOpened"
      @closeDialog="closeIntegrantUpdateDialog"
      @createIntegrant="createIntegrant"
      @updateIntegrant="updateIntegrant"
    />
  </div>
</template>

<script>
import Integrant from "../../components/contact/Integrant";

export default {
  components: { Integrant },
  data() {
    return {
      integrantDialogOpened: false,
      integrants: [],
      selectedIntegrant: {},
      integrantIndexForDelete: null
    };
  },
  created() {
    this.$store.dispatch("integrants/loadIntegrants").then(this.loadIntegrants);
  },
  methods: {
    loadIntegrants() {
      this.integrants = this.$store.state.integrants.integrants;
    },
    openIntegrantUpdateDialog(index) {
      this.selectedIntegrant = this.integrants[index];
      this.integrantDialogOpened = true;
    },
    closeIntegrantUpdateDialog() {
      this.integrantDialogOpened = false;
      this.selectedIntegrant = {};
    },
    newIntegrant() {
      this.selectedIntegrant = {};
      this.integrantDialogOpened = true;
    },
    createIntegrant(payload) {
      this.$store.dispatch("integrants/addIntegrant", payload).then(() => {
        this.closeIntegrantUpdateDialog();
        this.loadIntegrants();
      });
    },
    updateIntegrant(payload) {
      this.$store.dispatch("integrants/updateIntegrant", payload).then(() => {
        this.closeIntegrantUpdateDialog();
        this.loadIntegrants();
      });
    },
    deleteIntegrant(index) {
      let id = this.integrants[index].id;

      if (confirm("Tem certeza que deseja excluir esse integrante?")) {
        this.integrantIndexForDelete = index;

        setTimeout(() => {
          this.$store.dispatch("integrants/removeIntegrant", id).then(() => {
            this.loadIntegrants();
            this.integrantIndexForDelete = null;
          });
        }, 1000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
iframe {
  width: 100%;
  height: 500px;
  max-height: 70vh;
}
.edit-integrant {
  position: absolute;
  bottom: -10px;
  right: 0;
}
.delete-integrant {
  position: absolute;
  bottom: -10px;
  left: 0;
}
@media (min-width: 601px) {
  #representatives > div {
    max-width: 300px;
    width: 300px;
  }
}
</style>
