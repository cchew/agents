<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ task ? 'Edit Task' : 'New Task' }}
      </v-card-title>
      
      <v-card-text>
        <v-form @submit.prevent="saveTask">
          <v-text-field
            v-model="taskForm.title"
            label="Task title"
            required
            autofocus
            :rules="[v => !!v || 'Title is required']"
          />
          
          <v-textarea
            v-model="taskForm.description"
            label="Description"
            rows="3"
            auto-grow
            class="mt-2"
          />
          
          <div class="d-flex align-center gap-4">
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
                  label="Due date"
                  prepend-icon="mdi-calendar"
                  variant="outlined"
                  class="date-picker"
                />
              </template>
              <v-date-picker
                v-model="taskForm.dueDate"
                @update:model-value="dateMenu = false"
              />
            </v-menu>
            
            <v-switch
              v-model="taskForm.important"
              color="warning"
              label="Important"
              hide-details
            />
          </div>
          
          <v-select
            v-model="taskForm.listId"
            :items="lists"
            item-title="name"
            item-value="id"
            label="List"
            variant="outlined"
            class="mt-4"
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
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="saveTask"
          :disabled="!taskForm.title"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'

export default {
  name: 'TaskFormDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
      default: null
    },
    listId: {
      type: String,
      default: 'default'
    }
  },
  emits: ['update:modelValue', 'save'],
  data() {
    return {
      taskForm: {
        id: null,
        title: '',
        description: '',
        dueDate: null,
        important: false,
        listId: 'default'
      },
      dateMenu: false
    }
  },
  computed: {
    ...mapGetters('lists', ['allLists']),
    
    lists() {
      return this.allLists
    },
    
    formattedDate() {
      if (!this.taskForm.dueDate) return ''
      return format(new Date(this.taskForm.dueDate), 'MMM d, yyyy')
    },
    
    defaultListId() {
      // Use the provided listId, but only if it's a valid custom list (not special filters)
      if (this.listId === 'all' || this.listId === 'important' || this.listId === 'completed') {
        return 'default'
      }
      return this.listId
    }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.initForm()
      }
    }
  },
  methods: {
    initForm() {
      if (this.task) {
        // Edit existing task
        this.taskForm = {
          id: this.task.id,
          title: this.task.title,
          description: this.task.description || '',
          dueDate: this.task.dueDate || null,
          important: this.task.important,
          listId: this.task.listId
        }
      } else {
        // New task
        this.taskForm = {
          id: null,
          title: '',
          description: '',
          dueDate: null,
          important: false,
          listId: this.defaultListId
        }
      }
    },
    
    saveTask() {
      if (!this.taskForm.title) return
      
      this.$emit('save', { ...this.taskForm })
      this.$emit('update:modelValue', false)
    }
  },
  created() {
    this.initForm()
  }
}
</script>

<style scoped>
.date-picker {
  max-width: 180px;
}
</style>