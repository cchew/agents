<template>
  <div class="task-list">
    <!-- Loading indicator -->
    <div v-if="loading" class="text-center py-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!tasks.length" class="empty-tasks">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-check-circle-outline</v-icon>
      <h3 class="text-h5 font-weight-medium text-grey-darken-1">No tasks</h3>
      <p class="text-body-1 text-medium-emphasis">
        Add a task to get started
      </p>
    </div>
    
    <!-- Task items -->
    <v-list v-else lines="two" class="task-list-items">
      <div class="pb-2">
        <v-slide-y-transition group>
          <task-item
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @update="updateTask"
            @select="selectTask"
            @toggle-complete="toggleComplete"
            @toggle-important="toggleImportant"
            @delete="deleteTask"
            @go-do="goDoTask"
          />
        </v-slide-y-transition>
      </div>
    </v-list>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TaskItem from './TaskItem.vue'

export default {
  name: 'TaskList',
  components: {
    TaskItem
  },
  props: {
    tasks: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions('tasks', [
      'updateTask',
      'deleteTask',
      'toggleTaskCompletion',
      'toggleTaskImportance'
    ]),
    
    selectTask(task) {
      this.$emit('select-task', task)
    },
    
    toggleComplete(taskId) {
      this.toggleTaskCompletion(taskId)
    },
    
    toggleImportant(taskId) {
      this.toggleTaskImportance(taskId)
    },
    
    goDoTask(task) {
      this.$emit('go-do', task)
    }
  }
}
</script>

<style scoped>
.task-list {
  height: 100%;
  overflow-y: auto;
  background-color: var(--v-background-base);
}

.task-list-items {
  padding: 16px !important;
  background-color: transparent !important;
}

.task-list-items :deep(.v-list) {
  background-color: transparent !important;
}

.empty-tasks {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  color: var(--v-textMuted-base);
}

.empty-tasks .v-icon {
  opacity: 0.5;
  color: var(--v-textMuted-base) !important;
}

.empty-tasks h3 {
  margin-bottom: 8px;
  color: var(--v-secondary-darken-1);
}

.empty-tasks p {
  color: var(--v-textMuted-base);
}
</style>