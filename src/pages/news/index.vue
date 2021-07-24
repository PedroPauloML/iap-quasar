<template>
  <div id="news">
    <q-card v-if="userSigned" class="q-mb-lg">
      <q-tabs
        v-model="tab"
        align="justify"
        active-color="primary"
        indicator-color="primary"
        class="text-grey"
        dense
      >
        <q-tab name="published" label="Publicados" :disable="searching" />
        <q-tab name="draft" label="Rascunhos" :disable="searching" />
      </q-tabs>
    </q-card>

    <p
      v-if="filters.query || filters.date"
      class="q-mb-lg"
      v-html="feedbackOfSearching"
    ></p>

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <q-tab-panel name="published" class="q-pa-none">
        <transition
          enter-active-class="animated fadeInDown"
          leave-active-class="animated fadeOutUp"
          mode="out-in"
        >
          <div v-if="hasNewNews" class="full-width text-center q-mb-lg">
            <q-btn
              label="Carregar novas notícias"
              color="white"
              text-color="black"
              class="q-ma-xs"
              rounded
              @click="fetchFirstPageOfPublishedNews"
            />
          </div>
        </transition>

        <div v-if="searching">
          <q-linear-progress indeterminate color="primary"></q-linear-progress>
        </div>

        <transition
          enter-active-class="animated fadeInDown"
          leave-active-class="animated fadeOutUp"
          mode="out-in"
        >
          <q-infinite-scroll
            @load="publishedNewsInfiniteScroll"
            :offset="250"
            :disable="!canFetchMorePublishedNews"
          >
            <div
              v-if="publishedNews.length > 0"
              class="row q-col-gutter-lg q-mb-lg"
            >
              <div
                v-for="(news, index) in groupedPublishedNews"
                :key="index"
                class="col-12 col-sm-6"
              >
                <div
                  v-if="Array.isArray(news)"
                  class="full-height row q-col-gutter-lg"
                >
                  <div
                    class="col"
                    v-for="(single_new, i) in news"
                    :key="i"
                    :class="{
                      'col-12': true,
                      'self-end': i == news.length - 1 && news.length % 2 == 0
                    }"
                  >
                    <News
                      :data="single_new"
                      :coverRatio="$q.screen.lt.sm ? 1.2 : 2.1"
                      no-content
                      @filterByTag="filterByTag"
                      @onDestroy="fetchFirstPageOfPublishedNews"
                    />
                  </div>
                </div>
                <News
                  v-else
                  :data="news"
                  :coverRatio="$q.screen.lt.sm ? 1.2 : 1"
                  no-content
                  @filterByTag="filterByTag"
                  @onDestroy="fetchFirstPageOfPublishedNews"
                />
              </div>
            </div>
            <div
              v-else-if="filters.date == '' && filters.query == ''"
              class="flex no-wrap items-center justify-center"
            >
              <q-img :src="newsSRC" width="40px" class="q-mr-lg" />
              <span class="text-h6">
                Nenhuma notícia no momento. Volte mais tarde.
              </span>
            </div>

            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </transition>
      </q-tab-panel>

      <q-tab-panel v-if="userSigned" name="draft">
        <div v-if="searching" class="q-mb-lg">
          <q-linear-progress indeterminate color="primary"></q-linear-progress>
        </div>

        <transition
          enter-active-class="animated fadeInDown"
          leave-active-class="animated fadeOutUp"
          mode="out-in"
        >
          <q-infinite-scroll
            @load="draftNewsInfiniteScroll"
            :offset="250"
            :disable="!canFetchMoreDraftNews"
          >
            <div
              v-if="groupedDraftNews.length > 0"
              class="row q-col-gutter-lg q-mb-lg"
            >
              <div
                v-for="(news, index) in groupedDraftNews"
                :key="index"
                class="col-12 col-sm-6"
              >
                <div
                  v-if="Array.isArray(news)"
                  class="full-height row q-col-gutter-lg"
                >
                  <div
                    class="col"
                    v-for="(single_new, i) in news"
                    :key="i"
                    :class="{
                      'col-12': true,
                      'self-end': i == news.length - 1 && news.length % 2 == 0
                    }"
                  >
                    <News
                      :data="single_new"
                      :coverRatio="$q.screen.lt.sm ? 1.2 : 2.1"
                      @filterByTag="filterByTag"
                      no-content
                      @onPublish="onPublish"
                      @onDestroy="fetchFirstPageOfNewDraftNews"
                    />
                  </div>
                </div>
                <News
                  v-else
                  :data="news"
                  :coverRatio="$q.screen.lt.sm ? 1.2 : 1"
                  @filterByTag="filterByTag"
                  no-content
                  @onPublish="onPublish"
                  @onDestroy="fetchFirstPageOfNewDraftNews"
                />
              </div>
            </div>
            <div
              v-else-if="filters.date == '' && filters.query == ''"
              class="flex no-wrap items-center justify-center"
            >
              <q-img :src="newsSRC" width="40px" class="q-mr-lg" />
              <span class="text-h6">
                Nenhum rascunho de notícia no momento. Você tem alguma nova
                notícia para contar?
              </span>
            </div>

            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </transition>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import NewsRequest from "src/services/requests/news";

