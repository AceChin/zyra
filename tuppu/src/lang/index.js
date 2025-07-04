import { createI18n } from "vue-i18n";

// 本地语言包
import enLocale from "./package/en";
import zhCnLocale from "./package/zh-cn";

const language = window.localStorage.getItem("language") || "en-US";
const messages = {
  "zh-CN": {
    ...zhCnLocale,
  },
  "en-US": {
    ...enLocale,
  },
};
const i18n = createI18n({
  legacy: false,
  locale: language,
  messages: messages,
  globalInjection: true,
});

export const translate = (localeKey) => {
  const locale = localStorage.getItem("language") || "en-US";
  const hasKey = i18n.global.te(localeKey, locale);
  const translatedStr = i18n.global.t(localeKey);
  if (hasKey) {
    return translatedStr;
  }
  return localeKey;
};

export default i18n;
