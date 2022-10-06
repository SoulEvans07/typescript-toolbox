import { useEffect } from 'react';
import './App.scss';

import { main } from 'model';

function App() {
  const clear = () => console.clear();
  const run = () => main();
  const cleanRun = () => {
    clear();
    run();
  };

  useEffect(() => {});

  return (
    <div className="app">
      <button onClick={cleanRun}>clean run</button>
      <button onClick={run}>run</button>
      <button onClick={clear}>clear</button>
    </div>
  );
}

export default App;
