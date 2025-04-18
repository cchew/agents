import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const customTheme = {
  dark: false,
  colors: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    primary: '#5B76F7',
    'primary-darken-1': '#3B5CF6',
    secondary: '#9CA3AF',
    'secondary-darken-1': '#6B7280',
    accent: '#FF8A65',
    error: '#F87171',
    info: '#64B5F6',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme
    }
  }
})