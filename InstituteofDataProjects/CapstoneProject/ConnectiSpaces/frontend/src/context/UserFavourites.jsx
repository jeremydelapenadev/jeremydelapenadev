import { createContext, useState } from "react";

export const UserFavourites = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  const addFavourite = (space) => {
    setFavourites((prev) => {
      if (prev.find((item) => item._id === space._id)) return prev;
      return [...prev, space];
    });
  };

  const removeFavourite = (id) => {
    setFavourites((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <UserFavourites.Provider
      value={{ favourites, addFavourite, removeFavourite }}
    >
      {children}
    </UserFavourites.Provider>
  );
}