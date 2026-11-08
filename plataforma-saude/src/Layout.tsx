import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Bell, Building2, CalendarCheck, ChevronRight, CircleHelp, FlaskConical, Home, Menu, Plus, ShieldCheck } from 'lucide-react';
import { usuario } from './dados';

const rotas = [
  { caminho: '/inicio', nome: 'Início', icone: Home },
  { caminho: '/consultas', nome: 'Consultas', icone: CalendarCheck },
  { caminho: '/exames', nome: 'Exames e laudos', icone: FlaskConical },
  { caminho: '/unidades', nome: 'Unidades de saúde', icone: Building2 },
];
const ajuda = { caminho: '/ajuda', nome: 'Ajuda e suporte', icone: CircleHelp };

function ItemMenu({ caminho, nome, icone: Icone }: { caminho: string; nome: string; icone: LucideIcon }) {
  return (
    <NavLink to={caminho} className={({ isActive }) => `menu-item ${isActive ? 'ativo' : ''}`}>
      <Icone />
      <span>{nome}</span>
    </NavLink>
  );
}

function BarraLateral() {
  return (
    <aside className="barra-lateral">
      <div className="barra-corpo">
        <div className="marca">
          <span className="marca-logo"><Plus /></span>
          <div><strong>Saúde</strong><small>Agenda Municipal</small></div>
        </div>

        <p className="menu-titulo">Menu principal</p>
        <nav>{rotas.map((rota) => <ItemMenu key={rota.caminho} {...rota} />)}</nav>

        <div className="barra-rodape">
          <ItemMenu {...ajuda} />
          <div className="cartao-privacidade">
            <ShieldCheck />
            <div><strong>Seus dados estão seguros</strong><small>Protegidos conforme a LGPD</small></div>
          </div>
          <p className="orgao"><strong>Prefeitura Municipal</strong>Secretaria de Saúde</p>
        </div>
      </div>
    </aside>
  );
}

function Topo({ titulo, abrirMenu }: { titulo: string; abrirMenu: () => void }) {
  return (
    <header className="topo">
      <button className="botao-icone topo-menu" onClick={abrirMenu} aria-label="Abrir menu"><Menu /></button>
      <div className="topo-titulo">
        <span className="sobretitulo">Agenda Saúde</span>
        <h1>{titulo}</h1>
      </div>
      <button className="botao-icone" aria-label="Notificações">
        <Bell />
        <span className="ponto" />
      </button>
      <button className="usuario">
        <span className="avatar">{usuario.iniciais}</span>
        <span className="usuario-texto">
          <strong>{usuario.nome}</strong>
          <small>Cartão SUS •••• {usuario.finalCartao}</small>
        </span>
        <ChevronRight className="usuario-seta" />
      </button>
    </header>
  );
}

export default function Layout() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { pathname } = useLocation();
  const titulo = pathname === ajuda.caminho ? 'Ajuda' : rotas.find((r) => r.caminho === pathname)?.nome ?? 'Plataforma de Saúde';

  useEffect(() => setMenuAberto(false), [pathname]);

  return (
    <div className={`app ${menuAberto ? 'menu-aberto' : ''}`}>
      <BarraLateral />
      <div className="fundo-menu" onClick={() => setMenuAberto(false)} />
      <div className="principal">
        <Topo titulo={titulo} abrirMenu={() => setMenuAberto(true)} />
        <div className="conteudo"><Outlet /></div>
      </div>
    </div>
  );
}
