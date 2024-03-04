import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="App">
      <div className="text-box-container">
        <input
          className="text-box"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Enter your text here"
        />
      </div>
    </div>
  );
}

export default App;
