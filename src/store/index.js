import Vue from "vue";
import Vuex from "vuex";

import user from "./user";
import news from "./news";
import messages from "./messages";
import schedules from "./schedules";
import integrants from "./integrants";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      user,
      news,
      messages,
      schedules,
      integrants
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  });

  return Store;
}
