import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Info, X } from 'lucide-react';
import { Abas, Modal, Passos, SeletorDataHora, SeletorUnidade } from './Componentes';
import { useApp } from './contexto';
import {
  buscar, catalogoExames, categoriasExame, datasExame, dia, exameHorarioPadrao, horariosExame, mesCurto, unidades,
} from './dados';

const TITULOS = ['Qual exame você precisa?', 'Escolha onde realizar', 'Escolha data e horário'];
const NOMES_PASSOS = ['Exame', 'Unidade', 'Horário'];
const rascunhoInicial = { exameId: catalogoExames[0].id, unidadeId: unidades[0].id, ...exameHorarioPadrao };

type Rascunho = typeof rascunhoInicial;

function EtapaExame({ valor, aoMudar }: { valor: string; aoMudar: (id: string) => void }) {
  // A aba mostrada acompanha o exame selecionado.
  const [categoria, setCategoria] = useState(buscar(catalogoExames, valor).categoria);

  const trocarCategoria = (nova: string) => {
    setCategoria(nova);
    const selecionadoAindaVisivel = buscar(catalogoExames, valor).categoria === nova;
    if (!selecionadoAindaVisivel) aoMudar(catalogoExames.find((e) => e.categoria === nova)!.id);
  };

  return (
    <>
      <Abas abas={categoriasExame} valor={categoria} aoMudar={trocarCategoria} />
      <div className="grade-opcoes">
        {catalogoExames.filter((e) => e.categoria === categoria).map(({ id, nome, icone: Icone, tom, preparo }) => (
          <button key={id} aria-pressed={id === valor} className={`opcao detalhada ${id === valor ? 'selecionado' : ''}`} onClick={() => aoMudar(id)}>
            <span className={`caixa-icone tom-${tom}`}><Icone /></span>
            <span className="opcao-texto"><strong>{nome}</strong><small>{preparo}</small></span>
            {id === valor && <span className="opcao-check"><Check /></span>}
          </button>
        ))}
      </div>
    </>
  );
}

function EtapaHorario({ rascunho, aoMudar }: { rascunho: Rascunho; aoMudar: (parte: Partial<Rascunho>) => void }) {
  const exame = buscar(catalogoExames, rascunho.exameId);

  return (
    <>
      <div className="nota-preparo">
        <Info />
        <div><strong>Preparo para {exame.nome}</strong>{exame.preparo}</div>
      </div>
      <SeletorDataHora datas={datasExame} horarios={horariosExame} data={rascunho.data} hora={rascunho.hora} aoMudar={aoMudar} />
    </>
  );
}

function Sucesso({ rascunho, concluir }: { rascunho: Rascunho; concluir: () => void }) {
  const exame = buscar(catalogoExames, rascunho.exameId);

  return (
    <div className="modal-corpo centro">
      <span className="icone-sucesso"><Check /></span>
      <span className="sobretitulo">Agendamento concluído</span>
      <h2 id="titulo-agendamento-exame">Seu exame está agendado!</h2>
      <p className="suave">Enviamos os detalhes e as orientações de preparo para seu celular.</p>
      <div className="resumo">
        <div className="caixa-data pequeno"><strong>{dia(rascunho.data)}</strong><span>{mesCurto(rascunho.data)}</span></div>
        <div>
          <strong>{exame.nome}</strong>
          <p>{rascunho.hora} • {buscar(unidades, rascunho.unidadeId).nome}</p>
          <p>Preparo: {exame.preparo}</p>
        </div>
      </div>
      <button className="botao botao-primario cheio" onClick={concluir}>Ver meus exames</button>
    </div>
  );
}

export default function ModalAgendamentoExame() {
  const { agendamentoExameAberto, fecharAgendamentoExame, adicionarExame } = useApp();
  const navigate = useNavigate();
  const [passo, setPasso] = useState(1);
  const [confirmado, setConfirmado] = useState(false);
  const [rascunho, setRascunho] = useState(rascunhoInicial);

  useEffect(() => {
    if (!agendamentoExameAberto) return;
    setRascunho(rascunhoInicial);
    setPasso(1);
    setConfirmado(false);
  }, [agendamentoExameAberto]);

  const mudar = (parte: Partial<Rascunho>) => setRascunho((atual) => ({ ...atual, ...parte }));

  const confirmar = () => {
    adicionarExame(rascunho);
    setConfirmado(true);
  };

  const concluir = () => {
    fecharAgendamentoExame();
    navigate('/exames');
  };

  return (
    <Modal aberto={agendamentoExameAberto} aoFechar={fecharAgendamentoExame} tituloId="titulo-agendamento-exame" pequeno={confirmado}>
      {confirmado ? (
        <Sucesso rascunho={rascunho} concluir={concluir} />
      ) : (
        <div className="modal-corpo">
          <header className="modal-topo">
            <div>
              <span className="sobretitulo">Agendar exame</span>
              <h2 id="titulo-agendamento-exame">{TITULOS[passo - 1]}</h2>
            </div>
            <button className="botao-icone" onClick={fecharAgendamentoExame} aria-label="Fechar"><X /></button>
          </header>

          <Passos nomes={NOMES_PASSOS} passo={passo} />

          {passo === 1 && <EtapaExame valor={rascunho.exameId} aoMudar={(exameId) => mudar({ exameId })} />}
          {passo === 2 && <SeletorUnidade valor={rascunho.unidadeId} aoMudar={(unidadeId) => mudar({ unidadeId })} legenda="Coleta e exames de segunda a sexta" />}
          {passo === 3 && <EtapaHorario rascunho={rascunho} aoMudar={mudar} />}

          <footer className="modal-rodape">
            <button className="botao botao-claro" onClick={passo === 1 ? fecharAgendamentoExame : () => setPasso(passo - 1)}>
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
