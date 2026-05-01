import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginForm from "./LoginForm";
import ProtectedRoute from "./ProtectedRoute";
import Spaces from "./Spaces";
import Favourites from "./Favourites";
import Community from "./Community";
import SpaceView from "./SpaceView";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route index element={<HomePage></HomePage>}></Route>
        <Route path="/login" element={<LoginForm></LoginForm>}></Route>
        <Route path="/spaces" element={<Spaces/>}></Route>
        <Route path="/spaces/:id" element={<SpaceView/>}></Route>
        <Route element={<ProtectedRoute />}>
        <Route path="/favourites" element={<Favourites/>}></Route>
        <Route path="/community" element={<Community/>}></Route></Route>
      </Routes>
    </>
  );
}

export default AppRoutes;
