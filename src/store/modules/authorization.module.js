import axios from "axios";

function authHeader() {
  let header = {}

  if (localStorage.getItem('token')) {
    header = {Authorization: 'Bearer ' + localStorage.getItem('token')}
  }

  return header
}

export default {
  namespaced: true,
  state: {
    isAuthenticated : false,
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated
    }
  },
  mutations: {
    authentication(state, payload) {
      state.isAuthenticated = payload
    }
  },
  actions: {
    async authRequest(context, user) {
      const form_data = new FormData()
      form_data.append("username", user.username)
      form_data.append("password", user.password)

      let res = await axios.post(
        'http://127.0.0.1:8000/token',
        form_data,
      )

      localStorage.setItem('token', res.data['access_token'])
    },
    async getUser(context) {
      let res

      try {
        res = await axios.get(
          'http://127.0.0.1:8000/user',
          {
            params: {some: 'some value'},
            headers: authHeader()
          }
        )
      } catch (e) {
        console.log(e)
        res = e.response
      }

      if (res.status === 200) {
        return true
      } else {
        return false
      }
    }
  }
}