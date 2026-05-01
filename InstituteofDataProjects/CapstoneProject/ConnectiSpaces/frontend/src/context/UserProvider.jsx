// STEP 1: Create a context

import { createContext } from "react";
import { useState } from "react";

export const userContext = createContext();

export function UserProvider(props) {
  // store current user -- using useState (only available in that component, unless stored in context)

  const [currentUser, setCurrentUser] = useState(null);

  function handleUpdateUser(user) {
    // will take the 'user' object

    setCurrentUser(user);
  }

  // login form component to get data information from the user

  return (
    <>
      <userContext.Provider value={{ currentUser, handleUpdateUser }}>
        {/* add handleUpdateUser so it can be accessed by other components */}
        {props.children}
      </userContext.Provider>
    </>
  );
}

export default UserProvider;
