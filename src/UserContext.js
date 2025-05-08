import React from 'react';

// createContext method creates a context object
// a context object as the name implies is of the data type object that can be used to store information that will be access by the components within our application
// In simpler terms, it the storage that can be accessed by ALL
const UserContext = React.createContext();

// The provider component allows the other components to consume/use the context object and supply information
// this will be like a bridge tio allo access to the storage
export const UserProvider = UserContext.Provider;

export default UserContext;