import type { LucideIcon } from 'lucide-react';
import {
  Stethoscope, Heart, Smile, Baby, Syringe, Activity, Brain, Apple, Dumbbell, Bandage, Sparkles,
  CalendarCheck, FlaskConical, Download, Droplet, HeartPulse, Microscope, Waves, ScanLine, Bone,
} from 'lucide-react';

export const usuario = { nome: 'Rafael Oliveira', primeiroNome: 'Rafael', iniciais: 'RO', finalCartao: '4821' };

// Data fixa para combinar com os dados de exemplo. Com backend, usar new Date().
export const hoje = '2026-11-11';

export const servicos = [
  { id: 'clinica', nome: 'Clínica médica', icone: Stethoscope, tom: 'turquesa' },
  { id: 'enfermagem', nome: 'Enfermagem', icone: Heart, tom: 'azul' },
  { id: 'odonto', nome: 'Odontologia', icone: Sparkles, tom: 'roxo' },
  { id: 'prenatal', nome: 'Pré-natal', icone: Baby, tom: 'laranja' },
  { id: 'puericultura', nome: 'Pediatria', icone: Smile, tom: 'rosa' },
  { id: 'hiperdia', nome: 'Hiperdia', icone: Activity, tom: 'verde' },
  { id: 'psicologia', nome: 'Psicologia', icone: Brain, tom: 'turquesa' },
  { id: 'nutricao', nome: 'Nutrição', icone: Apple, tom: 'azul' },
  { id: 'vacinacao', nome: 'Vacinação', icone: Syringe, tom: 'roxo' },
  { id: 'fisio', nome: 'Fisioterapia', icone: Dumbbell, tom: 'laranja' },
  { id: 'curativos', nome: 'Curativos', icone: Bandage, tom: 'rosa' },
];

// `servicos` lista os ids de serviço atendidos; `telefone` é um número fictício.
export const unidades = [
  {
    id: 'centro', nome: 'Policlínica Lessa de Andrade', distanciaKm: 1.0, endereco: 'Estrada dos Remédios, 2416 - Madalena', horario: '07:30 às 17:00',
    telefone: '(81) 3355-7805', servicos: ['clinica', 'odonto', 'hiperdia', 'psicologia', 'nutricao', 'fisio'],
  }, 
  {
    id: 'parque', nome: 'USF Santo Amaro III', distanciaKm: 2.4, endereco: 'Av. Norte Miguel Arraes de Alencar, 1271 - Santo Amaro', horario: '07:00 às 17:00',
    telefone: '(81) 3355-3425', servicos: ['clinica', 'enfermagem', 'vacinacao', 'curativos', 'psicologia', 'nutricao'],
  },
  {
    id: 'jardim', nome: 'USF Coelhos', distanciaKm: 3.2, endereco: 'Rua Gen. Joaquim Inácio, 200 - Ilha do Leite', horario: '07:00 às 19:00',
    telefone: '(81) 3355-4653', servicos: ['clinica', 'enfermagem', 'odonto', 'prenatal', 'puericultura', 'hiperdia', 'vacinacao', 'curativos'],
  },
];

export const medico = { nome: 'Dra. Ana Carolina Martins', crm: 'CRM 58291', iniciais: 'AC' };

export const datasDisponiveis = ['2026-11-12', '2026-11-13', '2026-11-16', '2026-11-17'];
export const horariosDisponiveis = ['08:00', '08:30', '09:00', '09:30', '10:30', '14:00'];
export const horarioPadrao = { data: '2026-11-01', hora: '09:30' };

export const servicosPopulares = ['clinica', 'enfermagem', 'odonto', 'vacinacao', 'psicologia', 'nutricao']
  .map((id) => buscar(servicos, id));

// Com rota, a ação navega. Sem rota, abre o modal indicado em `modal`.
export const acoesRapidas: {
  id: string; titulo: string; descricao: string; icone: LucideIcon; tom: string; rota: string | null; modal: 'consulta' | 'exame' | null;
}[] = [
  { id: 'consulta', titulo: 'Agendar consulta', descricao: 'Escolha especialidade, unidade e horário', icone: CalendarCheck, tom: 'turquesa', rota: null, modal: 'consulta' },
  { id: 'exame', titulo: 'Agendar exame', descricao: 'Laboratoriais e de imagem', icone: FlaskConical, tom: 'azul', rota: null, modal: 'exame' },
  { id: 'laudos', titulo: 'Ver meus laudos', descricao: 'Acompanhe resultados e baixe documentos', icone: Download, tom: 'roxo', rota: '/exames', modal: null },
];

export const examesRecentes = [
  { id: 'hemograma', nome: 'Hemograma completo', categoria: 'Laboratorial', solicitadoEm: '07/11', pronto: false, progresso: 72, legenda: 'Processando amostra', icone: FlaskConical, tom: 'azul' },
  { id: 'ultrassom', nome: 'Ultrassom abdominal', categoria: 'Imagem', solicitadoEm: '23/10', pronto: true, progresso: 100, legenda: 'Laudo disponível', icone: Activity, tom: 'roxo' },
];

