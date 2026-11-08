import { useEffect, useRef, ReactNode } from 'react';
import { Clock, MapPin, MoreHorizontal } from 'lucide-react';
import { Consulta } from './contexto';
import { buscar, dia, medico, mesCurto, servicos, unidades } from './dados';

const FOCAVEIS = 'button:not([disabled]), input:not([disabled])';

interface ModalProps { aberto: boolean; aoFechar: () => void; tituloId: string; pequeno?: boolean; children: ReactNode }

export function Modal({ aberto, aoFechar, tituloId, pequeno, children }: ModalProps) {
  const caixa = useRef<HTMLDivElement>(null);
  const fechar = useRef(aoFechar);
  fechar.current = aoFechar;

  useEffect(() => {
    if (!aberto) return;
    const el = caixa.current!;
    const anterior = document.activeElement as HTMLElement | null;
    el.focus();
    document.body.style.overflow = 'hidden';

    // Mantém o Tab dentro do modal e devolve o foco ao elemento anterior ao fechar.
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return fechar.current();
      if (e.key !== 'Tab') return;
      const itens = el.querySelectorAll<HTMLElement>(FOCAVEIS);
      const primeiro = itens[0];
      const ultimo = itens[itens.length - 1];
      const ativo = document.activeElement;
      if (e.shiftKey && (ativo === primeiro || ativo === el)) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && ativo === ultimo) { e.preventDefault(); primeiro.focus(); }
    };

    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
      anterior?.focus();
    };
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className="fundo-modal" onMouseDown={aoFechar}>
      <div
        ref={caixa}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        className={`modal ${pequeno ? 'modal-pequeno' : ''}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

interface AbasProps { abas: { id: string; nome: string; contador?: number }[]; valor: string; aoMudar: (id: string) => void }

export function Abas({ abas, valor, aoMudar }: AbasProps) {
  return (
    <div className="abas" role="tablist">
      {abas.map((aba) => (
        <button key={aba.id} role="tab" aria-selected={aba.id === valor} className={aba.id === valor ? 'ativo' : ''} onClick={() => aoMudar(aba.id)}>
          {aba.nome}
          {aba.contador !== undefined && <span className="contador">{aba.contador}</span>}
        </button>
      ))}
    </div>
  );
}

export function Aviso({ mensagem, aoTerminar }: { mensagem: string; aoTerminar: () => void }) {
  useEffect(() => {
    const timer = setTimeout(aoTerminar, 2500);
    return () => clearTimeout(timer);
  }, [aoTerminar]);

  return <div className="aviso" role="status">{mensagem}</div>;
}

export function CartaoConsulta({ consulta }: { consulta: Consulta }) {
  const servico = buscar(servicos, consulta.servicoId);
  const unidade = buscar(unidades, consulta.unidadeId);

  return (
    <article className="cartao consulta">
      <div className="caixa-data"><strong>{dia(consulta.data)}</strong><span>{mesCurto(consulta.data)}</span></div>
      <div className="consulta-info">
        <span className="selo selo-verde">Confirmada</span>
        <h3>Consulta de {servico.nome}</h3>
        <p className="consulta-medico">{medico.nome} • {medico.crm}</p>
        <div className="consulta-meta">
          <span><Clock />{consulta.hora}</span>
          <span><MapPin />{unidade.nome}</span>
        </div>
      </div>
      <button className="consulta-menu" aria-label="Mais opções"><MoreHorizontal /></button>
    </article>
  );
}
