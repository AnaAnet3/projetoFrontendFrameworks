import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, MapPin, X } from 'lucide-react';
import { Modal } from './Componentes';
import { useApp } from './contexto';
import {
  buscar, datasDisponiveis, dia, distancia, horarioPadrao, horariosDisponiveis, medico, mesCurto, semanaCurta, servicos, unidades,
} from './dados';

const TITULOS = ['Qual atendimento você precisa?', 'Escolha a unidade', 'Escolha profissional e horário'];
const NOMES_PASSOS = ['Serviço', 'Unidade', 'Horário'];
const rascunhoInicial = { servicoId: servicos[0].id, unidadeId: unidades[0].id, ...horarioPadrao };

type Rascunho = typeof rascunhoInicial;

function EtapaServico({ valor, aoMudar }: { valor: string; aoMudar: (id: string) => void }) {
  return (
    <div className="grade-3">
      {servicos.map(({ id, nome, icone: Icone, tom }) => (
        <button key={id} aria-pressed={id === valor} className={`opcao ${id === valor ? 'selecionado' : ''}`} onClick={() => aoMudar(id)}>
          <span className={`caixa-icone tom-${tom}`}><Icone /></span>
          <span>{nome}</span>
          {id === valor && <span className="opcao-check"><Check /></span>}
        </button>
      ))}
    </div>
  );
}

function EtapaUnidade({ valor, aoMudar }: { valor: string; aoMudar: (id: string) => void }) {
  return (
    <div className="pilha">
      {unidades.map((unidade) => (
        <button key={unidade.id} aria-pressed={unidade.id === valor} className={`opcao radio ${unidade.id === valor ? 'selecionado' : ''}`} onClick={() => aoMudar(unidade.id)}>
          <span className="opcao-bolinha" />
          <span>
            <strong>{unidade.nome}</strong>
            <small><MapPin /> {distancia(unidade.distanciaKm)} • Próximos horários hoje</small>
          </span>
        </button>
      ))}
    </div>
  );
}

function EtapaHorario({ data, hora, aoMudar }: { data: string; hora: string; aoMudar: (parte: Partial<Rascunho>) => void }) {
  return (
    <>
      <div className="medico">
        <span className="avatar">{medico.iniciais}</span>
        <div><strong>{medico.nome}</strong><small>Clínica geral • {medico.crm}</small></div>
        <span className="selo selo-verde">Mais próxima</span>
      </div>

      <div className="dias">
        {datasDisponiveis.map((d) => (
          <button key={d} aria-pressed={d === data} className={d === data ? 'selecionado' : ''} onClick={() => aoMudar({ data: d })}>
            <small>{semanaCurta(d)}</small>
            <strong>{dia(d)}</strong>
          </button>
        ))}
      </div>

      <p className="rotulo-campo">Horários disponíveis</p>
      <div className="horarios">
        {horariosDisponiveis.map((h) => (
          <button key={h} aria-pressed={h === hora} className={h === hora ? 'selecionado' : ''} onClick={() => aoMudar({ hora: h })}>{h}</button>
        ))}
      </div>
    </>
  );
}

function Sucesso({ rascunho, concluir }: { rascunho: Rascunho; concluir: () => void }) {
  return (
    <div className="modal-corpo centro">
      <span className="icone-sucesso"><Check /></span>
      <span className="sobretitulo">Agendamento concluído</span>
      <h2 id="titulo-agendamento">Sua consulta está confirmada!</h2>
      <p className="suave">Enviamos os detalhes e lembretes para seu celular.</p>
      <div className="resumo">
        <div className="caixa-data pequeno"><strong>{dia(rascunho.data)}</strong><span>{mesCurto(rascunho.data)}</span></div>
        <div>
          <strong>{buscar(servicos, rascunho.servicoId).nome}</strong>
          <p>{rascunho.hora} • {buscar(unidades, rascunho.unidadeId).nome}</p>
          <p>{medico.nome}</p>
        </div>
      </div>
      <button className="botao botao-primario cheio" onClick={concluir}>Voltar para o início</button>
    </div>
  );
}

export default function ModalAgendamento() {
  const { agendamentoAberto, fecharAgendamento, servicoInicial, adicionarConsulta } = useApp();
  const navigate = useNavigate();
  const [passo, setPasso] = useState(1);
  const [confirmado, setConfirmado] = useState(false);
  const [rascunho, setRascunho] = useState(rascunhoInicial);

  useEffect(() => {
    if (!agendamentoAberto) return;
    setRascunho({ ...rascunhoInicial, servicoId: servicoInicial ?? rascunhoInicial.servicoId });
    setPasso(servicoInicial ? 2 : 1);
    setConfirmado(false);
  }, [agendamentoAberto, servicoInicial]);

  const mudar = (parte: Partial<Rascunho>) => setRascunho((atual) => ({ ...atual, ...parte }));

  const confirmar = () => {
    adicionarConsulta(rascunho);
    setConfirmado(true);
  };

  const concluir = () => {
    fecharAgendamento();
    navigate('/inicio');
  };

  return (
    <Modal aberto={agendamentoAberto} aoFechar={fecharAgendamento} tituloId="titulo-agendamento" pequeno={confirmado}>
      {confirmado ? (
        <Sucesso rascunho={rascunho} concluir={concluir} />
      ) : (
        <div className="modal-corpo">
          <header className="modal-topo">
            <div>
              <span className="sobretitulo">Novo agendamento</span>
              <h2 id="titulo-agendamento">{TITULOS[passo - 1]}</h2>
            </div>
            <button className="botao-icone" onClick={fecharAgendamento} aria-label="Fechar"><X /></button>
          </header>

          <ol className="passos">
            {NOMES_PASSOS.map((nome, i) => (
              <li key={nome} className={i + 1 < passo ? 'feito' : i + 1 === passo ? 'atual' : ''}>
                <span className="passo-ponto">{i + 1 < passo ? <Check /> : i + 1}</span>
                <span className="passo-nome">{nome}</span>
              </li>
            ))}
          </ol>

          {passo === 1 && <EtapaServico valor={rascunho.servicoId} aoMudar={(servicoId) => mudar({ servicoId })} />}
          {passo === 2 && <EtapaUnidade valor={rascunho.unidadeId} aoMudar={(unidadeId) => mudar({ unidadeId })} />}
          {passo === 3 && <EtapaHorario data={rascunho.data} hora={rascunho.hora} aoMudar={mudar} />}

          <footer className="modal-rodape">
            <button className="botao botao-claro" onClick={passo === 1 ? fecharAgendamento : () => setPasso(passo - 1)}>
              {passo === 1 ? 'Cancelar' : 'Voltar'}
            </button>
            <button className="botao botao-primario" onClick={passo < 3 ? () => setPasso(passo + 1) : confirmar}>
              {passo < 3 ? 'Continuar' : 'Confirmar agendamento'} <ArrowRight />
            </button>
          </footer>
        </div>
      )}
    </Modal>
  );
}
