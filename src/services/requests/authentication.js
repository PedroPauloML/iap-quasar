import Vue from "vue";
import { Cookies } from "quasar";

export default class Authentication {
  static sign_in(email, password) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .post("/authentication/sign_in", { email, password })
        .then(res => {
          if (res) {
            // Set session token to headers for each axios request
            Vue.prototype.$axios.defaults.headers.common["token"] =
              res.data.token;

            // Set session token to browser cookies for persist user session
            Cookies.set("token", res.data.token, { path: "/" });

            resolve(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static sign_up(params) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .post("/authentication/sign_up", params)
        .then(res => {
          if (res) {
            resolve(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static confirm_email(token) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .post(`/authentication/confirm_email/${token}`)
        .then(res => {
          if (res) {
            resolve(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static resend_confirmation_mail(email) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .post(`/authentication/resend_confirmation_mail?email=${email}`)
        .then(res => {
          if (res) {
            resolve(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
