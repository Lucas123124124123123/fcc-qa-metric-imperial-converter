# freeCodeCamp — Quality Assurance Projects

Os cinco projetos da certificação Quality Assurance do freeCodeCamp.

| Projeto | Pasta | Testes |
|---|---|---|
| Metric-Imperial Converter | `metric-imperial-converter/` | 16 unit + 5 funcionais |
| Issue Tracker | `issue-tracker/` | 14 funcionais |
| Personal Library | `personal-library/` | 10 funcionais |
| Sudoku Solver | `sudoku-solver/` | 12 unit + 14 funcionais |
| American British Translator | `american-british-translator/` | 24 unit + 6 funcionais |

## Como rodar qualquer um deles

```
cd <pasta-do-projeto>
npm install
cp sample.env .env      # e adicione a linha NODE_ENV=test
npm test
```

## Observação sobre armazenamento

Issue Tracker e Personal Library guardam os dados num arquivo JSON local
(`models/store.js`), sem depender de banco externo. A lógica de dados está isolada
nesse arquivo: trocar por MongoDB não exige alterar as rotas.
