<template>
  <div class="cropper">
    <input
      ref="input"
      type="file"
      name="image"
      accept="image/*"
      @change="setImage"
    />

    <div v-show="imgSrc && !cropImg" class="content">
      <section class="cropper-area">
        <!-- <div class="img-cropper">
          <vue-cropper
            ref="cropper"
            :aspect-ratio="aspectRatio"
            :src="imgSrc"
            :zoomable="false"
            :responsive="true"
            :containerStyle="{ maxHeight: '60vh' }"
          />
        </div> -->
        <Cropper
          ref="cropper"
          :src="imgSrc"
          :stencil-props="{ aspectRatio }"
          class="cropper-container"
        />
        <div
          :class="{
            actions: 'true',
            'flex-column': $q.screen.lt.md || linearActionsButton
          }"
        >
          <div>
            <span class="font-weight-bold">Editar:</span>
            <q-btn icon type="button" @click.prevent="rotate(-90)">
              <q-icon name="mdi-format-rotate-90" />
              <q-tooltip>
                <span>Girar -90°</span>
              </q-tooltip>
            </q-btn>

            <q-btn icon type="button" @click.prevent="rotate(90)">
              <q-icon name="mdi-format-rotate-90" class="mdi-flip-h" />
              <q-tooltip>
                <span>Girar 90°</span>
              </q-tooltip>
            </q-btn>

            <q-btn icon type="button" ref="flipX" @click.prevent="flipX">
              <q-icon name="mdi-flip-horizontal" />
              <q-tooltip>
                <span>Inverter horizontalmente</span>
              </q-tooltip>
            </q-btn>

            <q-btn icon type="button" ref="flipY" @click.prevent="flipY">
              <q-icon name="mdi-flip-vertical" />
              <q-tooltip>
                <span>Inverter verticalmente</span>
              </q-tooltip>
            </q-btn>
          </div>

          <div>
            <q-btn
              color="grey"
              dark
              type="button"
              class="mr-3"
              @click.prevent="cancel"
            >
              Cancelar
            </q-btn>
            <q-btn
              color="primary"
              type="button"
              @click.prevent="cropImage"
              :loading="cropping"
            >
              Cortar
            </q-btn>
          </div>
        </div>
      </section>
    </div>
    <a
      v-show="!imgSrc && !cropImg"
      href="#"
      class="select-image"
      role="button"
      @click.prevent="showFileChooser"
    >
      <span v-if="loadingCropper">
        <q-circular-progress
          indeterminate
          color="primary"
          class="mr-3"
        ></q-circular-progress>
        Carregando editor da imagem
      </span>
      <span v-else>Selecionar {{ imageName }}</span>
    </a>
    <div v-show="cropImg" class="cropped-img-container">
      <div class="cropped-img-content">
        <q-img :src="cropImg" alt="Cropped Image">
          <template v-slot:placeholder>
            <v-row
              class="full-height ma-0 secondary darken-1"
              align="center"
              justify="center"
            >
              <q-circular-progress
                indeterminate
                color="primary"
              ></q-circular-progress>
            </v-row>
          </template>
        </q-img>

        <a href="#" role="button" @click.prevent="showFileChooser">
          <span>Alterar {{ imageName }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// import VueCropper from "vue-cropperjs";
// import "cropperjs/dist/cropper.css";
import { Cropper } from "vue-advanced-cropper";
// Add the following line to import the cropper styles
import "vue-advanced-cropper/dist/style.css";

export default {
  props: {
    value: { type: String, required: true },
    currentImage: String,
    imageName: { type: String, default: "Imagem" },
    aspectRatio: { type: Number, default: 16 / 9 },
    linearActionsButton: { type: Boolean, default: false }
  },
  components: {
    // VueCropper
    Cropper
  },
  data() {
    return {
      imgSrc: this.value,
      loadingCropper: false,
      cropping: false,
      cropImg: this.currentImage
    };
  },
  watch: {
    value(val) {
      this.imgSrc = val;
    },
    currentImage(val) {
      this.cropImg = val;
    }
  },
  methods: {
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      const { canvas } = this.$refs.cropper.getResult();
      this.cropping = true;
      let result = canvas.toDataURL();
      this.cropImg = result;
      this.$emit("input", result);
      this.cropping = false;
    },
    flipX() {
      const dom = this.$refs.flipX.$el;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      this.$refs.cropper.flip(true, false);
      dom.setAttribute("data-scale", scale);
    },
    flipY() {
      const dom = this.$refs.flipY.$el;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      this.$refs.cropper.flip(false, true);
      dom.setAttribute("data-scale", scale);
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg);
    },
    setImage(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.type.indexOf("image/") === -1) {
          alert("Please select an image file");
          return;
        }
        if (typeof FileReader === "function") {
          this.loadingCropper = true;
          const reader = new FileReader();
          reader.onload = event => {
            this.imgSrc = event.target.result;
            // rebuild cropperjs with the updated source
            // this.$refs.cropper.replace(event.target.result);
            this.cropImg = "";
            this.loadingCropper = false;
          };
          reader.readAsDataURL(file);
        } else {
          alert("Sorry, FileReader API not supported");
        }
      }
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    cancel() {
      this.imgSrc = "";
      this.cropImg = "";
      this.$refs.input.value = "";
      this.$emit("croppedResult", "");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input[type="file"] {
  display: none;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.cropper-area {
  width: 100%;
  background-color: #d0d7dd;
  border-radius: 3px;
  padding: 10px;
  flex: 1;
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.5rem;
}
.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #004b83;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
.select-image {
  text-decoration: none;
  display: flex;
  padding: 30px;
  align-items: center;
  justify-content: center;
  border: 3px dotted #004b83;
  text-transform: uppercase;
  background-color: #f2f2f2;
  font-weight: 500;
  flex-direction: column;
}
.cropped-img-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
}
.cropped-img-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid #004b83;
  background: #004b83;
  border-radius: 5px;
  width: 100%;
}
.cropped-img-content .v-image {
  max-height: 40vh;
  border-radius: 5px;
  max-width: 100%;
}
.cropped-img-content a {
  width: 100%;
  text-align: center;
  padding: 10px;
  background-color: #004b83;
  text-decoration: none;
  text-transform: uppercase;
  color: #fff;
  font-weight: 500;
}
.cropper-container {
  max-height: 60vh;
}
</style>
