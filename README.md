# ResOT — Project Page

**ResOT** 论文项目主页的源码。纯静态站点（HTML + CSS + 少量原生 JS），
无框架、无构建步骤、无外部 CDN 依赖，由 GitHub Pages 直接从 `main` 分支根目录发布。

在线地址：<https://sjc786526-coder.github.io/ResOT-project-page/>

---

## 目录结构

```
index.html                       页面结构与静态内容（标题、Abstract）
assets/css/style.css             样式
assets/js/config.js              ★ 唯一需要长期维护的文件
assets/js/main.js                渲染逻辑（一般不用改）
assets/img/resot-overview.png    论文 Figure 2（method overview）
assets/img/favicon.svg           站点图标
assets/paper/resot-paper.pdf     论文 PDF（arXiv 公开前的过渡，公开后应删除）
.nojekyll                        关闭 GitHub Pages 的 Jekyll 处理
```

---

## 如何更新（基本只改 `assets/js/config.js`，换 PDF 时覆盖同名文件）

改完后：

```bash
git add -A
git commit -m "docs: update paper status"
git push
```

GitHub Pages 一般在 1 分钟内自动重新发布。

### 1. arXiv 状态切换

`config.status` 三选一：

| 值 | 页面显示 | 适用阶段 |
|---|---|---|
| `'coming-soon'` | Preprint — Coming Soon | 尚未提交 arXiv |
| `'arxiv-pending'` | arXiv Preprint — Submitted, Pending Announcement | 已提交，等待公开 |
| `'published'` | arXiv Preprint（按钮变为可点击） | arXiv 已正式公开 |

**arXiv 正式公开后要做两件事：**

```js
status: 'published',
links: {
  arxiv: 'https://arxiv.org/abs/XXXX.XXXXX',   // 换成真实地址
  code: null,
},
```

上面两处**改漏一处也不会出错**，页面会自己保持自洽：

| 你只改了 | 页面表现 |
|---|---|
| 只填 `links.arxiv`，忘了改 `status` | 按已公开渲染（徽章、按钮、footer 一致） |
| 只改 `status: 'published'`，没填链接 | 退回“Submitted, Pending Announcement”，按钮保持灰色 |
| `status` 拼错或漏填 | 归一到 `'coming-soon'`，不会出现徽章文字和配色对不上的情况 |

判断依据是 `links.arxiv`：arXiv 的 abs 页面只在正式公开后才存在，
所以只要这个链接填了，就说明论文已经公开。页面永远不会出现指向不存在页面的链接。

### 2. 代码公开后加 Code 链接

```js
links: {
  arxiv: '...',
  code: 'https://github.com/<user>/<repo>',
},
```

### 3. 补充作者与单位

```js
affiliations: [
  { id: 1, name: 'Example University' },
  { id: 2, name: 'Example Lab' },
],
authors: [
  { name: 'First Author',  affiliations: [1], url: 'https://homepage', note: '*' },
  { name: 'Second Author', affiliations: [1, 2] },
  { name: 'Third Author',  affiliations: [2], note: '†' },
],
authorNotes: '* Equal contribution.  † Corresponding author.',
```

- `authors` 为空数组时，页面显示一句中性占位说明，不会留空白。
- 只有一个单位时，上标编号会自动省略。

### 4. 启用可选的状态截图

例如 arXiv 提交回执：

1. 把图片放到 `assets/img/`（例如 `assets/img/arxiv-submission.png`）；
2. 修改配置：

```js
statusNote: {
  enabled: true,
  src: 'assets/img/arxiv-submission.png',
  alt: 'arXiv submission confirmation',
  caption: 'arXiv submission confirmation. The preprint is awaiting public announcement.',
},
```

`enabled: false` 时整个区块不会被渲染 —— 页面不会留下空框、空白或多余间距。

`status` 切到 `published` 之后，这张“等待公开”的回执截图会自动不再显示，
不需要回来手动改 `enabled`。

### 5. 公开投稿去向（可选）

当前值：

```js
venue: 'Submitted to ICLR 2027',
```

留 `null` 则该行完全不显示。

注意 `venue` 和 `status` 是两件独立的事：投稿去向不代表论文已在 arXiv 公开，
改其中一个不会影响另一个。

---

### 6. 论文 PDF 直链（arXiv 公开前的过渡）

arXiv 还没公开时，页面上会多出一个 **Paper (PDF)** 按钮，点开在新标签页里
用浏览器自带的阅读器打开论文，效果和 arXiv 的 PDF 链接一样。

按钮下方有一行版本说明，讲清楚这份 PDF 是哪个版本 —— 当前是 ICLR 正式投稿的双盲评审版，
所以文件里作者栏是匿名的，这行字用来解释这一点，避免读者误解。

```js
paperPdf: {
  enabled: true,
  src: 'assets/paper/resot-paper.pdf',
  label: 'Paper (PDF)',
  note: 'The linked PDF is the version submitted to ICLR 2027, anonymized for double-blind review.',
},
```

`note` 留成空字符串 `''` 则只显示按钮、不显示说明。
**换成非匿名的 preprint 版本时，记得把这句话一起改掉**，否则说明会和文件对不上。

**换新版论文**：把新 PDF 覆盖到 `assets/paper/resot-paper.pdf`（文件名保持不变），
提交推送即可，`config.js` 和代码都不用动 —— `src` 是全站唯一写死 PDF 路径的地方。

> 覆盖同名文件后浏览器可能还拿着旧版缓存，自己确认时按 Ctrl+F5 强制刷新。

**关掉它**：`enabled` 改成 `false`，按钮直接消失，页面不留空位。

**arXiv 公开后会自动撤下**：只要 `links.arxiv` 填上真实地址，这个按钮就不再渲染，
不需要回来改 `enabled`。但此时请**同时把 `assets/paper/resot-paper.pdf` 从仓库里删掉** ——
代码只是不再链接它，文件本身还在仓库里公开可访问。

---

## 本地预览

```bash
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

（直接双击 `index.html` 也能看，但用本地服务器更接近线上环境。）

---

## 注意事项

- `index.html` 中的 `og:url` / `og:image` 使用绝对地址，**仅在仓库改名或迁移时**需要同步更新，
  其余所有资源引用均为相对路径。
- 本仓库包含一份论文 PDF（`assets/paper/resot-paper.pdf`），仅作为 arXiv 公开前的过渡入口。
  arXiv 正式公开后，官方页面优先，按钮会自动撤下，届时请把该 PDF 文件一并从仓库删除。
- 当前这份 PDF 是 ICLR 正式投稿的双盲评审版（首页页眉 "Under review as a conference paper at
  ICLR 2027"，作者栏 "Anonymous authors"）。页面上已通过 `paperPdf.note` 明确标注了这一点。
  如果之后编译出署真实作者的 preprint 版本，覆盖同名文件并同步改掉 `note` 那句话即可。
- 首页的 overview 配图可以点开看全分辨率原图，会在**新标签页**打开，
  看完直接关掉标签页即可回到主页，不会顶掉当前页面。
- 页面上的所有科研信息以论文原文为准；未确定的信息保持占位，不做推测性填写。
