# Alfabeto

Extensão para Firefox que ordena as abas da janela atual por domínio, de A a Z.

- Ordena pelo domínio sem "www." (www.google.com e google.com ficam juntos; mail.google.com fica à parte) e, dentro do mesmo domínio, pelo título.
- Páginas sem domínio web (about:, file:, moz-extension:…) vão para o início.
- Abas fixadas não são mexidas.
- Cada grupo de abas é ordenado por dentro, sem sair do lugar; abas soltas entre grupos são ordenadas entre si.

## Uso

**Clique** no ícone da barra para ordenar as abas da janela.

## Instalação para desenvolvimento

Em `about:debugging#/runtime/this-firefox`, clique em **Carregar extensão temporária…** e escolha o `manifest.json`.

```sh
npx web-ext lint    # valida
npx web-ext build   # gera o .zip
npx web-ext sign --channel=unlisted --api-key=… --api-secret=…   # assina para instalar de vez
```

## Licença

[MPL 2.0](LICENSE)
