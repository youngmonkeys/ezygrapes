# Hướng dẫn build ezygrapes

## 1. Cài đặt dependencies (root monorepo)

Repo này dùng **pnpm workspace** (xem `packageManager: pnpm@9.10.0` trong `package.json` và `pnpm-workspace.yaml`). **Không dùng `npm i`** ở thư mục gốc — package `packages/core` khai báo dependency bằng cú pháp `workspace:^` mà npm không hỗ trợ, sẽ luôn báo lỗi crash.

Cài pnpm (nếu chưa có):

```bash
npm install -g pnpm@9.10.0
```

Cài dependencies:

```bash
pnpm install
```

## 2. Build toàn bộ monorepo

```bash
pnpm build          # build tất cả package trong workspace (packages/core, packages/cli, docs)
pnpm build:core      # chỉ build package grapesjs (core)
pnpm build:cli       # chỉ build grapesjs-cli
pnpm build:docs      # chỉ build docs
pnpm --filter <package-name> build   # build 1 package cụ thể theo tên trong package.json
```

## 3. Build plugin `preset-webpage`

`plugins/preset-webpage` **không nằm trong pnpm workspace** (chỉ `packages/cli`, `packages/core`, `docs/` mới thuộc workspace). Đây là package độc lập, quản lý bằng npm riêng trong chính thư mục của nó.

### Yêu cầu: Node 18

Plugin dùng `node-sass@9` để build CSS, và `node-sass` không hỗ trợ Node 25 (bản mới đang dùng mặc định) — build sẽ lỗi native binding. Cần dùng Node 18 qua `nvm`.

Cài nvm (một lần):

```bash
brew install nvm
mkdir -p ~/.nvm
# thêm vào ~/.zshrc:
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
[ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"
```

Cài Node 18 (một lần):

```bash
nvm install 18
```

### Build

```bash
cd plugins/preset-webpage
nvm use 18
npm install     # chỉ cần lại nếu đổi Node version hoặc node_modules chưa từng cài với Node 18
npm run build
```

Output: `plugins/preset-webpage/dist/ezygrapes-preset-webpage.min.js` và `.min.css`.

### Lưu ý

- Script `build` tự động bump patch version (`npm version patch`) trong `package.json` mỗi lần chạy — kiểm tra lại version trước khi commit.
- Nếu chỉ cần build lại JS (không đổi CSS), có thể chạy trực tiếp:
  ```bash
  npx webpack --config webpack.prod.js
  ```
- `npm run start` chạy dev server (webpack serve + watch CSS).
