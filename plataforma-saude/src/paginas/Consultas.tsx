import { useState } from 'react';
import { CalendarCheck, ChevronRight } from 'lucide-react';
import { Abas, CartaoConsulta } from '../Componentes';
import { useApp } from '../contexto';
import { servicos } from '../dados';

const ABAS = [
  { id: 'proximas', nome: 'Próximas' },
  { id: 'historico', nome: 'Histórico' },
  { id: 'canceladas', nome: 'Canceladas' },
];

export default function Consultas() {
  const { consultas, abrirAgendamento } = useApp();
  const [aba, setAba] = useState('proximas');

  return (
    <div className="pagina">
      <div className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">Cuidado multiprofissional</span>
          <h2>Consultas e atendimentos</h2>
          <p className="suave">Encontre o cuidado que precisa e escolha o melhor horário para você.</p>
        </div>
        <button className="botao botao-primario" onClick={() => abrirAgendamento()}><CalendarCheck /> Novo agendamento</button>
      </div>

      <Abas abas={ABAS} valor={aba} aoMudar={setAba} />

      {aba === 'proximas' ? (
        <div className="lista-consultas">
          {consultas.map((consulta) => <CartaoConsulta key={consulta.id} consulta={consulta} />)}
        </div>
      ) : (
        <div className="vazio">Nenhuma consulta {aba === 'historico' ? 'no histórico' : 'cancelada'}.</div>
      )}

      <h3 className="titulo-secao espaco-topo">Agendar por especialidade</h3>
      <p className="subtitulo-secao">Selecione um serviço para consultar a disponibilidade</p>
      <div className="grade-3">
        {servicos.map(({ id, nome, icone: Icone, tom }) => (
          <button key={id} className="cartao cartao-acao" onClick={() => abrirAgendamento(id)}>
            <span className={`caixa-icone grande tom-${tom}`}><Icone /></span>
            <span className="texto-acao"><strong>{nome}</strong><small>Horários disponíveis esta semana</small></span>
            <ChevronRight className="seta" />
          </button>
        ))}
      </div>
    </div>
  );
}
