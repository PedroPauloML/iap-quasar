<template>
  <div id="verse-of-day">
    <VerseOfDay
      :verse="verse_of_day.verse"
      :reference="verse_of_day.reference"
      :date="verse_of_day.date"
      :commentaries_count="verse_of_day.commentaries_count"
      class="mb-5"
    />
  </div>
</template>

<script>
import VerseOfDay from "../../components/verse_of_day/Component";

export default {
  components: { VerseOfDay },
  data() {
    return {
      back_router: "/news",
      verse_of_day: {
        verse: `Elevo os meus olhos para os montes; de onde me vem o socorro? O meu
        socorro vem do Senhor, que fez os céus e a terra. Não deixará vacilar o
        teu pé; aquele que te guarda não dormitará.`,
        reference: `Salmos 121:1-3`,
        date: "2020-07-05T03:37:00-03:00",
        commentaries_count: 2,
      },
    };
  },
  created() {
    this.$emit("setBackRoute", { name: "verses_of_day" });
  },
  beforeRouteLeave(to, from, next) {
    this.$emit("setBackRoute", null);
    next();
  },
};
</script>

<style></style>
