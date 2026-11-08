import { useState } from 'react';
import { ArrowRight, Clock, MapPin, Search } from 'lucide-react';
import { distancia, unidades } from '../dados';

export default function Unidades() {
  const [busca, setBusca] = useState('');
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
              <button className="link">Ver detalhes <ArrowRight /></button>
            </div>
          </article>
        ))}
      </div>
      {filtradas.length === 0 && <div className="vazio">Nenhuma unidade encontrada para “{busca}”.</div>}
    </div>
  );
}
