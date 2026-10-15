# Bundled site fonts

These Latin variable font files are bundled locally so the production build does not depend on `next/font/google` fetching or resolving Google Fonts at build time.

Downloaded 2026-10-15 from the official Google Fonts CSS2 assets:

- Inter, weights 400–600: `https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2`
- Orbitron, weights 700–900: `https://fonts.gstatic.com/s/orbitron/v35/yMJRMIlzdpvBhQQL_Qq7dy0.woff2`
- JetBrains Mono, weights 400–700: `https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwg.woff2`

The URLs correspond to the CSS2 requests for the existing Latin subsets. Each file was checked for the `wOF2` header (`119 79 70 50`) and SHA256 after download:

| File | Bytes | SHA256 |
| --- | ---: | --- |
| `inter-latin.woff2` | 48256 | `3100E775E8616CD2611BEECFA23A4263D7037586789B43F035236A2E6FBD4C62` |
| `orbitron-latin.woff2` | 11800 | `C25A9F9DA5D9F3DB1BF2A01474722DC9B377675B7BBAB6D0DFDA6902794FD1ED` |
| `jetbrains-mono-latin.woff2` | 31432 | `83C005D49D8A6A50474C73A5A36AC0468076E9C4A29DA7BDB14995D80560A5BE` |

The matching OFL-1.1 license texts are stored beside the font files. Sources:

- `https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt`
- `https://raw.githubusercontent.com/google/fonts/main/ofl/orbitron/OFL.txt`
- `https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/OFL.txt`
