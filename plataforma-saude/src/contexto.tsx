import { createContext, useContext, useState, ReactNode } from 'react';
import {
  buscar, catalogoExames, dataExtensa, notificacoesIniciais, servicos, unidades, Notificacao,
} from './dados';
import { CalendarCheck, FlaskConical } from 'lucide-react';

export interface Consulta { id: number; data: string; hora: string; servicoId: string; unidadeId: string }
export interface ExameAgendado { id: number; exameId: string; data: string; hora: string; unidadeId: string }

interface Valor {
  consultas: Consulta[];
  agendamentoAberto: boolean;
  servicoInicial: string | null;
  unidadeInicial: string | null;
  abrirAgendamento: (servicoId?: string, unidadeId?: string) => void;
  fecharAgendamento: () => void;
  adicionarConsulta: (consulta: Omit<Consulta, 'id'>) => void;

  exames: ExameAgendado[];
  agendamentoExameAberto: boolean;
  abrirAgendamentoExame: () => void;
  fecharAgendamentoExame: () => void;
  adicionarExame: (exame: Omit<ExameAgendado, 'id'>) => void;

  perfilAberto: boolean;
  abrirPerfil: () => void;
  fecharPerfil: () => void;

  notificacoes: Notificacao[];
  naoLidas: number;
  notificacoesAberto: boolean;
  abrirNotificacoes: () => void;
  fecharNotificacoes: () => void;
  marcarComoLida: (id: number) => void;
  marcarTodasComoLidas: () => void;
}

const Contexto = createContext<Valor>(null!);
export const useApp = () => useContext(Contexto);

export function ProvedorApp({ children }: { children: ReactNode }) {
  const [consultas, setConsultas] = useState<Consulta[]>([
    { id: 1, data: '2026-11-16', hora: '09:30', servicoId: 'clinica', unidadeId: 'jardim' },
  ]);
  const [agendamentoAberto, setAgendamentoAberto] = useState(false);
  const [servicoInicial, setServicoInicial] = useState<string | null>(null);
  const [unidadeInicial, setUnidadeInicial] = useState<string | null>(null);

  const [exames, setExames] = useState<ExameAgendado[]>([]);
  const [agendamentoExameAberto, setAgendamentoExameAberto] = useState(false);

  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesIniciais);
  const [notificacoesAberto, setNotificacoesAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);

  // A notificação mais recente fica no topo. O id usa a hora atual, como nas consultas.
  const novaNotificacao = (dados: Pick<Notificacao, 'titulo' | 'texto' | 'rota' | 'icone' | 'tom'>) =>
    setNotificacoes((atuais) => [{ ...dados, id: Date.now(), tempo: 'Agora', lida: false }, ...atuais]);

  return (
    <Contexto.Provider
      value={{
        consultas,
        agendamentoAberto,
        servicoInicial,
        unidadeInicial,
        abrirAgendamento: (servicoId, unidadeId) => {
          setServicoInicial(servicoId ?? null);
          setUnidadeInicial(unidadeId ?? null);
          setAgendamentoAberto(true);
        },
        fecharAgendamento: () => setAgendamentoAberto(false),
        adicionarConsulta: (consulta) => {
          setConsultas((atuais) => [{ ...consulta, id: Date.now() }, ...atuais]);
          novaNotificacao({
            titulo: 'Consulta agendada',
            texto: `${buscar(servicos, consulta.servicoId).nome} em ${buscar(unidades, consulta.unidadeId).nome}, ${dataExtensa(consulta.data)} às ${consulta.hora}.`,
            rota: '/consultas', icone: CalendarCheck, tom: 'turquesa',
          });
        },

        exames,
        agendamentoExameAberto,
        abrirAgendamentoExame: () => setAgendamentoExameAberto(true),
        fecharAgendamentoExame: () => setAgendamentoExameAberto(false),
        adicionarExame: (exame) => {
          setExames((atuais) => [{ ...exame, id: Date.now() }, ...atuais]);
          novaNotificacao({
            titulo: 'Exame agendado',
            texto: `${buscar(catalogoExames, exame.exameId).nome} em ${buscar(unidades, exame.unidadeId).nome}, ${dataExtensa(exame.data)} às ${exame.hora}.`,
            rota: '/exames', icone: FlaskConical, tom: 'azul',
          });
        },

        perfilAberto,
        abrirPerfil: () => setPerfilAberto(true),
        fecharPerfil: () => setPerfilAberto(false),

        notificacoes,
        naoLidas: notificacoes.filter((n) => !n.lida).length,
        notificacoesAberto,
        abrirNotificacoes: () => setNotificacoesAberto(true),
        fecharNotificacoes: () => setNotificacoesAberto(false),
        marcarComoLida: (id) => setNotificacoes((atuais) => atuais.map((n) => (n.id === id ? { ...n, lida: true } : n))),
        marcarTodasComoLidas: () => setNotificacoes((atuais) => atuais.map((n) => ({ ...n, lida: true }))),
      }}
    >
      {children}
    </Contexto.Provider>
  );
}
