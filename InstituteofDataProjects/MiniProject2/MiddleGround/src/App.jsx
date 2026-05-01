import "./App.css";
import AppRoutes from "./components/AppRoutes";
import NavBar from "./components/NavBar";
import { FavouritesProvider } from "./context/UserFavourites";
import UserProvider from "./context/UserProvider";

function App() {
  return (
    <>
      <div>
        <UserProvider>
          <NavBar></NavBar>
          <FavouritesProvider><AppRoutes></AppRoutes></FavouritesProvider>
        </UserProvider>
      </div>
    </>
  );
}

export default App;
