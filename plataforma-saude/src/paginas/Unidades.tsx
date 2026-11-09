import { useState } from 'react';
import { ArrowRight, CalendarCheck, Clock, MapPin, Navigation, Phone, Search, X } from 'lucide-react';
import { Modal } from '../Componentes';
import { useApp } from '../contexto';
import { buscar, distancia, servicos, unidades } from '../dados';

type Unidade = (typeof unidades)[number];

function ModalDetalhesUnidade({ unidade, aoFechar }: { unidade: Unidade | null; aoFechar: () => void }) {
  const { abrirAgendamento } = useApp();

  // Fecha os detalhes e abre o agendamento já com esta unidade escolhida.
  const agendar = (servicoId?: string) => {
    aoFechar();
    abrirAgendamento(servicoId, unidade!.id);
  };

  return (
    <Modal aberto={!!unidade} aoFechar={aoFechar} tituloId="titulo-unidade" medio>
      {unidade && (
        <div className="modal-corpo">
          <header className="modal-topo">
            <div>
              <span className="sobretitulo">Unidade de saúde</span>
              <h2 id="titulo-unidade">{unidade.nome}</h2>
              <span className="selo selo-verde">Aberta agora</span>
            </div>
            <button className="botao-icone" onClick={aoFechar} aria-label="Fechar"><X /></button>
          </header>

          <ul className="info-unidade">
            <li><MapPin /><div><small>Endereço</small><strong>{unidade.endereco}</strong></div></li>
            <li><Clock /><div><small>Funcionamento</small><strong>Segunda a sexta, {unidade.horario}</strong></div></li>
            <li><Phone /><div><small>Telefone</small><strong>{unidade.telefone}</strong></div></li>
            <li><Navigation /><div><small>Distância de você</small><strong>{distancia(unidade.distanciaKm)}</strong></div></li>
          </ul>

          <p className="rotulo-campo">Serviços disponíveis</p>
          <p className="suave dica-servicos">Escolha um serviço para agendar nesta unidade.</p>
          <div className="grade-opcoes">
            {unidade.servicos.map((id) => {
              const { nome, icone: Icone, tom } = buscar(servicos, id);
              return (
                <button key={id} className="opcao" onClick={() => agendar(id)}>
                  <span className={`caixa-icone pequeno tom-${tom}`}><Icone /></span>
                  <span>{nome}</span>
                </button>
              );
            })}
          </div>

          <footer className="modal-rodape">
            <button className="botao botao-claro" onClick={aoFechar}>Fechar</button>
            <button className="botao botao-primario" onClick={() => agendar()}><CalendarCheck /> Agendar nesta unidade</button>
          </footer>
        </div>
      )}
    </Modal>
  );
}

export default function Unidades() {
  const [busca, setBusca] = useState('');
  const [detalhe, setDetalhe] = useState<Unidade | null>(null);
  const filtradas = unidades.filter((u) => `${u.nome} ${u.endereco}`.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="pagina">
      <span className="sobretitulo">Rede municipal</span>
      <h2>Unidades de saúde</h2>
      <p className="suave">Encontre a unidade mais próxima e confira os serviços disponíveis.</p>

      <label className="busca">
        <Search />
        <input placeholder="Buscar por bairro ou unidade" value={busca} onChange={(e) => setBusca(e.target.value)} />
      </label>

      <div className="grade-3">
        {filtradas.map((unidade) => (
          <article key={unidade.id} className="cartao unidade">
            <div className="mapa"><MapPin /><span>{distancia(unidade.distanciaKm)}</span></div>
            <div className="unidade-corpo">
              <span className="selo selo-verde">Aberta agora</span>
              <h3>{unidade.nome}</h3>
              <p>{unidade.endereco}</p>
              <p className="horario-func"><Clock /> {unidade.horario}</p>
              <button className="link" onClick={() => setDetalhe(unidade)} aria-haspopup="dialog">Ver detalhes <ArrowRight /></button>
            </div>
          </article>
        ))}
      </div>
      {filtradas.length === 0 && <div className="vazio">Nenhuma unidade encontrada para “{busca}”.</div>}

      <ModalDetalhesUnidade unidade={detalhe} aoFechar={() => setDetalhe(null)} />
    </div>
  );
}
