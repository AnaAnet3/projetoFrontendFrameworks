import { useEffect, useRef, useState } from 'react';
import { Activity, CalendarCheck, Check, Download, FlaskConical, ShieldCheck, X } from 'lucide-react';
import { Abas, Aviso, Modal } from '../Componentes';
import { hemograma, ultrassom } from '../dados';

const ABAS = [
  { id: 'andamento', nome: 'Em andamento', contador: 2 },
  { id: 'resultados', nome: 'Resultados disponíveis', contador: 1 },
  { id: 'historico', nome: 'Histórico' },
];
const TAMANHO_CODIGO = 6;
const codigoVazio = () => Array<string>(TAMANHO_CODIGO).fill('');

function ModalCodigo({ aberto, aoFechar, aoVerificar }: { aberto: boolean; aoFechar: () => void; aoVerificar: () => void }) {
  const [enviado, setEnviado] = useState(false);
  const [digitos, setDigitos] = useState(codigoVazio);
  const campos = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (aberto) { setEnviado(false); setDigitos(codigoVazio()); }
  }, [aberto]);

  useEffect(() => {
    if (enviado) campos.current[0]?.focus();
  }, [enviado]);

  const digitar = (i: number, valor: string) => {
    const digito = valor.replace(/\D/g, '').slice(-1);
    setDigitos((atuais) => atuais.map((d, j) => (j === i ? digito : d)));
    if (digito && i < TAMANHO_CODIGO - 1) campos.current[i + 1]?.focus();
  };

  return (
    <Modal aberto={aberto} aoFechar={aoFechar} tituloId="titulo-codigo" pequeno>
      <div className="modal-corpo centro">
        <button className="botao-icone fechar" onClick={aoFechar} aria-label="Fechar"><X /></button>
        <span className="icone-sucesso"><ShieldCheck /></span>
        <span className="sobretitulo">Verificação de segurança</span>
        <h2 id="titulo-codigo">Confirme que é você</h2>
        <p className="suave">Para proteger seus dados de saúde, enviaremos um código de acesso para o celular final •• <strong>42</strong>.</p>

        {enviado ? (
          <>
            <p className="rotulo-campo esquerda">Código de {TAMANHO_CODIGO} dígitos</p>
            <div className="codigo">
              {digitos.map((digito, i) => (
                <input
                  key={i}
                  ref={(el) => { campos.current[i] = el; }}
                  value={digito}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Dígito ${i + 1}`}
                  onChange={(e) => digitar(i, e.target.value)}
                  onKeyDown={(e) => e.key === 'Backspace' && !digito && i > 0 && campos.current[i - 1]?.focus()}
                />
              ))}
            </div>
            <button className="botao botao-primario cheio" disabled={!digitos.every(Boolean)} onClick={aoVerificar}>
              <Download /> Acessar laudo de {ultrassom.nome}
            </button>
          </>
        ) : (
          <button className="botao botao-primario cheio" onClick={() => setEnviado(true)}>Enviar código de verificação</button>
        )}

        <p className="nota-lgpd"><ShieldCheck /> Acesso criptografado e registrado conforme a LGPD</p>
      </div>
    </Modal>
  );
}

function CartaoHemograma() {
  return (
    <article className="cartao exame">
      <header>
        <span className="caixa-icone tom-azul"><FlaskConical /></span>
        <div>
          <span className="selo selo-ambar">Em análise</span>
          <h3>{hemograma.nome}</h3>
          <p>{hemograma.local} • Protocolo {hemograma.protocolo}</p>
        </div>
      </header>
      <ol className="linha-tempo">
        {hemograma.etapas.map((etapa) => (
          <li key={etapa.titulo} className={etapa.estado}>
            <span className="linha-tempo-ponto">{etapa.estado === 'feito' && <Check />}</span>
            <div><strong>{etapa.titulo}</strong><small>{etapa.hora}</small></div>
          </li>
        ))}
      </ol>
    </article>
  );
}

function CartaoUltrassom({ abrirLaudo }: { abrirLaudo: () => void }) {
  return (
    <article className="cartao exame">
      <header>
        <span className="caixa-icone tom-roxo"><Activity /></span>
        <div>
          <span className="selo selo-verde">Laudo disponível</span>
          <h3>{ultrassom.nome}</h3>
          <p>{ultrassom.local} • Protocolo {ultrassom.protocolo}</p>
        </div>
      </header>
      <div className="assinado">
        <span className="caixa-icone pequeno tom-turquesa"><ShieldCheck /></span>
        <div>
          <strong>Resultado assinado digitalmente</strong>
          <small>Disponível desde {ultrassom.disponivelDesde} • {ultrassom.assinadoPor}</small>
        </div>
      </div>
      <button className="botao botao-contorno cheio" onClick={abrirLaudo}><Download /> Visualizar e baixar laudo</button>
    </article>
  );
}

export default function Exames() {
  const [aba, setAba] = useState('andamento');
  const [codigoAberto, setCodigoAberto] = useState(false);
  const [avisoVisivel, setAvisoVisivel] = useState(false);

  const abrirLaudo = () => setCodigoAberto(true);

  return (
    <div className="pagina">
      <div className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">Acompanhamento em tempo real</span>
          <h2>Exames e laudos</h2>
          <p className="suave">Acompanhe cada etapa dos seus exames com segurança e transparência.</p>
        </div>
        <button className="botao botao-primario"><CalendarCheck /> Agendar exame</button>
      </div>

      <div className="aviso-seguranca">
        <span className="caixa-icone tom-turquesa"><ShieldCheck /></span>
        <div>
          <strong>Ambiente seguro e protegido</strong>
          <small>O acesso aos laudos exige confirmação de identidade. Seus dados são tratados conforme a LGPD.</small>
        </div>
      </div>

      <Abas abas={ABAS} valor={aba} aoMudar={setAba} />

      {aba === 'andamento' && <div className="grade-exames"><CartaoHemograma /><CartaoUltrassom abrirLaudo={abrirLaudo} /></div>}
      {aba === 'resultados' && <div className="grade-exames"><CartaoUltrassom abrirLaudo={abrirLaudo} /></div>}
      {aba === 'historico' && <div className="vazio">Nenhum exame no histórico.</div>}

      <ModalCodigo
        aberto={codigoAberto}
        aoFechar={() => setCodigoAberto(false)}
        aoVerificar={() => { setCodigoAberto(false); setAvisoVisivel(true); }}
      />
      {avisoVisivel && <Aviso mensagem="Identidade confirmada. Laudo liberado para download." aoTerminar={() => setAvisoVisivel(false)} />}
    </div>
  );
}
