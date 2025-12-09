import React from 'react';

const MessageDisplay = ({ error, successMessage }) => {
  return (
    <>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </>
  );
};

export default MessageDisplay;
