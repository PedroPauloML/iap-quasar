import Vue from "vue";
import { Cookies } from "quasar";

export default class Authentication {
  static login(cpf, password) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .post("/login", {
          user: {
            cpf,
            password,
            admin: "true"
          }
        })
        .then(res => {
          if (res) {
            // Set session token to headers for each axios request
            Vue.prototype.$axios.defaults.headers.common["Token"] =
              res.data.session_token;

            // Set session token to browser cookies for persist user session
            Cookies.set("token", res.data.session_token, { path: "/" });

            resolve(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
