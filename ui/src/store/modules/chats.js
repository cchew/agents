export default {
  namespaced: true,
  
  state: {
    chats: [
      {
        id: 'chat1',
        name: 'Project Planning',
        lastMessage: 'Let\'s discuss the timeline for the next sprint',
        timestamp: '2024-03-15T10:30:00',
        messages: [
          {
            id: 'msg1',
            sender: 'John',
            content: 'Hi team, let\'s plan our next sprint',
            timestamp: '2024-03-15T10:30:00'
          },
          {
            id: 'msg2',
            sender: 'Sarah',
            content: 'I think we should focus on the authentication module first',
            timestamp: '2024-03-15T10:32:00'
          },
          {
            id: 'msg3',
            sender: 'Mike',
            content: 'Agreed. We can start with that and then move to the dashboard',
            timestamp: '2024-03-15T10:35:00'
          }
        ]
      },
      {
        id: 'chat2',
        name: 'Design Review',
        lastMessage: 'The new UI mockups look great!',
        timestamp: '2024-03-14T15:45:00',
        messages: [
          {
            id: 'msg1',
            sender: 'Emma',
            content: 'I\'ve updated the UI mockups for the dashboard',
            timestamp: '2024-03-14T15:45:00'
          },
          {
            id: 'msg2',
            sender: 'David',
            content: 'The new design looks much cleaner',
            timestamp: '2024-03-14T15:48:00'
          },
          {
            id: 'msg3',
            sender: 'Emma',
            content: 'Thanks! I\'ll share the updated assets with the team',
            timestamp: '2024-03-14T15:50:00'
          }
        ]
      },
      {
        id: 'chat3',
        name: 'Bug Reports',
        lastMessage: 'Found an issue with the login form',
        timestamp: '2024-03-13T09:15:00',
        messages: [
          {
            id: 'msg1',
            sender: 'Alex',
            content: 'There\'s a bug in the login form validation',
            timestamp: '2024-03-13T09:15:00'
          },
          {
            id: 'msg2',
            sender: 'Lisa',
            content: 'Can you provide more details about the issue?',
            timestamp: '2024-03-13T09:20:00'
          },
          {
            id: 'msg3',
            sender: 'Alex',
            content: 'The form accepts invalid email formats',
            timestamp: '2024-03-13T09:25:00'
          }
        ]
      }
    ]
  },
  
  getters: {
    allChats: state => state.chats,
    getChatById: state => id => state.chats.find(chat => chat.id === id)
  },
  
  mutations: {
    ADD_MESSAGE(state, { chatId, message }) {
      const chat = state.chats.find(c => c.id === chatId)
      if (chat) {
        chat.messages.push(message)
        chat.lastMessage = message.content
        chat.timestamp = message.timestamp
      }
    }
  },
  
  actions: {
    sendMessage({ commit }, { chatId, message }) {
      commit('ADD_MESSAGE', { chatId, message })
    }
  }
} 