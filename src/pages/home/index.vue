<template>
  <div id="home" class="container">
    <div class="flex justify-between align-center q-mb-lg">
      <span class="text-h6">Últimas Notícias</span>

      <router-link :to="{ name: 'news' }" v-slot="{ href }">
        <q-btn :to="href" height="100%" text link color="primary">
          Ver mais
        </q-btn>
      </router-link>
    </div>

    <transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
      mode="out-in"
    >
      <div v-if="fetchingNews">
        <q-linear-progress indeterminate color="primary"></q-linear-progress>
      </div>

      <div v-else-if="news_list.length > 0" class="row q-col-gutter-lg q-mb-lg">
        <div
          v-for="(news, group_index) in grouped_news"
          :key="group_index"
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
              <News :data="single_new" :coverRatio="2.1" no-content />
            </div>
          </div>
          <News v-else :data="news" :coverRatio="1" no-content />
        </div>
      </div>

      <div v-else class="flex no-wrap items-center justify-center q-mb-lg">
        <q-img :src="newsSRC" width="40px" class="q-mr-lg" />
        <span class="text-h6">
          Nenhuma notícia no momento. Volte mais tarde.
        </span>
      </div>
    </transition>

    <div class="flex justify-between align-center q-mb-md">
      <span class="text-h6">Nossa Agenda</span>

      <router-link :to="{ name: 'schedules' }" v-slot="{ href }">
        <q-btn :to="href" height="100%" text link color="primary">
          Ver mais
        </q-btn>
      </router-link>
    </div>

    <q-carousel
      v-if="schedules_list.length > 0"
      v-model="schedule_page"
      class="mb-5"
      height="auto"
      hide-delimiters
      hide-delimiter-background
      :continuous="false"
    >
      <q-carousel-item
        v-for="(schedules, index) in grouped_schedules"
        :key="index"
        class="px-8"
      >
        <div class="row">
          <div
            v-for="(schedule, i) in schedules"
            :key="index * 3 + i"
            class="col-12 col-sm-6 col-md-4"
          >
            <Schedule
              :id="schedule.id"
              :title="schedule.title"
              :description="schedule.description"
              :date_start="schedule.date_start"
              :date_end="schedule.date_end"
              :image="schedule.image"
              :location="schedule.location"
              mini
              class="ma-2"
            />
          </div>
        </div>
      </q-carousel-item>
    </q-carousel>
    <div v-else class="flex no-wrap items-center justify-center q-mb-lg">
      <q-img :src="scheduleSRC" width="40px" class="q-mr-lg" />
      <span class="text-h6">
        Não temos nenhuma programação para os próximos dias. Mas fique atento,
        em breve estaremos divulgando as nossas novas atividades.
      </span>
    </div>

    <div class="flex justify-between align-center q-mb-lg">
      <span class="text-h6">Versículos do Dia</span>

      <router-link :to="{ name: 'verses_of_day' }" v-slot="{ href }">
        <q-btn :to="href" height="100%" text link color="primary">
          Ver mais
        </q-btn>
      </router-link>
    </div>
    <q-carousel
      v-model="verses_of_day_page"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="primary"
      control-type="push"
      arrows
      class="bg-transparent q-mb-lg"
      :height="`${currentVerseContainerHeight}px`"
    >
      <q-carousel-slide
        v-for="(verse_of_day, index) in verses_of_day_list"
        :key="index"
        :name="index"
      >
        <VerseOfDay
          :ref="`verseOfDay${index + 1}`"
          :verse="verse_of_day.verse"
          :reference="verse_of_day.reference"
          :date="verse_of_day.date"
          :route="verse_of_day.route"
          class="q-mx-lg"
          no-actions
          no-commentaries
        />
      </q-carousel-slide>
    </q-carousel>

    <transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
      mode="out-in"
    >
      <div v-if="fetchingMessages">
        <q-linear-progress indeterminate color="primary" />
      </div>

      <div v-else-if="messages.length > 0">
        <Message
          v-for="(message, index) in messages"
          :key="index"
          :data="message"
          :metadata="{ read_time: true }"
          class="q-mb-lg"
        />
      </div>

      <div v-else class="flex no-wrap items-center justify-center">
        <q-icon name="auto_stories" size="40px" class="q-mr-lg" />
        <span class="text-h6">
          Nenhuma mensagem no momento. Volte mais tarde.
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import NewsRequest from "src/services/requests/news";
import MessageRequest from "src/services/requests/message";

