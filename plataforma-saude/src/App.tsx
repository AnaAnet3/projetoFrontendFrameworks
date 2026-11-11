import { Navigate, Route, Routes } from 'react-router-dom';
import { ProvedorApp } from './contexto';
import Layout from './Layout';
import ModalAgendamento from './Agendamento';
import ModalAgendamentoExame from './AgendamentoExame';
import ModalNotificacoes from './Notificacoes';
import ModalPerfil from './Perfil';
import Inicio from './paginas/Inicio';
import Consultas from './paginas/Consultas';
import Exames from './paginas/Exames';
import Unidades from './paginas/Unidades';
import Ajuda from './paginas/Ajuda';

export default function App() {
  return (
    <ProvedorApp>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/exames" element={<Exames />} />
          <Route path="/unidades" element={<Unidades />} />
          <Route path="/ajuda" element={<Ajuda />} />
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Route>
      </Routes>
      <ModalAgendamento />
      <ModalAgendamentoExame />
      <ModalNotificacoes />
      <ModalPerfil />
    </ProvedorApp>
  );
}
