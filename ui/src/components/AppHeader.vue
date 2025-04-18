<template>
  <v-app-bar flat>
    <v-container class="d-flex align-center py-0 my-0">
      <div class="d-flex align-center">
        <h1 class="text-h5 font-weight-medium">{{ title }}</h1>
      </div>
      
      <v-spacer></v-spacer>
      
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search tasks"
        density="comfortable"
        hide-details
        class="search-field"
        variant="outlined"
        bg-color="white"
      />
      
      <div class="user-menu">
        <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              class="ml-2"
              icon
            >
              <v-avatar color="primary" v-if="!user?.photoURL" size="36">
                <span class="text-h6 text-white">{{ userInitials }}</span>
              </v-avatar>
              <v-avatar v-else size="36">
                <v-img :src="user.photoURL" alt="User Avatar" />
              </v-avatar>
            </v-btn>
          </template>
          
          <v-card min-width="200" class="user-menu-card">
            <v-card-text>
              <div class="d-flex align-center mb-3">
                <v-avatar color="primary" v-if="!user?.photoURL" size="36">
                  <span class="text-h6 text-white">{{ userInitials }}</span>
                </v-avatar>
                <v-avatar v-else size="36" class="mr-3">
                  <v-img :src="user.photoURL" alt="User Avatar" />
                </v-avatar>
                <div class="ml-3">
                  <div class="text-subtitle-1 font-weight-medium">{{ user?.displayName }}</div>
                  <div class="text-caption text-medium-emphasis">{{ user?.email }}</div>
                </div>
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn
                block
                variant="text"
                color="error"
                prepend-icon="mdi-logout"
                @click="logout"
              >
                Sign Out
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      default: 'Tasks'
    }
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    ...mapGetters('tasks', ['searchTasks']),
    
    user() {
      return this.currentUser
    },
    
    userInitials() {
      if (!this.user?.displayName) return '?'
      return this.user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
    },

    filteredTasks() {
      const currentListId = this.$route.params.listId || 'all'
      return this.searchTasks(this.searchQuery, currentListId)
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('tasks', ['setSelectedTask']),
    
    async handleLogout() {
      try {
        await this.logout()
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout failed', error)
      }
    }
  },
  watch: {
    searchQuery(val) {
      this.$emit('search', this.filteredTasks)
    }
  }
}
</script>

<style scoped>
.search-field {
  max-width: 300px;
}

.user-menu-card {
  border-radius: 8px;
}

@media (max-width: 600px) {
  .search-field {
    display: none;
  }
}
</style>