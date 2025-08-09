import axios from "axios";
import { useWeb3Store } from "../stores";
import { showToast } from "vant";
import { ApiBusinessError, ApiAuthError, ApiServerError } from "./error";
import { translate } from "../lang";

let timer = 0;

export const delay = (second) => (data) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, second * 1000);
  });



// 创建axios实例
const service = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API, // api的base_url
  baseURL: '',
  timeout: 200000, // 请求超时时间
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const accessToken = window.sessionStorage.getItem("accessToken");
    config.headers.Authorization = accessToken ? ('Bearer ' + accessToken) : "";
    const language = window.localStorage.getItem("language") || "en-US";
    config.headers["Accept-Language"] = language;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      const url = response.config.url;
      // 统一处理错误
      if (res.code == 402) {
        // const appStore = useAppStore();
        // appStore.setLoggedIn(false);
        const language = localStorage.language;
        showToast(translate("tips.not_logged_in"));
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem("language", language);
        setTimeout(() => {
          location.reload();
        }, 1000);
        throw new ApiAuthError(url);
      }

      showToast(res.message || translate("tips.system_error"));
      if (res.code == 40201 || res.code == 401) {
        const web3Store = useWeb3Store();

        web3Store.refresh()

        // appStore.setLoggedIn(false);
        window.sessionStorage.removeItem("accessToken");
        window.sessionStorage.removeItem("refreshToken");

        // (window as any).web3auth.logout()
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
        // router.push({ path: '/' });
        window.location.pathname = '/'
        throw new ApiAuthError(url);
      }
      throw new ApiBusinessError(
        res.message || translate("tips.system_error"),
        `${res.code}`,
        url,
        response.data
      );
    } else {
      return response.data.data || {};
    }
  },
  (error) => {
    showToast(error.response.data.message);
    console.log(error);

    // 统一处理错误
    throw new ApiServerError(error.response.data.code, error.response.url);
  }
);
// 封装get请求
export const get = async ( url, params, notLoad ) => {
  // const hasToken = !!window.localStorage.getItem("accessToken")
  // if(!hasToken && !/\/auth\/nonce|\/auth\/authorize/.test(url)) {
  //   throw new Error()
  // }
  // const appStore = useAppStore();
  if (!notLoad) {
    clearTimeout(timer);
    // appStore.showLoading();
  }
  const res = await service
    .get(url, { params })
    .finally(() => {
      if (!notLoad) {
        timer = setTimeout(() => {
          // appStore.hideLoading();
        }, 500);
      }
    });
  if (!notLoad) {
    await delay(0.6)(0);
  }
  return res;
};
// 封装post请求
export const post = async (url, data, notLoad) => {
  // const appStore = useAppStore();
  if (!notLoad) {
    clearTimeout(timer);
    // appStore.showLoading();
  }
  const res = await service.post(url, data).finally(() => {
    if (!notLoad) {
      timer = setTimeout(() => {
        // appStore.hideLoading();
      }, 600);
    }
  });
  return res;
};

export default service;