import News from "../../components/news/Component";
import VerseOfDay from "../../components/verse_of_day/Component";
import Message from "../../components/messages/Component";
import Schedule from "../../components/schedules/Component";

import newsSRC from "assets/icons/news.svg";
import scheduleSRC from "assets/icons/schedule.svg";

export default {
  components: { News, VerseOfDay, Message, Schedule },
  data() {
    return {
      news_list: [],
      schedules_list: [],
      schedule_page: 0,
      verses_of_day_list: [],
      verses_of_day_page: 0,
      currentVerseContainerHeight: 450,

      messages: [],
      messagesPagination: {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      },

      // Loading variables
      fetchingNews: false,
      fetchingMessages: false,

      // Icons
      newsSRC,
      scheduleSRC
    };
  },
  watch: {
    verses_of_day_page() {
      setTimeout(() => {
        this.setCurrentVerseContainerHeight();
      }, 200);
    }
  },
  async created() {
    await this.fetchNews();

    this.$store.dispatch("schedules/loadSchedules").then(() => {
      this.schedules_list = this.$store.state.schedules.schedules.filter(el => {
        return el.date_end ? this.$moment(el.date_end) > this.$moment() : false;
      });
    });

    let verses = [];
    for (let index = 0; index < 10; index++) {
      verses = verses.concat({
        verse: `Elevo os meus olhos para os montes; de onde me vem o socorro? O meu
        socorro vem do Senhor, que fez os céus e a terra. Não deixará vacilar o
        teu pé; aquele que te guarda não dormitará.`,
        reference: `Salmos 121:1-3`,
        date: this.$moment("2020-07-05T03:37:00-03:00")
          .subtract(index, "days")
          .format(),
        route: { name: "verse_of_day", params: { id: 10 - index } }
      });
    }
    this.verses_of_day_list = verses;

    await this.fetchMessages();
  },
  mounted() {
    this.setCurrentVerseContainerHeight();
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
    grouped_schedules() {
      const group_by = this.$q.screen.gt.sm ? 3 : this.$q.screen.gt.xs ? 2 : 1;

      return this.schedules_list.reduce((accumulator, item, index) => {
        index % group_by
          ? accumulator[accumulator.length - 1].push(item)
          : accumulator.push([item]);
        return accumulator;
      }, []);
    },
    canFetchMoreMessages() {
      return (
        this.messagesPagination.current_page <
        this.messagesPagination.total_pages
      );
    }
  },
  methods: {
    generateRatio(row, col) {
      return row % 2 == 0 ? (col == 0 ? "1" : "2") : col == 2 ? "1" : "2";
    },

    setCurrentVerseContainerHeight() {
      let currentVerseOfDay = this.$refs[
        `verseOfDay${this.verses_of_day_page + 1}`
      ];
      let height = currentVerseOfDay
        ? currentVerseOfDay[0]?.$el?.clientHeight
        : 300;
      this.currentVerseContainerHeight = (height || 300) + 40;
    },

    fetchNews() {
      if (!this.fetchingNews) {
        this.fetchingNews = true;

        let current_page = 1;
        let per_page = 3;

        NewsRequest.index("", {}, current_page, per_page)
          .then(res => {
            if (res) {
              this.news_list = res.data.objects;
            }

            this.fetchingNews = false;
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

              this.fetchingNews = false;
            }
          });
      }
    },

    fetchMessages() {
      if (!this.fetchingMessages && this.canFetchMoreMessages) {
        this.fetchingMessages = true;

        let { current_page, per_page } = this.messagesPagination;

        MessageRequest.index("", {}, current_page, per_page)
          .then(res => {
            if (res) {
              this.messages = res.data.objects;
              this.messagesPagination = res.data.pagination;
              this.messagesPagination.current_page += 1;
            }

            this.fetchingMessages = false;
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

              this.fetchingMessages = false;
            }
          });
      }
    }
  }
};
</script>

<style lang="scss">
.v-window__prev,
.v-window__next {
  margin: 0;
  transform: scale(0.7);
}

.q-carousel__prev-arrow--horizontal {
  left: 0;
}
.q-carousel__next-arrow--horizontal {
  right: 0;
}
</style>
