import { date as qDate, copyToClipboard } from "quasar";

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
      parseFormRules(rules) {
        let newRules = rules.reduce((acc, val) => {
          let rules = [];

          if (val.required) {
            rules.push(v => !!v || `${val.name} é obrigatório(a)`);
          }

          if (val.extraRules) {
            val.extraRules.forEach(rule => rules.push(rule));
          }

          if (rules.length > 0) {
            if (val.namespace) {
              this.assignRecursive(acc, val.namespace, val.field, rules);
            } else {
              acc[val.field] = rules;
            }
          }
          return acc;
        }, {});
        return newRules;
      },
      parseDateToPicker(date) {
        if (!date) return "";
        let format;

        if (date.search(/\d{4}-\d{2}-\d{2}/) == 0) format = "YYYY-MM-DD";
        if (date.search(/\d{2}\/\d{2}\/\d{4}/) == 0) format = "DD/MM/YYYY";

        return qDate.formatDate(qDate.extractDate(date, format), "YYYY/MM/DD");
      },
      parseDateToInput(date) {
        if (!date) return "";
        let format;

        if (date.search(/\d{4}-\d{2}-\d{2}/) == 0) format = "YYYY-MM-DD";
        if (date.search(/\d{2}\/\d{2}\/\d{4}/) == 0) format = "DD/MM/YYYY";
        if (date.search(/\d{4}\/\d{2}\/\d{2}/) == 0) format = "YYYY/MM/DD";

        return qDate.formatDate(qDate.extractDate(date, format), "DD/MM/YYYY");
      },
      parseTimestamp(datetime) {
        if (!datetime) return null;
        return qDate.formatDate(
          qDate.extractDate(datetime, "YYYY-MM-DDTHH:mm:ss"),
          "DD/MM/YYYY HH:mm:ss"
        );
      },
      copyToClipboard(label, value) {
        if (value) {
          copyToClipboard(value)
            .then(() => {
              Notify.create({
                message: `<b>${label}</b> copiado para a área de transferência`,
                icon: "content_copy",
                html: true,
                color: "secondary",
                group: false,
                actions: [
                  {
                    label: "Fechar",
                    color: "white",
                    handler: () => {}
                  }
                ]
              });
            })
            .catch(() => {
              Notify.create({
                message: `Ops! Ocorreu um erro ao tentar copiar o(a) <b>${label}</b> para a área de transferência.`,
                icon: "info",
                html: true,
                color: "warning"
              });
            });
        }
      }
    }
  });
};
