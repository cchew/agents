import { createStore } from 'vuex'
import auth from './modules/auth'
import tasks from './modules/tasks'
import lists from './modules/lists'

export default createStore({
  modules: {
    auth,
    tasks,
    lists
  }
})