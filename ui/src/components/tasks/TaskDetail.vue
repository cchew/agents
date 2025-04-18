<template>
  <div class="task-detail pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h2 class="text-h6 font-weight-medium">Task Details</h2>
      </div>
      <v-btn
        icon="mdi-close"
        variant="text"
        density="comfortable"
        @click="closeDetail"
      />
    </div>
    
    <div class="task-status d-flex align-center mb-6">
      <v-checkbox
        v-model="completed"
        color="primary"
        hide-details
        @change="updateTaskStatus"
        class="mr-4"
      />
      <div class="task-title text-h6">{{ task.title }}</div>
    </div>
    
    <v-card variant="outlined" class="mb-4">
      <v-card-text>
        <div class="d-flex flex-column">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-3">mdi-information-outline</v-icon>
            <div class="w-100">
              <div class="text-subtitle-2 font-weight-medium mb-1">Description</div>
              <v-textarea
                v-model="description"
                variant="outlined"
                density="comfortable"
                auto-grow
                rows="3"
                placeholder="Add a description"
                hide-details
                @change="updateDescription"
              />
            </div>
          </div>
          
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-3">mdi-calendar</v-icon>
            <div class="w-100">
              <div class="text-subtitle-2 font-weight-medium mb-1">Due Date</div>
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    :model-value="formattedDate"
                    readonly
                    v-bind="props"
                    prepend-icon="mdi-calendar"
                    variant="outlined"
                    density="comfortable"
                    placeholder="Add due date"
                    hide-details
                    class="date-picker"
                  />
                </template>
                <v-date-picker
                  v-model="dueDate"
                  @update:model-value="updateDueDate"
                />
              </v-menu>
            </div>
          </div>
          
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-3">mdi-star</v-icon>
            <div class="w-100">
              <div class="text-subtitle-2 font-weight-medium mb-1">Priority</div>
              <v-switch
                v-model="important"
                color="warning"
                hide-details
                :label="important ? 'Important' : 'Regular'"
                @change="updateImportance"
              />
            </div>
          </div>
          
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-3">mdi-tag</v-icon>
            <div class="w-100">
              <div class="text-subtitle-2 font-weight-medium mb-1">List</div>
              <v-select
                v-model="taskList"
                :items="lists"
                item-title="name"
                item-value="id"
                variant="outlined"
                density="comfortable"
                hide-details
                @update:model-value="updateTaskList"
              >
                <template v-slot:selection="{ item }">
                  <div class="d-flex align-center">
                    <v-icon :icon="item.raw.icon" size="small" class="mr-2" />
                    {{ item.title }}
                  </div>
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon :icon="item.raw.icon" size="small" />
                    </template>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </template>
              </v-select>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    
    <div class="mt-auto">
      <div class="text-caption text-medium-emphasis mb-1">
        Created: {{ formattedCreatedDate }}
      </div>
      <div class="d-flex justify-space-between">
        <v-btn
          color="error"
          variant="outlined"
          prepend-icon="mdi-delete"
          @click="confirmDelete"
        >
          Delete
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { format } from 'date-fns'

export default {
  name: 'TaskDetail',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      completed: this.task.completed,
      description: this.task.description || '',
      dueDate: this.task.dueDate || null,
      important: this.task.important,
      taskList: this.task.listId,
      dateMenu: false
    }
  },
  computed: {
    ...mapGetters('lists', ['allLists']),
    
    lists() {
      return this.allLists
    },
    
    formattedDate() {
      if (!this.dueDate) return ''
      return format(new Date(this.dueDate), 'MMM d, yyyy')
    },
    
    formattedCreatedDate() {
      if (!this.task.createdAt) return ''
      return format(new Date(this.task.createdAt), 'MMM d, yyyy')
    }
  },
  methods: {
    ...mapActions('tasks', ['updateTask', 'deleteTask']),
    
    closeDetail() {
      this.$emit('close')
    },
    
    updateTaskStatus() {
      this.updateTask({
        id: this.task.id,
        updates: { completed: this.completed }
      })
    },
    
    updateDescription() {
      this.updateTask({
        id: this.task.id,
        updates: { description: this.description }
      })
    },
    
    updateDueDate() {
      this.dateMenu = false
      this.updateTask({
        id: this.task.id,
        updates: { dueDate: this.dueDate }
      })
    },
    
    updateImportance() {
      this.updateTask({
        id: this.task.id,
        updates: { important: this.important }
      })
    },
    
    updateTaskList() {
      this.updateTask({
        id: this.task.id,
        updates: { listId: this.taskList }
      })
    },
    
    confirmDelete() {
      if (confirm(`Delete task "${this.task.title}"?`)) {
        this.deleteTask(this.task.id)
        this.$emit('close')
      }
    }
  },
  watch: {
    task: {
      handler(newTask) {
        this.completed = newTask.completed
        this.description = newTask.description || ''
        this.dueDate = newTask.dueDate || null
        this.important = newTask.important
        this.taskList = newTask.listId
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.task-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.date-picker {
  max-width: 200px;
}
</style>