import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { Modal, Passos, SeletorDataHora, SeletorUnidade } from './Componentes';
import { useApp } from './contexto';
import {
  buscar, datasDisponiveis, dia, horarioPadrao, horariosDisponiveis, medico, mesCurto, servicos, unidades,
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

function EtapaHorario({ data, hora, aoMudar }: { data: string; hora: string; aoMudar: (parte: Partial<Rascunho>) => void }) {
  return (
    <>
      <div className="medico">
        <span className="avatar">{medico.iniciais}</span>
        <div><strong>{medico.nome}</strong><small>Clínica geral • {medico.crm}</small></div>
        <span className="selo selo-verde">Mais próxima</span>
      </div>

      <SeletorDataHora datas={datasDisponiveis} horarios={horariosDisponiveis} data={data} hora={hora} aoMudar={aoMudar} />
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
  const { agendamentoAberto, fecharAgendamento, servicoInicial, unidadeInicial, adicionarConsulta } = useApp();
  const navigate = useNavigate();
  const [passo, setPasso] = useState(1);
  const [confirmado, setConfirmado] = useState(false);
  const [rascunho, setRascunho] = useState(rascunhoInicial);

  useEffect(() => {
    if (!agendamentoAberto) return;
    setRascunho({
      ...rascunhoInicial,
      servicoId: servicoInicial ?? rascunhoInicial.servicoId,
      unidadeId: unidadeInicial ?? rascunhoInicial.unidadeId,
    });
    setPasso(servicoInicial ? 2 : 1);
    setConfirmado(false);
  }, [agendamentoAberto, servicoInicial, unidadeInicial]);

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

          <Passos nomes={NOMES_PASSOS} passo={passo} />

          {passo === 1 && <EtapaServico valor={rascunho.servicoId} aoMudar={(servicoId) => mudar({ servicoId })} />}
          {passo === 2 && <SeletorUnidade valor={rascunho.unidadeId} aoMudar={(unidadeId) => mudar({ unidadeId })} />}
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
