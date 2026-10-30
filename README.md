# Valorantdle

Jogo de adivinhação de Valorant inspirado no [Loldle](https://loldle.net).

**Jogue em:** [valorantdle.vercel.app](https://valorantdle.vercel.app)

## Modos

- **Agente**: adivinhe o agente secreto. Cada palpite mostra se gênero, função e ano de lançamento batem com a resposta.
- **Habilidade**: adivinhe de quem é a habilidade. O ícone desvira após 3 erros e o nome aparece após 6.

Cada modo tem duas variantes:

- **Diário**: um desafio por dia, igual para todo mundo (vira à meia-noite de Brasília). O progresso fica salvo no navegador.
- **Infinito**: rodadas aleatórias sem limite.

## Rodando localmente

```bash
npm install
npm start      # http://localhost:3000
npm test       # testes de lógica
npm run build  # build de produção
```

## Estrutura

```
src/
├── App.js                 # layout, abas e rotas (#/agente, #/habilidade)
├── components/            # peças de UI reutilizáveis (busca, tabela, resultado…)
├── context/AgentsContext  # carrega os agentes uma vez e compartilha com o app
├── data/agentMeta.js      # gênero e ano de lançamento (a API não fornece)
├── hooks/                 # estado da partida, variante, contagem regressiva, rota
├── modes/                 # cada modo de jogo; GuessMode é a base comum
├── services/valorantApi   # busca e normaliza dados da valorant-api.com (com cache)
└── utils/                 # comparação de palpites, sorteio diário, localStorage
```

### Adicionando um agente novo

A API já traz o agente automaticamente. Só falta adicionar o gênero e o ano em `src/data/agentMeta.js`.

### Adicionando um modo novo

Crie um componente em `src/modes/` usando `GuessMode` (veja `AbilityMode.js`) e registre-o na lista `MODES` em `App.js`.

---

Projeto de fã, sem vínculo com a Riot Games. Dados de [valorant-api.com](https://valorant-api.com).
