<template>
  <div class="app-container">
    <AppNavigation />
    
    <v-main>
      <v-container fluid class="main-container pa-0">
        <div class="d-flex flex-column h-100">
          <!-- Header -->
          <AppHeader :title="currentListTitle" />
          
          <div class="task-container">
            <!-- Task List -->
            <div class="task-list-container">
              <TaskList 
                :tasks="filteredTasks"
                :loading="tasksLoading"
                @select-task="selectTask"
              />
            </div>
            
            <!-- Task Detail -->
            <div class="task-detail-container">
              <TaskDetail
                v-if="selectedTask"
                :task="selectedTask"
                @update="updateTask"
                @close="closeTaskDetail"
              />
              <div v-else class="empty-state">
                <v-icon size="64" color="secondary" class="mb-4">mdi-checkbox-marked-circle-outline</v-icon>
                <h3 class="text-h5 font-weight-medium text-secondary">Select a task</h3>
                <p class="text-body-1 text-medium-emphasis">
                  Select a task to view its details or create a new task
                </p>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>
    
    <!-- Add Task FAB -->
    <v-btn
      color="primary"
      size="large"
      icon
      class="add-task-btn"
      @click="openAddTaskDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    
    <!-- Add/Edit Task Dialog -->
    <TaskFormDialog
      v-model="showTaskDialog"
      :task="editingTask"
      :list-id="currentListId"
      @save="saveTask"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppNavigation from '../components/navigation/AppNavigation.vue'
import AppHeader from '../components/AppHeader.vue'
import TaskList from '../components/tasks/TaskList.vue'
import TaskDetail from '../components/tasks/TaskDetail.vue'
import TaskFormDialog from '../components/tasks/TaskFormDialog.vue'

export default {
  name: 'Dashboard',
  components: {
    AppNavigation,
    AppHeader,
    TaskList,
    TaskDetail,
    TaskFormDialog
  },
  data() {
    return {
      showTaskDialog: false,
      editingTask: null
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    ...mapGetters('tasks', ['tasksByList', 'isLoading', 'selectedTask']),
    ...mapGetters('lists', ['getListById']),
    
    tasksLoading() {
      return this.isLoading
    },
    
    currentListId() {
      return this.$route.params.listId || 'all'
    },
    
    currentListTitle() {
      if (this.currentListId === 'all') {
        return 'All Tasks'
      } else if (this.currentListId === 'important') {
        return 'Important Tasks'
      } else if (this.currentListId === 'completed') {
        return 'Completed Tasks'
      } else {
        const list = this.getListById(this.currentListId)
        return list ? list.name : 'Tasks'
      }
    },
    
    filteredTasks() {
      return this.tasksByList(this.currentListId)
    }
  },
  created() {
    if (this.currentUser) {
      this.fetchLists()
      this.fetchTasks()
    }
  },
  methods: {
    ...mapActions('tasks', ['fetchTasks', 'addTask', 'updateTask', 'setSelectedTask']),
    ...mapActions('lists', ['fetchLists']),
    
    selectTask(task) {
      this.setSelectedTask(task)
    },
    
    closeTaskDetail() {
      this.setSelectedTask(null)
    },
    
    openAddTaskDialog() {
      this.editingTask = null
      this.showTaskDialog = true
    },
    
    saveTask(task) {
      if (task.id) {
        this.updateTask({
          id: task.id,
          updates: task
        })
      } else {
        this.addTask({
          ...task,
          listId: this.currentListId !== 'all' && this.currentListId !== 'important' && this.currentListId !== 'completed' 
            ? this.currentListId 
            : 'default'
        })
      }
      this.showTaskDialog = false
    }
  }
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  overflow: hidden;
  position: relative;
}

.main-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.task-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.task-list-container {
  flex: 1;
  overflow-y: auto;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.task-detail-container {
  flex: 1;
  overflow-y: auto;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.add-task-btn {
  position: absolute;
  bottom: 24px;
  right: 24px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .task-container {
    flex-direction: column;
  }
  
  .task-list-container,
  .task-detail-container {
    flex: none;
    height: 50%;
    width: 100%;
  }
  
  .task-list-container {
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
}
</style>