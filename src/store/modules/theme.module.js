export default {
  namespaced: true,
  state: {
    variableNames: [
      '--bg-color',
      '--panel-color',
      '--border-color',
      '--primary-color',
      '--additional-color',
      '--contrast-color',
      '--font-color',
      '--contrast-font-color',
    ],
    defaultTheme: {},
    lightTheme: {
      '--bg-color': 'white',
      '--panel-color': 'lightblue',
      '--border-color': 'grey',
      '--primary-color': 'grey',
      '--additional-color': 'blue',
      '--contrast-color': 'red',
      '--font-color': 'black',
      '--contrast-font-color': 'white',
    },
    themeName: localStorage.getItem('themeName') ? localStorage.getItem('themeName') : 'default',
  },
  getters: {
    themeColors(state) {
      if (state.themeName === 'default') {
        return state.defaultTheme
      } else {
        return state.lightTheme
      }
    },
  },
  mutations: {
    setDefaultTheme(state, payload) {
      for (let key in payload) {
        state.defaultTheme[key] = payload[key]
      }
    },
    changeActiveThemeName(state, payload) {
      localStorage.setItem('themeName', payload)
      state.themeName = payload
    }
  },
  actions: {
    getColors(context) {
      let style = getComputedStyle(document.documentElement)
      let colors = {}

      for (let name of context.state.variableNames) {
        colors[name] = style.getPropertyValue(name)
      }

      context.commit('setDefaultTheme', colors)
      context.dispatch('setTheme')
    },
    changeTheme(context, themeName) {
      context.commit('changeActiveThemeName', themeName)

      context.dispatch('setTheme')
    },
    setTheme(context) {
      let style = document.documentElement.style
      let colors = context.state.themeName === 'default' ? context.state.defaultTheme : context.state.lightTheme

      for (let key in colors) {
        style.setProperty(key, colors[key])
      }
    }
  },
}