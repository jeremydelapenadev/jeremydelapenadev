import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginForm from "./LoginForm";
import ProtectedRoute from "./ProtectedRoute";
import Spaces from "./Spaces";
import Favourites from "./Favourites";
// import CompletedTasks from "./CompletedTasks"; --> this is an additional component that I created to show the completed tasks in the task manager mini project.

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route index element={<HomePage></HomePage>}></Route>
        <Route path="/login" element={<LoginForm></LoginForm>}></Route>
        <Route path="/spaces" element={<Spaces/>}></Route>
        <Route element={<ProtectedRoute />}>
        <Route path="/favourites" element={<Favourites/>}></Route>
        {/*<Route path="/tasks" element={<CompletedTasks/>}></Route>*/}</Route>
      </Routes>
    </>
  );
}

export default AppRoutes;
