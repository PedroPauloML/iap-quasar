<template>
  <div id="contact" class="q-mb-lg container">
    <h1 class="text-h4 text-weight-bold q-mt-none q-mb-md">Contato</h1>

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
      class="rounded-borders q-mb-lg"
    ></iframe>

    <p>
      Nossa igreja local é gerenciada por um grupo de pessoas. Dentre elas:
    </p>

    <div
      id="representatives"
      class="row q-col-gutter-md items-center justify-center q-mb-lg"
    >
      <div
        v-for="(integrant, index) in integrants"
        :key="index"
        class="col-12 col-sm-6 col-md-4"
      >
        <div class="row justify-center">
          <div class="col-auto">
            <div class="relative-position q-mb-md q-mr-md q-mr-sm-none">
              <q-avatar :size="$q.screen.gt.sm ? '150px' : '80px'">
                <q-img :src="integrant.photo" aspect-ratio="1" />
              </q-avatar>

              <q-btn
                v-if="userSigned"
                color="red"
                class="delete-integrant"
                round
                :size="$q.screen.gt.sm ? 'md' : 'sm'"
                :loading="index == integrantIndexForDelete"
                :disabled="integrantIndexForDelete != null"
                @click="deleteIntegrant(index)"
              >
                <q-icon name="mdi-delete" />

                <q-tooltip v-if="$q.platform.is.desktop">Excluir</q-tooltip>
              </q-btn>

              <q-btn
                v-if="userSigned"
                color="accent"
                class="edit-integrant"
                round
                :size="$q.screen.gt.sm ? 'md' : 'sm'"
                :disabled="integrantIndexForDelete != null"
                @click="openIntegrantUpdateDialog(index)"
              >
                <q-icon name="mdi-pencil" small />
                <q-tooltip v-if="$q.platform.is.desktop">Editar</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div class="col col-sm-12 text-center">
            <span class="block text-h4 text-weight-thin">
              {{ integrant.name }}
            </span>
            <span class="block text-weight-bold">{{ integrant.role }}</span>
            <a
              v-if="!!integrant.contact"
              :href="`tel:55${integrant.contact.replace(/[() -]/g, '')}`"
              class="block text-overline"
              >{{ integrant.contact }}</a
            >
          </div>
        </div>
      </div>

      <div v-if="userSigned" class="col-12 col-sm-6 col-md-4 text-center">
        <q-btn
          color="primary"
          round
          size="lg"
          :disabled="integrantIndexForDelete != null"
          @click="newIntegrant"
        >
          <q-icon name="mdi-plus" />
          <q-tooltip>Adicionar novo integrante</q-tooltip>
        </q-btn>
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
// @media (min-width: 601px) {
//   #representatives > div {
//     max-width: 300px;
//     width: 300px;
//   }
// }
</style>
