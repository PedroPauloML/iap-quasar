// import axios from "axios";
import { Cookies } from "quasar";
import UserRequest from "src/services/requests/user";

export default ({ router, store, Vue }) => {
  router.beforeEach(async (to, from, next) => {
    if (!store.state.user.user) {
      let token;
      const cookie_options = { path: "/" };

      if (to.query.st) {
        token = to.query.st;
        let query = to.query;
        delete query.st;
        Cookies.set("token", token, cookie_options);
        return router.replace({ query });
      } else {
        token = Cookies.get("token", cookie_options);
      }

      if (token) {
        await UserRequest.find_by_token(token)
          .then(res => {
            if (res) {
              Vue.prototype.$axios.defaults.headers.common["Session-Token"] =
                res.data.token;
              // Set session token to browser cookies for persist user session
              Cookies.set("token", res.data.token, cookie_options);
              store.dispatch("user/setUser", res.data);

              // if (to.name == "login") {
              //   Notify.create({
              //     message: "Você já está logado",
              //     icon: "check",
              //     color: "positive"
              //   });

              //   if (router.currentRoute.params.redirect_to) {
              //     if (router.currentRoute.params.redirect_to != to.fullPath) {
              //       return router.push(router.currentRoute.params.redirect_to);
              //     }
              //   } else {
              //     return router.push({ name: "movements_index" });
              //   }
              // } else {
              //   if (router.currentRoute.params.redirect_to) {
              //     if (router.currentRoute.params.redirect_to != to.fullPath) {
              //       return router.push(router.currentRoute.params.redirect_to);
              //     }
              //   }
              // }
            }
          })
          .catch(err => {
            // if (to.name != "login") {
            //   Notify.create({
            //     message: "Faça login antes de continuar",
            //     icon: "assignment_ind",
            //     color: "secondary"
            //   });
            //   return router.push({
            //     name: "login",
            //     params: { redirect_to: to.fullPath }
            //   });
            // }
          });
      } else if (to.name != "login") {
        // Notify.create({
        //   message: "Faça login antes de continuar",
        //   icon: "assignment_ind",
        //   color: "secondary"
        // });
        // return router.push({
        //   name: "login",
        //   params: { redirect_to: to.fullPath }
        // });
      }
    } else {
      // await userRequest.permissions(store.state.user.user.id).then(res => {
      //   if (res) {
      //     store.dispatch("user/setPermissions", res.data);
      //     if (!store.getters["user/hasPermission"]("MV")) {
      //       Notify.create({
      //         message: `${store.state.user.user.name}, você não tem
      //           acesso a essa área. Por favor, entre em contato
      //           com o seu gestor.`,
      //         icon: "info",
      //         color: "negative"
      //       });
      //       store.dispatch("user/setUser", null);
      //       store.dispatch("user/setPermissions", null);
      //       axios.defaults.headers.common["Session-Token"] = null;
      //       Cookies.remove("token");
      //       router.push({
      //         name: "login",
      //         params: { redirect_to: to.fullPath }
      //       });
      //     }
      //   }
      // });
    }

    if (router.currentRoute.params.redirect_to) {
      if (router.currentRoute.params.redirect_to != to.fullPath) {
        return router.push(router.currentRoute.params.redirect_to);
      }
    }

    next();
  });
};
