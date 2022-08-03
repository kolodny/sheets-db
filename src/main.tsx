import React from 'react'
import ReactDOM from 'react-dom/client'
import{ App} from './app'

import {app} from './firebase';

console.log(app);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
