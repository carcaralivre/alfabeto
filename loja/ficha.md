# Alfabeto — ficha para addons.mozilla.org

**Atenção:** já existe um add-on chamado "Alfabeto" na AMO (slug `alfabeto`). Se o Developer Hub recusar o nome, use um dos reservas abaixo; o `name` do manifest pode continuar "Alfabeto".

- Nome: **Alfabeto** · reservas: "Alfabeto de Abas", "Abas em Alfabeto"
- Resumo (≤ 250): Ordena as abas da janela atual por domínio, de A a Z. Um clique no ícone e as abas do mesmo site ficam juntas, as mais raras primeiro. Abas fixadas e grupos ficam no lugar.
- Categorias: Abas · Produtividade
- Tags: abas, organizar, ordenar, domínio
- Licença: Mozilla Public License 2.0
- Site: https://github.com/carcaralivre/alfabeto · Suporte: (seu e-mail)
- Ícone: `icone-128.png`
- Capturas: 1) barra de abas bagunçada → 2) depois do clique (você tira)

## Descrição

Extensão para Firefox que ordena as abas da janela atual por domínio, de A a Z.

- Agrupa as abas pelo domínio sem "www." (www.google.com e google.com ficam juntos; mail.google.com fica à parte).
- Os domínios com menos abas vêm primeiro; em caso de empate, ordem alfabética do domínio. Dentro do mesmo domínio, ordena pelo título.
- Páginas sem domínio web (about:, file:, moz-extension:…) vão para o início.
- Abas fixadas não são mexidas.
- Cada grupo de abas é ordenado por dentro, sem sair do lugar; abas soltas entre grupos são ordenadas entre si.

Uso: clique no ícone da barra para ordenar as abas da janela.

Nenhum dado sai do navegador.

## Notas ao revisor (English)

Sorts the current window's tabs by domain on toolbar-button click. Uses only the `tabs` API (query, move, group/ungroup to preserve tab groups). No network requests, no storage, no content scripts. `icon.js` redraws the toolbar icon in the active theme's icon color via `theme.getCurrent()` (no `theme` permission needed). Source is the package itself (no build step).
