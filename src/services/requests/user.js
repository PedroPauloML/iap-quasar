import Vue from "vue";

export default class User {
  static find_by_token(token) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .get(`/users/find_by_token`, { params: { token } })
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

  static update(id, params) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .put(`/users/${id}`, { user: params })
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
