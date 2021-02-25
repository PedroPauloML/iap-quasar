<template>
  <div id="news">
    <p
      v-if="value.search || value.date"
      class="mb-5"
      v-html="feedbackOfSearching"
    ></p>

    <transition name="slide-y-transition" mode="out-in">
      <div v-if="!showForm">
        <div v-if="!searching" class="row">
          <div
            v-for="(news, group_index) in grouped_news"
            :key="group_index"
            class="col-12 col-sm-6"
          >
            <div v-if="Array.isArray(news)">
              <News
                v-for="(single_new, i) in news"
                :key="i"
                :id="single_new.id"
                :title="single_new.title"
                :caption="single_new.caption"
                :image="{
                  url: single_new.image,
                  ratio: $vuetify.breakpoint.xs ? '1.2' : '2.1'
                }"
                :class="{ 'mt-7': i % 2 != 0 }"
                @onDestroy="loadNews"
              />
            </div>
            <News
              v-else
              :id="news.id"
              :title="news.title"
              :caption="news.caption"
              :image="{
                url: news.image,
                ratio: $vuetify.breakpoint.xs ? '1.2' : '1'
              }"
              @onDestroy="loadNews"
            />
          </div>
        </div>

        <v-row v-else align="center" justify="center">
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
        </v-row>
      </div>
    </transition>
  </div>
</template>

<script>
import News from "../../components/news/Component";

export default {
  components: { News },
  props: {
    value: {
      search: String,
      date: String,
      required: true
    },
    searching: Boolean,
    showForm: Boolean
  },
  data() {
    return {
      news_list: []
    };
  },
  created() {
    this.$store.dispatch("news/loadNews").then(this.loadNews);
  },
  methods: {
    loadNews() {
      this.news_list = this.$store.state.news.news;
      if (this.$route.query.search)
        this.value.search = this.$route.query.search;
      if (this.$route.query.date) this.value.date = this.$route.query.date;
      this.filterNews(this.value);
    },
    generateRatio(row, col) {
      return row % 2 == 0 ? (col == 0 ? "1" : "2") : col == 2 ? "1" : "2";
    },
    filterNews(filters) {
      if (!this.searching) {
        this.$emit("searching", true);

        setTimeout(() => {
          let search = (filters.search || "")
            .toLocaleLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          let date = filters.date
            ? this.$moment(filters.date).format("DD/MM/YYYY")
            : "";

          this.news_list = this.$store.state.news.news.filter(news => {
            return (
              (news.title
                .toLocaleLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(search) ||
                news.tags.find(tag =>
                  tag
                    .toLocaleLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .includes(search)
                )) &&
              (date
                ? this.$moment(news.metadata.published_at, "DD/MM/YYYY").format(
                    "DD/MM/YYYY"
                  ) == date.trim()
                : true)
            );
          });

          this.$emit("searching", false);
        }, 1000);
      }
    }
  },
  watch: {
    value: {
      handler: function() {
        this.filterNews(this.value);
      },
      deep: true
    }
  },
  computed: {
    grouped_news() {
      let group = [];

      this.news_list.forEach((_, index) => {
        if (index % 3 == 0 && index < this.news_list.length) {
          let new_array = this.news_list.slice(
            index,
            Math.min(index + 3, this.news_list.length)
          );

          if (index % 6 == 0) {
            group.push(
              new_array[0],
              new_array.slice(1, 3).filter(value => value)
            );
          } else {
            group.push(
              new_array.slice(0, 2).filter(value => value),
              new_array[2]
            );
          }
        }
      });

      group = group.filter(value => value);

      return group;
    },
    feedbackOfSearching() {
      let text = `${
        this.searching
          ? "Aguarde um momento, estamos pesquisando por publicação"
          : `Encontramos <b>${this.news_list.length}</b> resultado(s) para a busca `
      }
        ${this.value.search ? `<b>${this.value.search}</b> ` : ""}
        ${
          this.value.date
            ? `do dia <b>${this.$moment(this.value.date).format(
                "DD/MM/YYYY"
              )}</b>`
            : ""
        }
      `;

      return `<p>${text}</p>`;
    }
  }
  // beforeRouteLeave(to, from, next) {
  //   next();
  //   if (this.filters) {
  //     this.$emit("clearInputSearch");
  //   }
  // },
};
</script>

<style></style>
