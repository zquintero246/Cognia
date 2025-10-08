import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
//import Inicio from "../../neuro-link/src/modules/Inicio";
//import Usuario from "../../neuro-link/src/modules/Usuario";
//import Menu from "../../neuro-link/src/modules/Menu";
import Login from "../modules/Login/Login";
import Sensorial from "../modules/Sensorial/Sensorial";
import Cognitivo from "../modules/Cognitivo/Cognitivo";
import Social from "../modules/Social/Social";
import Tecnico from "../modules/Tecnico/Tecnico";
import Familiar from "../modules/Familiar/Familiar";
import Dashboard from "../modules/Dashboard/Dashboard";
import Registro from "../modules/Registro/Registro";
import AuthPage from "../modules/Auth/AuthPage";
//import ModoCalma from "../../neuro-link/src/modules/ModoCalma/ModoCalma";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sensorial" element={<Sensorial />} />
        <Route path="/cognitivo" element={<Cognitivo />} />
        <Route path="/social" element={<Social />} />
        <Route path="/tecnico" element={<Tecnico />} />
        <Route path="/familiar" element={<Familiar />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;