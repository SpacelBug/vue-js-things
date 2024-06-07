import { createStore } from 'vuex'
import themeModule from "@/store/modules/theme.module";
import authorizationModule from "@/store/modules/authorization.module";

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    themeModule,
    authorizationModule
  }
})
