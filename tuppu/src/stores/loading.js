import { defineStore } from "pinia";


export const useLoadingStore = defineStore("loading", () => {


  return {

  };
});

export const piniaLoadingPlug = ({ store }) => {
  store.$onAction(({ after, onError, store, name }) => {

    const loadingStore = useLoadingStore()
    loadingStore[`${store.$id}/${name}`] = true
    after(() => {
      loadingStore[`${store.$id}/${name}`] = false
    })
    onError(() => {
      loadingStore[`${store.$id}/${name}`] = false
    })
  })
}