import News from "../../components/news/Component";

import newsSRC from "assets/icons/news.svg";

export default {
  components: { News },
  props: {
    filters: {
      query: { type: String, required: true },
      date: { type: String, required: true }
    },
    searching: Boolean
  },
  data() {
    return {
      newsSRC,

      tab: "published",

      publishedNews: [],
      publishedNewsPagination: {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      },

      draftNews: [],
      draftNewsPagination: {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      },

      // Loading variables
      fetchingNews: false,
      hasNewNews: false
    };
  },
  created() {
    if (
      this.$route.params.query &&
      this.$route.params.query != this.filters.query
    ) {
      this.filterByTag(this.$route.params.query);
    } else {
      this.fetchPublishedNews();
    }
  },
  watch: {
    filters: {
      handler: function() {
        if (this.filters.date == "" && this.filters.query == "") {
          this.fetchFirstPageOfPublishedNews();
          this.fetchFirstPageOfNewDraftNews();
        } else {
          switch (this.tab) {
            case "published":
              this.fetchFirstPageOfPublishedNews();
              break;
            case "draft":
              this.fetchFirstPageOfNewDraftNews();
              break;
          }
        }
      },
      deep: true
    },
    tab(newValue) {
      if (this.filters.date != "" || this.filters.query != "") {
        this.$emit("resetFilters");
      } else {
        if (
          newValue == "published" &&
          this.publishedNews.length == 0 &&
          this.canFetchMoreDraftNews
        ) {
          this.fetchDraftNews();
        } else if (
          newValue == "draft" &&
          this.draftNews.length == 0 &&
          this.canFetchMoreDraftNews
        ) {
          this.fetchDraftNews();
        }
      }
    }
  },
  computed: {
    groupedPublishedNews() {
      let group = [];

      this.publishedNews.forEach((_, index) => {
        if (index % 3 == 0 && index < this.publishedNews.length) {
          let new_array = this.publishedNews.slice(
            index,
            Math.min(index + 3, this.publishedNews.length)
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
    groupedDraftNews() {
      let group = [];

      this.draftNews.forEach((_, index) => {
        if (index % 3 == 0 && index < this.draftNews.length) {
          let new_array = this.draftNews.slice(
            index,
            Math.min(index + 3, this.draftNews.length)
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
      let newsCount = 0;

      switch (this.tab) {
        case "published":
          newsCount = this.publishedNewsPagination.total_objects;
          break;
        case "draft":
          newsCount = this.draftNewsPagination.total_objects;
          break;
      }

      let text = `${
        this.searching
          ? "Aguarde um momento, estamos pesquisando por publicação"
          : `Encontramos <b>${newsCount}</b> resultado(s) para a busca `
      }
        ${this.filters.query ? `<b>${this.filters.query}</b> ` : ""}
        ${this.filters.date ? `do dia <b>${this.filters.date}</b>` : ""}
      `;

      return `<p>${text}</p>`;
    },

    canFetchMorePublishedNews() {
      return (
        this.publishedNewsPagination.current_page <
        this.publishedNewsPagination.total_pages
      );
    },
    canFetchMoreDraftNews() {
      return (
        this.draftNewsPagination.current_page <
        this.draftNewsPagination.total_pages
      );
    }
  },
  methods: {
    filterByTag(tag) {
      this.$emit("filterByTag", tag);
    },

    fetchPublishedNews() {
      return new Promise((resolve, reject) => {
        if (!this.searching && this.canFetchMorePublishedNews) {
          this.$emit("searching", true);

          let { current_page, per_page } = this.publishedNewsPagination;
          let { query, date } = this.filters;

          NewsRequest.index(query, { date }, current_page, per_page)
            .then(res => {
              if (res) {
                if (res.data.pagination.current_page == 1) {
                  this.draftNews = res.data.objects;
                  this.publishedNews = res.data.objects;
                } else {
                  this.publishedNews = [
                    ...this.publishedNews,
                    ...res.data.objects
                  ];
                }

                this.publishedNewsPagination = res.data.pagination;
                this.publishedNewsPagination.current_page += 1;
              }

              this.hasNewNews = false;
              this.$emit("searching", false);
              resolve();
            })
            .catch(err => {
              if (err) {
                if (err.response && err.response.data.error.message) {
                  this.$q.notify({
                    message: err.response.data.error.message,
                    icon: "info",
                    color: "negative"
                  });
                } else {
                  this.$q.notify({
                    message:
                      "Ocorreu um erro ao tentar buscar as notícias. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                    icon: "info",
                    color: "negative"
                  });
                }

                this.hasNewNews = false;
                this.$emit("searching", false);
                resolve();
              }
            });
        } else {
          resolve();
        }
      });
    },
    fetchDraftNews() {
      return new Promise((resolve, reject) => {
        if (!this.searching && this.canFetchMoreDraftNews) {
          this.$emit("searching", true);

          let { current_page, per_page } = this.draftNewsPagination;
          let { query, date } = this.filters;

          NewsRequest.index(
            query,
            { date, published: false },
            current_page,
            per_page
          )
            .then(res => {
              if (res) {
                if (res.data.pagination.current_page == 1) {
                  this.draftNews = res.data.objects;
                } else {
                  this.draftNews = [...this.draftNews, ...res.data.objects];
                }

                this.draftNewsPagination = res.data.pagination;
                this.draftNewsPagination.current_page += 1;
              }

              this.$emit("searching", false);
              resolve();
            })
            .catch(err => {
              if (err) {
                if (err.response && err.response.data.error.message) {
                  this.$q.notify({
                    message: err.response.data.error.message,
                    icon: "info",
                    color: "negative"
                  });
                } else {
                  this.$q.notify({
                    message:
                      "Ocorreu um erro ao tentar buscar as notícias. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                    icon: "info",
                    color: "negative"
                  });
                }

                this.$emit("searching", false);
                resolve();
              }
            });
        } else {
          resolve();
        }
      });
    },
    async publishedNewsInfiniteScroll(index, done) {
      console.log("publishedNewsInfiniteScroll");
      await this.fetchPublishedNews();
      done();
    },
    async draftNewsInfiniteScroll(index, done) {
      console.log("draftNewsInfiniteScroll");
      await this.fetchDraftNews();
      done();
    },

    onPublish() {
      this.draftNewsPagination = {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      };
      setTimeout(() => {
        this.hasNewNews = true;
        this.fetchDraftNews();
      }, 500);
    },
    fetchFirstPageOfPublishedNews() {
      this.publishedNewsPagination = {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      };
      this.fetchPublishedNews();
    },
    fetchFirstPageOfNewDraftNews() {
      this.draftNewsPagination = {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      };
      this.fetchDraftNews();
    },

    generateRatio(row, col) {
      return row % 2 == 0 ? (col == 0 ? "1" : "2") : col == 2 ? "1" : "2";
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
