import { v4 as uuidv4 } from 'uuid'

const state = {
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null
}

const getters = {
  allTasks: (state) => state.tasks,
  
  tasksByList: (state) => (listId) => {
    if (listId === 'important') {
      return state.tasks.filter(task => task.important)
    } else if (listId === 'completed') {
      return state.tasks.filter(task => task.completed)
    } else if (listId) {
      return state.tasks.filter(task => task.listId === listId)
    }
    return state.tasks
  },
  
  searchTasks: (state) => (query, listId) => {
    if (!query) {
      // When no search query, respect the current list filter
      if (listId === 'important') {
        return state.tasks.filter(task => task.important)
      } else if (listId === 'completed') {
        return state.tasks.filter(task => task.completed)
      } else if (listId) {
        return state.tasks.filter(task => task.listId === listId)
      }
      return state.tasks
    }
    
    const searchTerm = query.toLowerCase()
    return state.tasks.filter(task => {
      const titleMatch = task.title.toLowerCase().includes(searchTerm)
      const descriptionMatch = task.description?.toLowerCase().includes(searchTerm) || false
      return titleMatch || descriptionMatch
    })
  },
  
  isLoading: (state) => state.loading,
  error: (state) => state.error,
  selectedTask: (state) => state.selectedTask,
  
  completedTasks: (state) => state.tasks.filter(task => task.completed),
  importantTasks: (state) => state.tasks.filter(task => task.important),
  
  taskById: (state) => (id) => {
    return state.tasks.find(task => task.id === id)
  }
}

const actions = {
  fetchTasks({ commit, rootGetters }) {
    commit('SET_LOADING', true)
    
    // For demo purposes, we're using local storage
    // In a real app, this would be a Firebase/API call
    try {
      const userId = rootGetters['auth/currentUser']?.uid
      let tasks = []
      
      const savedTasks = localStorage.getItem(`tasks_${userId}`)
      if (savedTasks) {
        tasks = JSON.parse(savedTasks)
      } else {
        // Demo tasks
        tasks = [
          {
            id: uuidv4(),
            title: 'Welcome to Vue To Do',
            description: 'This is a sample task to get you started',
            completed: false,
            important: true,
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            listId: 'default',
            createdAt: new Date().toISOString()
          },
          {
            id: uuidv4(),
            title: 'Create your first task',
            description: 'Click the + button to add a new task',
            completed: false,
            important: false,
            dueDate: null,
            listId: 'default',
            createdAt: new Date().toISOString()
          }
        ]
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks))
      }
      
      commit('SET_TASKS', tasks)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  addTask({ commit, state, rootGetters }, task) {
    commit('SET_LOADING', true)
    try {
      const userId = rootGetters['auth/currentUser'].uid
      const newTask = {
        id: uuidv4(),
        title: task.title,
        description: task.description || '',
        completed: false,
        important: task.important || false,
        dueDate: task.dueDate || null,
        listId: task.listId || 'default',
        createdAt: new Date().toISOString()
      }
      
      const updatedTasks = [...state.tasks, newTask]
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks))
      
      commit('ADD_TASK', newTask)
      return newTask
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  updateTask({ commit, state, rootGetters }, { id, updates }) {
    commit('SET_LOADING', true)
    try {
      const userId = rootGetters['auth/currentUser'].uid
      const taskIndex = state.tasks.findIndex(task => task.id === id)
      
      if (taskIndex !== -1) {
        const updatedTask = { ...state.tasks[taskIndex], ...updates }
        const updatedTasks = [
          ...state.tasks.slice(0, taskIndex),
          updatedTask,
          ...state.tasks.slice(taskIndex + 1)
        ]
        
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks))
        commit('UPDATE_TASK', { id, updates })
        return updatedTask
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  deleteTask({ commit, state, rootGetters }, id) {
    commit('SET_LOADING', true)
    try {
      const userId = rootGetters['auth/currentUser'].uid
      const updatedTasks = state.tasks.filter(task => task.id !== id)
      
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks))
      commit('DELETE_TASK', id)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  toggleTaskCompletion({ dispatch, getters }, id) {
    const task = getters.taskById(id)
    if (task) {
      dispatch('updateTask', {
        id,
        updates: { completed: !task.completed }
      })
    }
  },
  
  toggleTaskImportance({ dispatch, getters }, id) {
    const task = getters.taskById(id)
    if (task) {
      dispatch('updateTask', {
        id,
        updates: { important: !task.important }
      })
    }
  },
  
  setSelectedTask({ commit }, task) {
    commit('SET_SELECTED_TASK', task)
  }
}

const mutations = {
  SET_TASKS(state, tasks) {
    state.tasks = tasks
  },
  
  ADD_TASK(state, task) {
    state.tasks.push(task)
  },
  
  UPDATE_TASK(state, { id, updates }) {
    const index = state.tasks.findIndex(task => task.id === id)
    if (index !== -1) {
      state.tasks[index] = { ...state.tasks[index], ...updates }
      
      // Update selected task if it's the one being modified
      if (state.selectedTask && state.selectedTask.id === id) {
        state.selectedTask = { ...state.selectedTask, ...updates }
      }
    }
  },
  
  DELETE_TASK(state, id) {
    state.tasks = state.tasks.filter(task => task.id !== id)
    
    // Clear selected task if it's the one being deleted
    if (state.selectedTask && state.selectedTask.id === id) {
      state.selectedTask = null
    }
  },
  
  SET_SELECTED_TASK(state, task) {
    state.selectedTask = task
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