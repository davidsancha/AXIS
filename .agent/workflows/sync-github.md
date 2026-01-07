---
description: Sincroniza o projeto com o GitHub usando commits sequenciais.
---

Este workflow automatiza o processo de commit e push para o GitHub, garantindo que cada atualização receba um número sequencial.

1. Leia o arquivo `metadata.json` para obter o `last_commit_number`.
2. Incremente o `last_commit_number`.
3. Atualize o `metadata.json` com o novo número.
// turbo
4. Execute os comandos de git para adicionar as mudanças, fazer o commit com o número sequencial (ex: "Atualização 02") e dar push.

```powershell
git add .
git commit -m "Atualização $(Get-Content metadata.json | ConvertFrom-Json | Select-Object -ExpandProperty last_commit_number | ForEach-Object { $_.ToString('00') })"
git push
```
