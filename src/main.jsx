import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

//import './index.css'

import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { CssBaseline, ThemeProvider } from '@mui/material';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
