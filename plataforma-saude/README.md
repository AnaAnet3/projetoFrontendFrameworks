# Plataforma de Saúde

Protótipo em React + TypeScript + Vite, com `react-router-dom` e `lucide-react`.

```bash
npm install
npm run dev
```

## Arquivos

```
src/
  dados.ts          dados de exemplo e funções de formatação
  contexto.tsx      consultas, exames agendados, notificações e estado dos modais
  Layout.tsx        menu lateral, topo (com o sininho) e área da página
  Componentes.tsx   Modal, Abas, Aviso, CartaoConsulta e peças dos agendamentos (Passos, SeletorUnidade, SeletorDataHora)
  Agendamento.tsx   modal de agendamento de consulta em 3 passos
  AgendamentoExame.tsx  modal de agendamento de exame em 3 passos
  Notificacoes.tsx  modal de notificações (sininho do topo)
  paginas/          Inicio, Consultas, Exames, Unidades, Ajuda
  base.css          variáveis, reset e estilos compartilhados
  layout.css        menu, topo, abas e aviso
  modais.css        modais, agendamento e código de verificação
  paginas.css       estilos das páginas
```

## Histórico de alterações

Todas as mudanças ficam registradas em [`../ALTERACOES.md`](../ALTERACOES.md). Registre a sua lá antes de enviar.

## Ainda é simulado

Não há backend. Login, horários, envio do código e download de laudos são fictícios, e os agendamentos
(consultas e exames) e as notificações somem ao recarregar a página. A data de "hoje" é fixa em `dados.ts`.
