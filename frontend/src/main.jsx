import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css'
import Dashboard from './pages/Dashboard';

// Set up dark mode listener
const updateBodyClass = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.body.style.backgroundColor = '#111827'; // gray-900
  } else {
    document.body.style.backgroundColor = '#f3f4f6'; // gray-100
  }
};

// Initial check
updateBodyClass();

// Set up observer to watch for class changes on html element
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'class') {
      updateBodyClass();
    }
  });
});

observer.observe(document.documentElement, { attributes: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
