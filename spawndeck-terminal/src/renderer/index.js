// Main entry point for the React app
const { React, ReactDOM } = window;

// Import components - we'll load these as separate scripts
const root = ReactDOM.createRoot(document.getElementById('root'));

// For now, let's just render a simple test
root.render(
  <div style={{ padding: '20px', color: 'white', background: '#1e1e1e', height: '100vh' }}>
    <h1>React App is Loading...</h1>
    <p>Components will be loaded next.</p>
  </div>
);