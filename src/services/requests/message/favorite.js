import Vue from "vue";

export default class Favorite {
  static index(page, per_page) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .get(`/messages/favorites`, {
          params: { page, per_page }
        })
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

  static create(message_id, params) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .post(`/messages/${message_id}/favorites`, { favorite: params })
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

  static destroy(message_id, id) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .delete(`/messages/${message_id}/favorites/${id}`)
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
