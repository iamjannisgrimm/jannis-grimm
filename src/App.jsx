import './App.css';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      backgroundColor: '#0d1117',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '0 20px',
      boxSizing: 'border-box',
      textAlign: 'center',
      overflowX: 'hidden' // ✨ Important! No sideways scroll
    }}>
      <h1 style={{
        fontSize: 'clamp(2rem, 8vw, 5rem)',
        fontWeight: 'bold',
        margin: 0
      }}>
        Engineer. Innovator. Leader.
      </h1>
    </div>
  );
}

export default App;