# Alfabeto

Extensão para Firefox que ordena as abas da janela atual por domínio, de A a Z.

- Agrupa as abas pelo domínio sem "www." (www.google.com e google.com ficam juntos; mail.google.com fica à parte).
- Os domínios com menos abas vêm primeiro; em caso de empate, ordem alfabética do domínio. Dentro do mesmo domínio, ordena pelo título.
- Páginas sem domínio web (about:, file:, moz-extension:…) vão para o início.
- Abas fixadas não são mexidas.
- Cada grupo de abas é ordenado por dentro, sem sair do lugar (a contagem de abas por domínio é feita dentro do grupo); abas soltas entre grupos são ordenadas entre si.

## Uso

**Clique** no ícone da barra para ordenar as abas da janela.

## Desenvolvimento

```sh
npx web-ext lint    # valida
npx web-ext build   # gera o .zip em web-ext-artifacts/
npx web-ext sign --channel=unlisted --api-key=… --api-secret=…   # assina e gera o .xpi
npx web-ext sign --channel=listed --api-key=… --api-secret=…     # submete à revisão da loja (addons.mozilla.org)
```

Toda alteração precisa de um novo `version` no `manifest.json` antes de assinar.

## Licença

[MPL 2.0](LICENSE)
