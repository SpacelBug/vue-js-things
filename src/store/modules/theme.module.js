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
    themes: {
      default: [],
      light: ['white', 'lightblue', 'grey', 'grey', 'blue', 'red', 'black', 'white'],
      green: ['#2f4736', '#5c7a65', '#353b37', '#a5cfb3', '#d4ffe2', '#ffecd4', 'black', 'white'],
    },
    themeName: localStorage.getItem('themeName') ? localStorage.getItem('themeName') : 'default',
  },
  getters: {
    themes(state) {
      return state.themes
    },
  },
  mutations: {
    setDefaultTheme(state, payload) {
      for (let color of payload) {
        state.themes['default'].push(color)
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
        colors[name] = null
      }

      for (let name of context.state.variableNames) {
        colors[name] = style.getPropertyValue(name)
      }

      console.log(Object.values(colors))

      context.commit('setDefaultTheme', Object.values(colors))

      context.dispatch('setTheme')
    },
    changeTheme(context, themeName) {
      context.commit('changeActiveThemeName', themeName)

      context.dispatch('setTheme')
    },
    setTheme(context) {
      let themeName = context.state.themeName

      if (context.state.themes.hasOwnProperty(themeName)) {
        let style = document.documentElement.style
        let colors = []

        if (themeName === 'default') {
          colors = context.state.themes['default']
        } else {
          colors = context.state.themes[themeName]
        }

        for (let index in context.state.variableNames) {
          style.setProperty(context.state.variableNames[index], colors[index])
        }
      } else {
        console.debug('Theme doesnt exist')
      }
    }
  },
}