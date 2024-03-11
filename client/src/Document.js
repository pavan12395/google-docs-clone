import React, { useState } from 'react';

const Document = ({displayDocument , handleChange}) => {
 return (
    <div>
      <textarea
        value={displayDocument}
        onChange={handleChange}
        placeholder="Enter your text here"
        style={{ width: '100%', height: '200px' }}
      />
    </div>
 );
};

export default Document;
