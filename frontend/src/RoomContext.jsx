import React, { createContext, useContext, useState } from 'react';

// Create a context object
const RoomContext = createContext();

// Create a custom hook to access the context
export const useRoomContext = () => useContext(RoomContext);

// Provide the context at the top level of your component tree
export const RoomProvider = ({ children }) => {
  const [roomID, setRoomID] = useState(null);
  const [individualID, setindividualID] = useState(null);

  return (
    <RoomContext.Provider value={{ roomID, setRoomID, individualID, setindividualID }}>
      {children}
    </RoomContext.Provider>
  );
};
