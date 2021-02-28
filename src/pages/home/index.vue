<template>
  <div id="home">
    <div class="flex justify-between align-center q-mb-lg">
      <span class="text-h6">Últimas Notícias</span>

      <router-link :to="{ name: 'news' }" v-slot="{ href }">
        <q-btn :to="href" height="100%" text link color="primary">
          Ver mais
        </q-btn>
      </router-link>
    </div>
    <div class="row q-col-gutter-lg q-mb-lg">
      <div
        v-for="(news, group_index) in grouped_news"
        :key="group_index"
        class="col-12 col-sm-6"
      >
        <div v-if="Array.isArray(news)" class="full-height row">
          <div
            class="col"
            v-for="(single_new, i) in news"
            :key="i"
            :class="{ 'col-12': true, 'self-end': i == news.length - 1 }"
          >
            <News
              :id="single_new.id"
              :title="single_new.title"
              :caption="single_new.caption"
              :image="{
                url: single_new.image,
                ratio: '2.1'
              }"
            />
          </div>
        </div>
        <News
          v-else
          :id="news.id"
          :title="news.title"
          :caption="news.caption"
          :image="{
            url: news.image,
            ratio: '1'
          }"
        />
      </div>
    </div>

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
    <div v-else>
      <q-card class="q-mb-lg">
        <q-card-section>
          <p class="q-mb-none">
            Não temos nenhuma programação para os próximos dias. Mas fique
            atento, em breve estaremos divulgando as nossas novas atividades.
          </p>
        </q-card-section>
      </q-card>
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

    <Message
      v-if="message"
      :id="message.id"
      :title="message.title"
      :caption="message.caption"
      :content="message.content"
      :author="message.author"
      :published_at="message.published_at"
      :tags="Array.from(new Set(message.tags))"
      :metadata="{ read_time: true }"
      class="mb-10"
    />
  </div>
</template>

<script>
import News from "../../components/news/Component";
import VerseOfDay from "../../components/verse_of_day/Component";
import Message from "../../components/messages/Component";
import Schedule from "../../components/schedules/Component";

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
      message: null
    };
  },
  watch: {
    verses_of_day_page() {
      setTimeout(() => {
        this.setCurrentVerseContainerHeight();
      }, 200);
    }
  },
  created() {
    this.$store.dispatch("news/loadNews").then(() => {
      this.news_list = this.$store.state.news.news.slice(0, 3);
    });

    this.$store.dispatch("messages/loadMessages").then(() => {
      this.message = this.$store.state.messages.messages[0];
    });

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
      const group_by = this.$vuetify.breakpoint.mdAndUp
        ? 3
        : this.$vuetify.breakpoint.smAndUp
        ? 2
        : 1;

      return this.schedules_list.reduce((accumulator, item, index) => {
        index % group_by
          ? accumulator[accumulator.length - 1].push(item)
          : accumulator.push([item]);
        return accumulator;
      }, []);
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
    }
  }
};
</script>

<style lang="scss">
#home {
  max-width: 1200px;
  margin: 0 auto;
}

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
