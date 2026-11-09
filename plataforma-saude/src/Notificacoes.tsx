import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellOff, X } from 'lucide-react';
import { Abas, Modal } from './Componentes';
import { useApp } from './contexto';
import type { Notificacao } from './dados';

export default function ModalNotificacoes() {
  const { notificacoes, naoLidas, notificacoesAberto, fecharNotificacoes, marcarComoLida, marcarTodasComoLidas } = useApp();
  const navigate = useNavigate();
  const [aba, setAba] = useState('todas');

  useEffect(() => {
    if (notificacoesAberto) setAba('todas');
  }, [notificacoesAberto]);

  const abas = [
    { id: 'todas', nome: 'Todas' },
    { id: 'nao-lidas', nome: 'Não lidas', contador: naoLidas },
  ];
  const lista = aba === 'nao-lidas' ? notificacoes.filter((n) => !n.lida) : notificacoes;

  // Marca como lida e, se a notificação aponta para uma página, leva a pessoa até ela.
  const abrir = (notificacao: Notificacao) => {
    marcarComoLida(notificacao.id);
    if (notificacao.rota) {
      fecharNotificacoes();
      navigate(notificacao.rota);
    }
  };

  return (
    <Modal aberto={notificacoesAberto} aoFechar={fecharNotificacoes} tituloId="titulo-notificacoes" medio>
      <div className="modal-corpo">
        <header className="modal-topo">
          <div>
            <span className="sobretitulo">Suas atualizações</span>
            <h2 id="titulo-notificacoes">Notificações</h2>
            <p className="suave">{naoLidas > 0 ? `Você tem ${naoLidas} ${naoLidas === 1 ? 'notificação não lida' : 'notificações não lidas'}.` : 'Tudo em dia por aqui.'}</p>
          </div>
          <button className="botao-icone" onClick={fecharNotificacoes} aria-label="Fechar"><X /></button>
        </header>

        <Abas abas={abas} valor={aba} aoMudar={setAba} />

        {lista.length > 0 ? (
          <ul className="lista-notificacoes">
            {lista.map((notificacao) => {
              const Icone = notificacao.icone;
              return (
                <li key={notificacao.id}>
                  <button className={`notificacao ${notificacao.lida ? '' : 'nao-lida'}`} onClick={() => abrir(notificacao)}>
                    <span className={`caixa-icone pequeno tom-${notificacao.tom}`}><Icone /></span>
                    <span className="notificacao-texto">
                      <strong>{notificacao.titulo}</strong>
                      <p>{notificacao.texto}</p>
                      <small>{notificacao.tempo}</small>
                    </span>
                    {!notificacao.lida && <span className="notificacao-ponto" role="img" aria-label="Não lida" />}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="vazio vazio-notificacoes"><BellOff /> Nenhuma notificação não lida.</div>
        )}

        <footer className="modal-rodape">
          <button className="botao botao-claro" onClick={marcarTodasComoLidas} disabled={naoLidas === 0}>Marcar todas como lidas</button>
          <button className="botao botao-primario" onClick={fecharNotificacoes}>Fechar</button>
        </footer>
      </div>
    </Modal>
  );
}
