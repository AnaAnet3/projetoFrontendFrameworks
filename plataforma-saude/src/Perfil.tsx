import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MapPin, X } from 'lucide-react';
import { Abas, Modal } from './Componentes';
import { useApp } from './contexto';
import { buscar, calcularIdade, dataCurta, distancia, medico, perfil, unidades, usuario } from './dados';

const ABAS = [
  { id: 'pessoais', nome: 'Dados pessoais' },
  { id: 'endereco', nome: 'Endereço e unidades' },
  { id: 'saude', nome: 'Saúde' },
];

// As unidades já trazem a distância a partir do endereço cadastrado.
const unidadesPorProximidade = [...unidades].sort((a, b) => a.distanciaKm - b.distanciaKm);
const maisProxima = unidadesPorProximidade[0];
const maiorDistancia = unidadesPorProximidade[unidadesPorProximidade.length - 1].distanciaKm;

function Dado({ rotulo, children, largo }: { rotulo: string; children: ReactNode; largo?: boolean }) {
  return (
    <div className={`dado ${largo ? 'largo' : ''}`}>
      <small>{rotulo}</small>
      <strong>{children}</strong>
    </div>
  );
}

function DadosPessoais() {
  const [mostrarCartao, setMostrarCartao] = useState(false);
  const idade = calcularIdade(perfil.nascimento);
  const { contatoEmergencia } = perfil;

  return (
    <div className="dados-grade">
      <Dado rotulo="Nome completo" largo>{perfil.nomeCompleto}</Dado>
      <Dado rotulo="Cartão Nacional de Saúde (SUS)">
        <span className="dado-linha">
          <span className="numero">{mostrarCartao ? perfil.cartaoSus : `••• •••• •••• ${usuario.finalCartao}`}</span>
          <button
            className="botao-mini"
            onClick={() => setMostrarCartao(!mostrarCartao)}
            aria-pressed={mostrarCartao}
            aria-label={mostrarCartao ? 'Ocultar número do cartão SUS' : 'Mostrar número do cartão SUS'}
          >
            {mostrarCartao ? <EyeOff /> : <Eye />}
          </button>
        </span>
      </Dado>
      <Dado rotulo="CPF">{perfil.cpfMascarado}</Dado>
      <Dado rotulo="Idade">{idade} anos <span className="dado-extra">• Nascimento em {dataCurta(perfil.nascimento)}</span></Dado>
      <Dado rotulo="Sexo">{perfil.sexo}</Dado>
      <Dado rotulo="Telefone">{perfil.telefone}</Dado>
      <Dado rotulo="E-mail">{perfil.email}</Dado>
      <Dado rotulo="Contato de emergência" largo>
        {contatoEmergencia.nome} <span className="dado-extra">({contatoEmergencia.parentesco}) • {contatoEmergencia.telefone}</span>
      </Dado>
    </div>
  );
}

function EnderecoUnidades() {
  const { endereco } = perfil;

  return (
    <>
      <div className="endereco-cadastrado">
        <MapPin />
        <div>
          <small>Endereço cadastrado</small>
          <strong>{endereco.logradouro}</strong>
          <span>{endereco.bairro} • {endereco.cidade} • CEP {endereco.cep}</span>
        </div>
      </div>

      <p className="rotulo-campo">Proximidade das unidades</p>
      <p className="suave dica-servicos">Distância a partir do seu endereço cadastrado.</p>
      <ul className="proximidade">
        {unidadesPorProximidade.map((unidade) => (
          <li key={unidade.id} className={unidade === maisProxima ? 'mais-proxima' : ''}>
            <div className="proximidade-topo">
              <strong>{unidade.nome}</strong>
              {unidade === maisProxima && <span className="selo selo-verde">Mais próxima</span>}
              <span className="proximidade-km">{distancia(unidade.distanciaKm)}</span>
            </div>
            <div className="barra-distancia" role="img" aria-label={`${distancia(unidade.distanciaKm)} de distância`}>
              <span style={{ width: `${Math.max(12, (unidade.distanciaKm / maiorDistancia) * 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function Saude() {
  return (
    <div className="dados-grade">
      <Dado rotulo="Tipo sanguíneo">{perfil.tipoSanguineo}</Dado>
      <Dado rotulo="Alergias registradas">{perfil.alergias}</Dado>
      <Dado rotulo="Unidade de referência">{maisProxima.nome}</Dado>
      <Dado rotulo="Equipe de saúde">{perfil.equipe}</Dado>
      <Dado rotulo="Profissional de referência" largo>{medico.nome} <span className="dado-extra">• {medico.crm}</span></Dado>
      <Dado rotulo="Cadastro atualizado em" largo>{dataCurta(perfil.cadastroAtualizadoEm)}</Dado>
    </div>
  );
}

export default function ModalPerfil() {
  const { perfilAberto, fecharPerfil } = useApp();
  const navigate = useNavigate();
  const [aba, setAba] = useState('pessoais');

  useEffect(() => {
    if (perfilAberto) setAba('pessoais');
  }, [perfilAberto]);

  const verUnidades = () => {
    fecharPerfil();
    navigate('/unidades');
  };

  return (
    <Modal aberto={perfilAberto} aoFechar={fecharPerfil} tituloId="titulo-perfil">
      <div className="modal-corpo">
        <header className="modal-topo">
          <div className="perfil-identidade">
            <span className="avatar grande">{usuario.iniciais}</span>
            <div>
              <span className="sobretitulo">Meu perfil</span>
              <h2 id="titulo-perfil">{usuario.nome}</h2>
              <span className="selo selo-verde">Cadastro ativo</span>
            </div>
          </div>
          <button className="botao-icone" onClick={fecharPerfil} aria-label="Fechar"><X /></button>
        </header>

        <Abas abas={ABAS} valor={aba} aoMudar={setAba} />

        <div className="perfil-painel">
          {aba === 'pessoais' && <DadosPessoais />}
          {aba === 'endereco' && <EnderecoUnidades />}
          {aba === 'saude' && <Saude />}
        </div>

        <p className="nota-perfil">Para corrigir ou atualizar seus dados, procure sua unidade de referência ou ligue 136.</p>

        <footer className="modal-rodape">
          <button className="botao botao-claro" onClick={fecharPerfil}>Fechar</button>
          <button className="botao botao-primario" onClick={verUnidades}>Ver unidades de saúde</button>
        </footer>
      </div>
    </Modal>
  );
}
