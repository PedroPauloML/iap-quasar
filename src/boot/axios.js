import axios from "axios";
import { Notify } from "quasar";

const baseURL = process.env.API;

export default ({ router, store, Vue }) => {
  const axiosInstance = axios.create({
    baseURL,
    // timeout: 1000,
    headers: {
      post: {
        "Content-Type": "application/json"
      }
    }
  });
  // axiosInstance.defaults.timeout = 2500;

  axiosInstance.interceptors.request.use(
    function(config) {
      console.log(config);
      return config;
    },
    function(error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axiosInstance.interceptors.response.use(
    function(response) {
      console.log(response);
      return response;
    },
    function(error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        if (error.response.status == 401) {
          Notify.create({
            message: "Faça login antes de continuar",
            icon: "assignment_ind",
            color: "secondary"
          });

          // router.push({ name: "login" });
        }
      } else if (error.request) {
        Notify.create({
          message:
            "O servidor não nos respondeu... Aguarde um momento e tente novamente.",
          icon: "info",
          color: "yellow-10"
        });

        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      return Promise.reject(error);
    }
  );

  Vue.prototype.$axios = axiosInstance;
};
