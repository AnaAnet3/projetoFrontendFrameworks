import { createContext, useContext, useState, ReactNode } from 'react';

export interface Consulta { id: number; data: string; hora: string; servicoId: string; unidadeId: string }

interface Valor {
  consultas: Consulta[];
  agendamentoAberto: boolean;
  servicoInicial: string | null;
  abrirAgendamento: (servicoId?: string) => void;
  fecharAgendamento: () => void;
  adicionarConsulta: (consulta: Omit<Consulta, 'id'>) => void;
}

const Contexto = createContext<Valor>(null!);
export const useApp = () => useContext(Contexto);

export function ProvedorApp({ children }: { children: ReactNode }) {
  const [consultas, setConsultas] = useState<Consulta[]>([
    { id: 1, data: '2024-06-18', hora: '09:30', servicoId: 'clinica', unidadeId: 'jardim' },
  ]);
  const [agendamentoAberto, setAgendamentoAberto] = useState(false);
  const [servicoInicial, setServicoInicial] = useState<string | null>(null);

  return (
    <Contexto.Provider
      value={{
        consultas,
        agendamentoAberto,
        servicoInicial,
        abrirAgendamento: (servicoId) => { setServicoInicial(servicoId ?? null); setAgendamentoAberto(true); },
        fecharAgendamento: () => setAgendamentoAberto(false),
        adicionarConsulta: (consulta) => setConsultas((atuais) => [{ ...consulta, id: Date.now() }, ...atuais]),
      }}
    >
      {children}
    </Contexto.Provider>
  );
}
