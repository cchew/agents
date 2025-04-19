import { v4 as uuidv4 } from 'uuid'

const state = {
  lists: [],
  loading: false,
  error: null
}

const getters = {
  allLists: (state) => state.lists,
  
  getListById: (state) => (id) => {
    return state.lists.find(list => list.id === id)
  },
  
  isLoading: (state) => state.loading,
  error: (state) => state.error
}

const actions = {
  fetchLists({ commit, rootGetters }) {
    commit('SET_LOADING', true)
    
    // For demo purposes, we're using local storage
    // In a real app, this would be a Firebase/API call
    try {
      const userId = rootGetters['auth/currentUser']?.uid
      let lists = []
      
      const savedLists = localStorage.getItem(`lists_${userId}`)
      if (savedLists) {
        lists = JSON.parse(savedLists)
      } else {
        // Default lists
        lists = [
          {
            id: 'default',
            name: 'Unassigned',
            icon: 'mdi-inbox',
            color: 'primary',
            createdAt: new Date().toISOString()
          }
        ]
        localStorage.setItem(`lists_${userId}`, JSON.stringify(lists))
      }
      
      commit('SET_LISTS', lists)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  addList({ commit, state, rootGetters }, list) {
    commit('SET_LOADING', true)
    try {
      const userId = rootGetters['auth/currentUser'].uid
      const newList = {
        id: uuidv4(),
        name: list.name,
        icon: list.icon || 'mdi-format-list-bulleted',
        color: list.color || 'primary',
        createdAt: new Date().toISOString()
      }
      
      const updatedLists = [...state.lists, newList]
      localStorage.setItem(`lists_${userId}`, JSON.stringify(updatedLists))
      
      commit('ADD_LIST', newList)
      return newList
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  updateList({ commit, state, rootGetters }, { id, updates }) {
    commit('SET_LOADING', true)
    try {
      const userId = rootGetters['auth/currentUser'].uid
      const listIndex = state.lists.findIndex(list => list.id === id)
      
      if (listIndex !== -1) {
        const updatedList = { ...state.lists[listIndex], ...updates }
        const updatedLists = [
          ...state.lists.slice(0, listIndex),
          updatedList,
          ...state.lists.slice(listIndex + 1)
        ]
        
        localStorage.setItem(`lists_${userId}`, JSON.stringify(updatedLists))
        commit('UPDATE_LIST', { id, updates })
        return updatedList
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  deleteList({ commit, state, rootGetters, dispatch }, id) {
    commit('SET_LOADING', true)
    try {
      const userId = rootGetters['auth/currentUser'].uid
      
      // Don't allow deleting the default list
      if (id === 'default') {
        throw new Error('Cannot delete the default list')
      }
      
      const updatedLists = state.lists.filter(list => list.id !== id)
      localStorage.setItem(`lists_${userId}`, JSON.stringify(updatedLists))
      
      // Update any tasks in this list to the default list
      const tasks = rootGetters['tasks/allTasks']
      tasks.forEach(task => {
        if (task.listId === id) {
          dispatch('tasks/updateTask', {
            id: task.id,
            updates: { listId: 'default' }
          }, { root: true })
        }
      })
      
      commit('DELETE_LIST', id)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_LISTS(state, lists) {
    state.lists = lists
  },
  
  ADD_LIST(state, list) {
    state.lists.push(list)
  },
  
  UPDATE_LIST(state, { id, updates }) {
    const index = state.lists.findIndex(list => list.id === id)
    if (index !== -1) {
      state.lists[index] = { ...state.lists[index], ...updates }
    }
  },
  
  DELETE_LIST(state, id) {
    state.lists = state.lists.filter(list => list.id !== id)
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  SET_ERROR(state, error) {
    state.error = error
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}