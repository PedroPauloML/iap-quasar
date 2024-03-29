<template>
  <div id="messages">
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
          <div v-if="hasNewMessages" class="full-width text-center q-mb-lg">
            <q-btn
              label="Carregar novas notícias"
              color="white"
              text-color="black"
              class="q-ma-xs"
              rounded
              @click="fetchFirstPageOfPublishedMessages"
            />
          </div>
        </transition>

        <div v-if="searching" class="q-mb-lg">
          <q-linear-progress indeterminate color="primary" />
        </div>

        <transition
          enter-active-class="animated fadeInDown"
          leave-active-class="animated fadeOutUp"
          mode="out-in"
        >
          <q-infinite-scroll
            @load="publishedMessagesInfiniteScroll"
            :offset="250"
            :disable="!canFetchMorePublishedMessages"
          >
            <div
              v-if="publishedMessages.length > 0"
              class="row q-col-gutter-lg q-mb-lg"
            >
              <Message
                v-for="(message, index) in publishedMessages"
                :key="index"
                :data="message"
                :metadata="{ read_time: true }"
                @filterByTag="filterByTag"
                @onDestroy="fetchFirstPageOfPublishedMessages"
                class="q-mb-lg"
              />
            </div>
            <div
              v-else-if="filters.date == '' && filters.query == ''"
              class="flex no-wrap items-center justify-center"
            >
              <q-icon name="auto_stories" size="40px" class="q-mr-lg" />
              <span class="text-h6">
                Nenhuma mensagem no momento. Volte mais tarde.
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
        <div v-if="searching">
          <q-linear-progress indeterminate color="primary" />
        </div>

        <q-infinite-scroll
          @load="draftMessagesInfiniteScroll"
          :offset="250"
          :disable="!canFetchMoreDraftMessages"
        >
          <div
            v-if="draftMessages.length > 0"
            class="row q-col-gutter-lg q-mb-lg"
          >
            <Message
              v-for="(message, index) in draftMessages"
              :key="index"
              :data="message"
              :metadata="{ read_time: true }"
              @filterByTag="filterByTag"
              @onDestroy="fetchFirstPageOfDraftMessages"
              class="q-mb-lg"
            />
          </div>
          <div
            v-else-if="filters.date == '' && filters.query == ''"
            class="flex no-wrap items-center justify-center"
          >
            <q-icon name="auto_stories" size="40px" class="q-mr-lg" />
            <span class="text-h6">
              Nenhum rascunho de mensagem no momento. Você tem alguma nova
              mensagem para compartilhar?
            </span>
          </div>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import MessageRequest from "src/services/requests/message";

import Message from "../../components/messages/Component";

