<template>
  <div id="messages">
    <div v-if="value.search || value.date" class="flex flex-wrap q-mb-lg">
      <span v-if="searching" class="q-mr-sm text-nowrap">
        Aguarde um momento, estamos pesquisando por
      </span>
      <span v-else class="q-mr-sm text-nowrap">
        Encontramos {{ messages.length }} resultados para a busca
      </span>
      <span
        v-if="value.search"
        class="text-truncate-1-line q-mr-sm text-weight-medium"
      >
        {{ value.search }}
      </span>

      <span v-if="value.date" class="q-mr-sm">
        no dia
      </span>
      <span
        v-if="value.date"
        class="text-truncate-1-line text-weight-medium q-mr-sm"
      >
        {{ $moment(value.date).format("DD/MM/YYYY") }}
      </span>
    </div>

    <div v-if="searching">
      <q-linear-progress indeterminate color="primary" />
    </div>
    <div v-else>
      <Message
        v-for="(message, index) in messages"
        :key="index"
        :id="message.id"
        :title="message.title"
        :caption="message.caption"
        :content="message.content"
        :author="message.author"
        :published_at="message.published_at"
        :tags="Array.from(new Set(message.tags))"
        :metadata="{ read_time: true }"
        @filterMessages="search => (value.search = search)"
        @onDestroy="loadMessages"
        class="q-mb-lg"
      />
    </div>
  </div>
</template>

<script>
import Message from "../../components/messages/Component";

export default {
  components: { Message },
  props: {
    value: {
      search: String,
      date: String,
      required: true
    },
    searching: Boolean
  },
  data() {
    return {
      messages: [],
      list_of_messages: []
    };
  },
  created() {
    this.$store.dispatch("messages/loadMessages").then(this.loadMessages);
  },
  watch: {
    value: {
      handler: function() {
        this.filterMessages(this.value);
      },
      deep: true
    }
  },
  methods: {
    loadMessages() {
      this.messages = this.$store.state.messages.messages;
      if (this.$route.query.search)
        this.value.search = this.$route.query.search;
      if (this.$route.query.date) this.value.date = this.$route.query.date;
      this.filterMessages(this.value);
    },
    filterMessages(filters) {
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

          this.messages = this.$store.state.messages.messages.filter(
            message =>
              (message.title
                .toLocaleLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(search) ||
                message.caption
                  .toLocaleLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .includes(search) ||
                message.tags.find(tag =>
                  tag
                    .toLocaleLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .includes(search)
                )) &&
              (date
                ? this.$moment(message.metadata.published_at).format(
                    "DD/MM/YYYY"
                  ) == date
                : true)
          );

          this.$emit("searching", false);
        }, 1000);
      }
    }
  }
};
</script>

<style></style>
