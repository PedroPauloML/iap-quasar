import Vue from "vue";

export default class Message {
  static index(query, options, page, per_page) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .get(`/messages`, {
          params: { query, ...options, page, per_page }
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

  static find(id) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .get(`/messages/${id}`)
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

  static create(params) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .post(`/messages`, { message: params })
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
        .put(`/messages/${id}`, { message: params })
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

  static publish(id) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .put(`/messages/${id}/publish`)
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

  static destroy(id) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .delete(`/messages/${id}`)
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
