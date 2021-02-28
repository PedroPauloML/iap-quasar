import { date as qDate } from "quasar";

export default ({ app, router, store, Vue }) => {
  Vue.mixin({
    computed: {
      userSigned() {
        return (
          !!store.state.user.user &&
          Object.keys(store.state.user.user).length > 0
        );
      }
    },
    methods: {
      parseDateToPicker(date) {
        if (!date) return null;
        let format;

        if (date.search(/\d{4}-\d{2}-\d{2}/) == 0) format = "YYYY-MM-DD";
        if (date.search(/\d{2}\/\d{2}\/\d{4}/) == 0) format = "DD/MM/YYYY";

        return qDate.formatDate(qDate.extractDate(date, format), "YYYY/MM/DD");
      },
      parseDateToInput(date, dateFormat = "YYYY/MM/DD") {
        if (!date) return null;
        return qDate.formatDate(
          qDate.extractDate(date, dateFormat),
          "DD/MM/YYYY"
        );
      },
      parseTimestamp(datetime) {
        if (!datetime) return null;
        return qDate.formatDate(
          qDate.extractDate(datetime, "YYYY-MM-DDTHH:mm:ss"),
          "DD/MM/YYYY HH:mm:ss"
        );
      }
    }
  });
};
