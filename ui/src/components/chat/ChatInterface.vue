<template>
  <div class="chat-interface">
    <!-- Chat Messages -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="!messages.length" class="empty-chat">
        <v-icon size="64" color="primary" class="mb-4">mdi-robot</v-icon>
        <h3 class="text-h6">Let's work on "{{ task.title }}"</h3>
        <p class="text-body-1">I'm here to help you complete this task. What would you like to do first?</p>
      </div>
      
      <div v-else class="messages-list">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="{ 'message-ai': message.role === 'assistant', 'message-user': message.role === 'user' }"
        >
          <div class="message-avatar" v-if="message.role === 'assistant'">
            <v-avatar color="primary" size="32">
              <v-icon color="white" size="20">mdi-robot</v-icon>
            </v-avatar>
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.content)"></div>
          </div>
          <div class="message-avatar" v-if="message.role === 'user'">
            <v-avatar color="secondary" size="32">
              <v-icon color="white" size="20">mdi-account</v-icon>
            </v-avatar>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="chat-input">
      <v-form @submit.prevent="sendMessage" class="d-flex align-center">
        <v-textarea
          v-model="newMessage"
          rows="1"
          auto-grow
          hide-details
          density="comfortable"
          variant="outlined"
          placeholder="Message..."
          class="mr-2"
          @keydown.enter.prevent="handleEnter"
        />
        <v-btn
          color="primary"
          icon
          :disabled="!newMessage.trim()"
          @click="sendMessage"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatInterface',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      messages: [],
      newMessage: ''
    }
  },
  methods: {
    formatMessage(text) {
      // Convert URLs to links and preserve line breaks
      return text
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
        .replace(/\n/g, '<br>')
    },
    
    async sendMessage() {
      const message = this.newMessage.trim()
      if (!message) return
      
      // Add user message
      this.messages.push({
        role: 'user',
        content: message
      })
      
      this.newMessage = ''
      
      // Scroll to bottom
      this.$nextTick(() => {
        this.scrollToBottom()
      })
      
      // Simulate AI response (replace with actual API call)
      this.messages.push({
        role: 'assistant',
        content: `I'm here to help with "${this.task.title}". Let me assist you with that.`
      })
      
      // Scroll to bottom after response
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    
    handleEnter(e) {
      if (e.shiftKey) return
      this.sendMessage()
    },
    
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      container.scrollTop = container.scrollHeight
    }
  }
}
</script>

<style scoped>
.chat-interface {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--v-background-base);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--v-secondary-darken-1);
  padding: 2rem;
}

.empty-chat h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem !important;
}

.empty-chat p {
  color: var(--v-textMuted-base);
  font-size: 0.875rem !important;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.message {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
}

.message-ai {
  background-color: var(--v-surface-base);
  margin: 0 -1rem;
  padding: 1rem;
}

.message-content {
  flex: 1;
  font-size: 0.875rem !important;
  line-height: 1.5;
  color: var(--v-secondary-darken-1);
}

.message-text {
  white-space: pre-wrap;
}

.message-text :deep(a) {
  color: var(--v-primary-base);
  text-decoration: none;
}

.message-text :deep(a:hover) {
  text-decoration: underline;
}

.chat-input {
  border-top: 1px solid var(--v-divider-base);
  padding: 1rem;
  background-color: var(--v-surface-base);
}

.chat-input :deep(.v-field) {
  background-color: var(--v-background-base) !important;
  border-radius: 8px !important;
}

.chat-input :deep(.v-field__input) {
  font-size: 0.875rem !important;
  color: var(--v-secondary-darken-1) !important;
  min-height: unset !important;
  padding: 0.5rem !important;
}

.chat-input :deep(.v-field__outline) {
  border-color: var(--v-divider-base) !important;
}
</style> 