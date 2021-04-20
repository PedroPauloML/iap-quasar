import Vue from "vue";

export default class News {
  static index(query, options, page, per_page) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$axios
        .get(`/news`, {
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
        .get(`/news/${id}`)
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
        .post(`/news`, params)
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
        .put(`/news/${id}`, params)
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
        .put(`/news/${id}/publish`)
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
        .delete(`/news/${id}`)
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
