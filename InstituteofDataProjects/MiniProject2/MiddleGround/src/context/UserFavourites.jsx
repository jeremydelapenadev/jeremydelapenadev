import { createContext, useState } from "react";

export const UserFavourites = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  const addFavourite = (space) => {
    setFavourites((prev) => {
      if (prev.find((item) => item.id === space.id)) return prev;
      return [...prev, space];
    });
  };

  const removeFavourite = (id) => {
    setFavourites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <UserFavourites.Provider
      value={{ favourites, addFavourite, removeFavourite }}
    >
      {children}
    </UserFavourites.Provider>
  );
}