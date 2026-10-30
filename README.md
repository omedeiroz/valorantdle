# Valorantdle

Jogo de adivinhação de Valorant inspirado no [Loldle](https://loldle.net).

**Jogue em:** [valorantdle.vercel.app](https://valorantdle.vercel.app)

## Minigames

A tela inicial reúne todos os minigames e mostra quantos desafios de hoje você já concluiu. O menu lateral (☰) leva a qualquer minigame de qualquer tela.

- **Agente**: adivinhe o agente secreto. Cada palpite compara gênero, função, ano de lançamento, custo da ultimate e posição no ranking de pick da ranqueada dentro da função do agente (ex.: Jett é #1 entre os duelistas), com setas ▲▼ nos números.
- **Habilidade**: adivinhe de quem é a habilidade. O ícone desvira após 3 erros e o nome aparece após 6. Depois de acertar, tem um bônus de uma chance: qual tecla é (C, Q, E ou X).
- **Zoom**: adivinhe o agente por um pedaço bem ampliado do retrato, que abre um pouco a cada erro. No **Modo Radiante** dá para tirar a cor, girar a imagem ou os dois (as opções travam após o primeiro palpite).
- **Onde estou?** *(em breve)*: marcar no minimapa o local de uma imagem, no estilo LostGamer.

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
├── App.js                 # layout, abas e rotas (#/ menu, #/agente, #/habilidade, #/zoom)
├── components/            # peças de UI reutilizáveis (busca, tabela, resultado…)
├── context/AgentsContext  # carrega os agentes uma vez e compartilha com o app
├── data/agentMeta.js      # gênero e ano de lançamento (a API não fornece)
├── hooks/                 # estado da partida, variante, contagem regressiva, rota
├── modes/                 # cada minigame; registry.js lista todos, GuessMode é a base comum
├── services/valorantApi   # busca e normaliza dados da valorant-api.com (com cache)
└── utils/                 # comparação de palpites, sorteio diário, localStorage
```

### Adicionando um agente novo

A API já traz o agente automaticamente. Só falta preencher gênero, ano, custo da ultimate e ranking de pick em `src/data/agentMeta.js`.

### Atualizando o ranking de pick

Os números de `pick` em `src/data/agentMeta.js` são o ranking geral da ranqueada; o jogo calcula sozinho a posição dentro de cada função. A cada ato, atualize as posições e o texto de `PICK_SOURCE`, que aparece embaixo da tabela.

### Adicionando um minigame

Crie um componente em `src/modes/` (para jogos de adivinhar agente, use `GuessMode`, como em `AbilityMode.js`) e registre-o em `src/modes/registry.js`. Ele aparece sozinho no menu e nas abas.

---

Projeto de fã, sem vínculo com a Riot Games. Dados de [valorant-api.com](https://valorant-api.com).
