import { createI18n } from "vue-i18n";

// 本地语言包
import enLocale from "./package/en";
import zhCnLocale from "./package/zh-cn";
import zhTwLocale from "./package/zh-tw";
import idIDLocale from "./package/id-id";
import viVNLocale from "./package/vi-vn";
import thTHLocale from "./package/th-th";
import koKRLocale from "./package/ko-kr";
import jaJPLocale from "./package/ja-jp";

const language = window.localStorage.getItem("language") || "en-US";
const messages = {
  "zh-CN": {
    ...zhCnLocale,
  },
  "en-US": {
    ...enLocale,
  },
  "zh-TW": {
    ...zhTwLocale
  },
  "id-ID": {
    ...idIDLocale
  },
  "vi-VN": {
    ...viVNLocale
  },
  "th-TH": {
    ...thTHLocale
  },
  "ko-KR": {
    ...koKRLocale
  },
  "ja-JP": {
    ...jaJPLocale
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
