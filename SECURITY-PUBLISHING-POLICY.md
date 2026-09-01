# Política obrigatória de segurança para publicação

Execute esta política antes de cada `git add`, commit, push ou atualização deste repositório público.

## Regras

1. Bloqueie arquivos `.env`, credenciais, tokens, cookies, chaves, bancos locais, logs e dados pessoais.
2. Bloqueie `node_modules/`, caches, cobertura, artefatos de IDE e arquivos temporários.
3. Verifique o pacote, o diff e todo o histórico Git com busca de segredos.
4. Execute `npm audit` em cada projeto e registre os achados sem aplicar correções incompatíveis sem testes.
5. Procure execução de comandos, `eval`, path traversal, SSRF, injeções e exposição de arquivos ou ambiente.
6. Preserve licenças e publique somente material relacionado à certificação.
7. Execute todos os testes antes do push.
8. Registre data, escopo, achados, decisão, testes e hash liberado em `SECURITY-AUDIT-LOG.md`.

## Condição de bloqueio

Não publique quando existir segredo provável, arquivo proibido, teste com falha ou achado crítico sem tratamento. Corrija o problema e repita a auditoria.
