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
  contexto.tsx      consultas agendadas e estado do modal de agendamento
  Layout.tsx        menu lateral, topo e área da página
  Componentes.tsx   Modal, Abas, Aviso e CartaoConsulta
  Agendamento.tsx   modal de agendamento em 3 passos
  paginas/          Inicio, Consultas, Exames, Unidades, Ajuda
  base.css          variáveis, reset e estilos compartilhados
  layout.css        menu, topo, abas e aviso
  modais.css        modais, agendamento e código de verificação
  paginas.css       estilos das páginas
```

## Ainda é simulado

Não há backend. Login, horários, envio do código e download de laudos são fictícios, e os agendamentos
somem ao recarregar a página. A data de "hoje" é fixa em `dados.ts`.
