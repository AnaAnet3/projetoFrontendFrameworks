import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Heart } from 'lucide-react';
import { CartaoConsulta } from '../Componentes';
import { useApp } from '../contexto';
import { acoesRapidas, dataExtensa, examesRecentes, hoje, servicosPopulares, usuario } from '../dados';

function Secao({ titulo, subtitulo, link, rota }: { titulo: string; subtitulo: string; link: string; rota: string }) {
  const navigate = useNavigate();
  return (
    <div className="linha-secao">
      <div>
        <h3 className="titulo-secao">{titulo}</h3>
        <p className="subtitulo-secao">{subtitulo}</p>
      </div>
      <button className="link" onClick={() => navigate(rota)}>{link} <ArrowRight /></button>
    </div>
  );
}

export default function Inicio() {
  const navigate = useNavigate();
  const { consultas, abrirAgendamento } = useApp();

  return (
    <div className="pagina">
      <section className="destaque">
        <div>
          <span className="sobretitulo">{dataExtensa(hoje)}</span>
          <h2>Olá, {usuario.primeiroNome}. Como podemos cuidar de você hoje?</h2>
          <p>Acesse seus serviços de saúde de forma simples, rápida e segura.</p>
        </div>
        <span className="destaque-icone"><Heart /></span>
      </section>

      <h3 className="titulo-secao">Acesso rápido</h3>
      <p className="subtitulo-secao">O que você precisa fazer?</p>
      <div className="grade-acoes">
        {acoesRapidas.map(({ id, titulo, descricao, icone: Icone, tom, rota }) => (
          <button key={id} className="cartao cartao-acao" onClick={() => (rota ? navigate(rota) : abrirAgendamento())}>
            <span className={`caixa-icone grande tom-${tom}`}><Icone /></span>
            <span className="texto-acao"><strong>{titulo}</strong><small>{descricao}</small></span>
            <ArrowRight className="seta" />
          </button>
        ))}
      </div>

      <div className="colunas">
        <div>
          <Secao titulo="Próxima consulta" subtitulo="Seu próximo compromisso de saúde" link="Ver todas" rota="/consultas" />
          <CartaoConsulta consulta={consultas[0]} />
        </div>
        <div>
          <Secao titulo="Exames recentes" subtitulo="Acompanhe o andamento" link="Ver todos" rota="/exames" />
          <div className="grade-2">
            {examesRecentes.map((exame) => {
              const cor = exame.pronto ? 'verde' : 'ambar';
              return (
                <article key={exame.id} className="cartao exame-resumo">
                  <header>
                    <span className={`caixa-icone tom-${exame.tom}`}><exame.icone /></span>
                    <span className={`selo selo-${cor}`}>{exame.pronto ? 'Disponível' : 'Em análise'}</span>
                  </header>
                  <h4>{exame.nome}</h4>
                  <p>{exame.categoria} • Solicitado em {exame.solicitadoEm}</p>
                  <div className={`progresso ${cor}`}><span style={{ width: `${exame.progresso}%` }} /></div>
                  <footer>
                    <span>{exame.legenda}</span>
                    <strong className={exame.pronto ? 'verde' : undefined}>{exame.progresso}%</strong>
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <Secao titulo="Serviços mais procurados" subtitulo="Agende seu atendimento em poucos passos" link="Ver todos" rota="/consultas" />
      <div className="grade-servicos">
        {servicosPopulares.map(({ id, nome, icone: Icone, tom }) => (
          <button key={id} className="cartao servico" onClick={() => abrirAgendamento(id)}>
            <header>
              <span className={`caixa-icone tom-${tom}`}><Icone /></span>
              <ChevronRight className="seta" />
            </header>
            <strong>{nome}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
