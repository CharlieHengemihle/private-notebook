import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { NoteProvider } from './context/NoteContext';
import { UserProvider } from './context/UserContext';
import App from './App';

render(
  <React.StrictMode>
    <UserProvider>
      <NoteProvider>
        <Router>
          <App />
        </Router>
      </NoteProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
