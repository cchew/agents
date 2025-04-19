<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            All Chats
          </v-card-title>
          <v-list>
            <v-list-item
              v-for="chat in chats"
              :key="chat.id"
              :to="`/chats/${chat.id}`"
              :active="currentChatId === chat.id"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" class="mr-3">
                  <v-icon icon="mdi-chat" />
                </v-avatar>
              </template>
              
              <v-list-item-title>{{ chat.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ chat.lastMessage }}</v-list-item-subtitle>
              
              <template v-slot:append>
                <v-list-item-subtitle>
                  {{ formatDate(chat.timestamp) }}
                </v-list-item-subtitle>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ChatsList',
  
  computed: {
    ...mapGetters('chats', ['allChats']),
    
    chats() {
      return this.allChats
    },
    
    currentChatId() {
      return this.$route.params.chatId
    }
  },
  
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-list-item:last-child {
  border-bottom: none;
}
</style> 