export const hemograma = {
  nome: 'Hemograma completo',
  local: 'Laboratório Municipal',
  protocolo: '#LAB-88241',
  etapas: [
    { titulo: 'Coleta realizada', hora: '09 nov • 08:42', estado: 'feito' },
    { titulo: 'Amostra recebida', hora: '09 nov • 10:15', estado: 'feito' },
    { titulo: 'Em análise técnica', hora: 'Previsão: hoje até 18h', estado: 'atual' },
    { titulo: 'Laudo disponível', hora: 'Você será notificada', estado: 'pendente' },
  ],
};

export const ultrassom = {
  nome: 'Ultrassom abdominal',
  local: 'Centro de Diagnóstico',
  protocolo: '#IMG-41208',
  disponivelDesde: '25 out',
  assinadoPor: 'Dra. Camila Porto',
};

// ---------- Agendamento de exames ----------

export const categoriasExame = [
  { id: 'laboratorial', nome: 'Laboratoriais' },
  { id: 'imagem', nome: 'Imagem' },
];

export const catalogoExames: { id: string; nome: string; categoria: string; icone: LucideIcon; tom: string; preparo: string }[] = [
  { id: 'hemograma', nome: 'Hemograma completo', categoria: 'laboratorial', icone: Droplet, tom: 'azul', preparo: 'Jejum de 4 horas.' },
  { id: 'glicemia', nome: 'Glicemia em jejum', categoria: 'laboratorial', icone: FlaskConical, tom: 'turquesa', preparo: 'Jejum de 8 horas.' },
  { id: 'colesterol', nome: 'Colesterol e triglicerídeos', categoria: 'laboratorial', icone: HeartPulse, tom: 'rosa', preparo: 'Jejum de 12 horas.' },
  { id: 'urina', nome: 'Urina tipo 1', categoria: 'laboratorial', icone: Microscope, tom: 'verde', preparo: 'Primeira urina da manhã, jato médio.' },
  { id: 'ultrassom-abdominal', nome: 'Ultrassom abdominal', categoria: 'imagem', icone: Waves, tom: 'roxo', preparo: 'Jejum de 6 horas.' },
  { id: 'raio-x-torax', nome: 'Raio-X de tórax', categoria: 'imagem', icone: ScanLine, tom: 'laranja', preparo: 'Sem preparo especial.' },
  { id: 'densitometria', nome: 'Densitometria óssea', categoria: 'imagem', icone: Bone, tom: 'azul', preparo: 'Sem preparo especial. Evite suplementos de cálcio no dia.' },
];

export const datasExame = ['2026-11-12', '2026-11-13', '2026-11-16', '2026-11-17'];
export const horariosExame = ['07:00', '07:30', '08:00', '08:30', '09:00', '10:00'];
export const exameHorarioPadrao = { data: '2026-11-12', hora: '07:30' };

// ---------- Notificações ----------

export interface Notificacao {
  id: number; titulo: string; texto: string; tempo: string; lida: boolean; rota: string | null; icone: LucideIcon; tom: string;
}

export const notificacoesIniciais: Notificacao[] = [
  { id: 1, titulo: 'Consulta confirmada', texto: 'Clínica médica com Dra. Ana Carolina Martins, dia 16 de novembro às 09:30.', tempo: 'Há 2 horas', lida: false, rota: '/consultas', icone: CalendarCheck, tom: 'turquesa' },
  { id: 2, titulo: 'Hemograma em análise técnica', texto: 'Seu exame está sendo analisado. Previsão de resultado: hoje até 18h.', tempo: 'Há 5 horas', lida: false, rota: '/exames', icone: FlaskConical, tom: 'azul' },
  { id: 3, titulo: 'Laudo disponível', texto: 'O laudo do Ultrassom abdominal já pode ser acessado, com confirmação de identidade.', tempo: '25 out', lida: true, rota: '/exames', icone: Activity, tom: 'roxo' },
  { id: 4, titulo: 'Campanha de vacinação', texto: 'Vacinação contra a gripe disponível na Policlínica Lessa de Andrade até 18 de novembro.', tempo: '24 out', lida: true, rota: '/unidades', icone: Syringe, tom: 'laranja' },
];

export function buscar<T extends { id: string }>(lista: T[], id: string) {
  return lista.find((item) => item.id === id)!;
}

// O meio-dia evita que o fuso horário mude o dia.
const paraData = (iso: string) => new Date(`${iso}T12:00:00`);
const abreviar = (texto: string) => texto.replace('.', '').toUpperCase();

export const dia = (iso: string) => String(paraData(iso).getDate());
export const mesCurto = (iso: string) => abreviar(new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(paraData(iso)));
export const semanaCurta = (iso: string) => abreviar(new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(paraData(iso)));
export const dataExtensa = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(paraData(iso));
export const distancia = (km: number) => `${km.toLocaleString('pt-BR')} km`;
