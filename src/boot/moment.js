import moment from "moment";
moment.locale("pt-BR");

export default ({ Vue }) => {
  Vue.prototype.$moment = moment;
};