export default {
  components: { Message },
  props: {
    filters: {
      query: { type: String, required: true },
      date: { type: String, required: true }
    },
    searching: Boolean
  },
  data() {
    return {
      tab: "published",

      publishedMessages: [],
      publishedMessagesPagination: {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      },

      draftMessages: [],
      draftMessagesPagination: {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      },

      // Loading variables
      fetchingMessages: false,
      hasNewMessages: false
    };
  },
  created() {
    this.fetchPublishedMessages();
  },
  watch: {
    filters: {
      handler: function() {
        if (this.filters.date == "" && this.filters.query == "") {
          this.fetchFirstPageOfPublishedMessages();
          this.fetchFirstPageOfNewDraftMessages();
        } else {
          switch (this.tab) {
            case "published":
              this.fetchFirstPageOfPublishedMessages();
              break;
            case "draft":
              this.fetchFirstPageOfNewDraftMessages();
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
          this.publishedMessages.length == 0 &&
          this.canFetchMoreDraftMessages
        ) {
          this.fetchDraftMessages();
        } else if (
          newValue == "draft" &&
          this.draftMessages.length == 0 &&
          this.canFetchMoreDraftMessages
        ) {
          this.fetchDraftMessages();
        }
      }
    }
  },
  computed: {
    feedbackOfSearching() {
      let messagesCount = 0;

      switch (this.tab) {
        case "published":
          messagesCount = this.publishedMessagesPagination.total_objects;
          break;
        case "draft":
          messagesCount = this.draftMessagesPagination.total_objects;
          break;
      }

      let text = `${
        this.searching
          ? "Aguarde um momento, estamos pesquisando por publicação"
          : `Encontramos <b>${messagesCount}</b> resultado(s) para a busca `
      }
        ${this.filters.query ? `<b>${this.filters.query}</b> ` : ""}
        ${this.filters.date ? `do dia <b>${this.filters.date}</b>` : ""}
      `;

      return `<p>${text}</p>`;
    },
    canFetchMorePublishedMessages() {
      return (
        this.publishedMessagesPagination.current_page <
        this.publishedMessagesPagination.total_pages
      );
    },
    canFetchMoreDraftMessages() {
      return (
        this.draftMessagesPagination.current_page <
        this.draftMessagesPagination.total_pages
      );
    }
  },
  methods: {
    filterByTag(tag) {
      this.$emit("filterByTag", tag);
    },
    fetchPublishedMessages() {
      return new Promise((resolve, reject) => {
        if (!this.searching && this.canFetchMorePublishedMessages) {
          this.$emit("searching", true);

          let { current_page, per_page } = this.publishedMessagesPagination;
          let { query, date } = this.filters;

          MessageRequest.index(query, { date }, current_page, per_page)
            .then(res => {
              if (res) {
                if (res.data.pagination.current_page == 1) {
                  this.publishedMessages = res.data.objects;
                } else {
                  this.publishedMessages = [
                    ...this.publishedMessages,
                    ...res.data.objects
                  ];
                  // res.data.objects.forEach(obj =>
                  //   this.publishedMessages.push(obj)
                  // );
                }

                this.publishedMessagesPagination = res.data.pagination;
                this.publishedMessagesPagination.current_page += 1;
              }

              this.hasNewMessages = false;
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
                      "Ocorreu um erro ao tentar buscar as mensagens. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                    icon: "info",
                    color: "negative"
                  });
                }

                this.hasNewMessages = false;
                this.$emit("searching", false);
                resolve();
              }
            });
        } else {
          resolve();
        }
      });
    },
    fetchDraftMessages() {
      return new Promise((resolve, reject) => {
        if (!this.searching && this.canFetchMoreDraftMessages) {
          this.$emit("searching", true);

          let { current_page, per_page } = this.draftMessagesPagination;
          let { query, date } = this.filters;

          MessageRequest.index(
            query,
            { date, published: false },
            current_page,
            per_page
          )
            .then(res => {
              if (res) {
                if (res.data.pagination.current_page == 1) {
                  this.draftMessages = res.data.objects;
                } else {
                  this.draftMessages = [
                    ...this.draftMessages,
                    ...res.data.objects
                  ];
                }

                this.draftMessagesPagination = res.data.pagination;
                this.draftMessagesPagination.current_page += 1;
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
                      "Ocorreu um erro ao tentar buscar as mensagens. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
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
    async publishedMessagesInfiniteScroll(index, done) {
      console.log("publishedMessagesInfiniteScroll");
      await this.fetchPublishedMessages();
      done();
    },
    async draftMessagesInfiniteScroll(index, done) {
      console.log("draftMessagesInfiniteScroll");
      await this.fetchDraftMessages();
      done();
    },

    onPublish() {
      this.draftMessagesPagination = {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      };
      setTimeout(() => {
        this.hasNewMessages = true;
        this.fetchDraftMessages();
      }, 500);
    },
    fetchFirstPageOfPublishedMessages() {
      this.publishedMessagesPagination = {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      };
      this.fetchPublishedMessages();
    },
    fetchFirstPageOfNewDraftMessages() {
      this.draftMessagesPagination = {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      };
      this.fetchDraftMessages();
    }
  }
};
</script>

<style></style>
