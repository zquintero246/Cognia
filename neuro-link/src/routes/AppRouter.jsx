import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Inicio from "../../neuro-link/src/modules/Inicio";
//import Usuario from "../../neuro-link/src/modules/Usuario";
//import Menu from "../../neuro-link/src/modules/Menu";
import Sensorial from "../modules/Sensorial/Sensorial";
import Cognitivo from "../modules/Cognitivo/Cognitivo";
import Social from "../modules/Social/Social";
import Tecnico from "../modules/Tecnico/Tecnico";
import Familiar from "../modules/Familiar/Familiar";
//import ModoCalma from "../../neuro-link/src/modules/ModoCalma/ModoCalma";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/sensorial" element={<Sensorial />} />
        <Route path="/cognitivo" element={<Cognitivo />} />
        <Route path="/social" element={<Social />} />
        <Route path="/tecnico" element={<Tecnico />} />
        <Route path="/familiar" element={<Familiar />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;