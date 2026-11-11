# Plataforma de Saúde


## Alunos
1. Ana Anete Higino de V. Pereira  - 018 164 89
2. Danilo Lopes Cavalcanti - 017 930 99
3. João Lucas Araújo de Almeida -  017 935 71
4. João Victhor P. Caribé de Carvalho - 017 991 25
5. João Vitor Vieira Souto - 017 959 46


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
  Perfil.tsx        modal de perfil da usuária (cadastro no canto superior direito)
  paginas/          Inicio, Consultas, Exames, Unidades, Ajuda
  base.css          variáveis, reset e estilos compartilhados
  layout.css        menu, topo, abas e aviso
  modais.css        modais, agendamento e código de verificação
  paginas.css       estilos das páginas
```


## Ainda é simulado

Não há backend. Login, horários, envio do código e download de laudos são fictícios, e os agendamentos
(consultas e exames) e as notificações somem ao recarregar a página. A data de "hoje" é fixa em `dados.ts`.
