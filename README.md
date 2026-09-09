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
assets/paper/resot-paper.pdf     论文 PDF（当前为 ICLR 待提交的双盲匿名版）
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

### 3. 维护作者与单位

当前署名顺序为 Chen Zhao、Xingping Dong、Chong Wang、Liang Peng、Jiachun Shi、
Zhen Lei、Ran He、Bo Du。Xingping Dong 是第二作者兼唯一通讯作者，以 `†` 标记；
没有共同第一作者。雷震和赫然所属单位为中国科学院自动化研究所，其余作者为武汉大学计算机学院。
姓名链接使用 OpenReview 个人页，通讯作者邮箱显示在作者说明中。

后续修改时保留 `authors` 的署名顺序，`affiliations` 引用对应单位的 `id`。以下仅为字段格式示例：

```js
affiliations: [
  { id: 1, name: 'Example University' },
  { id: 2, name: 'Example Lab' },
],
authors: [
  { name: 'First Author',  affiliations: [1], url: 'https://homepage' },
  { name: 'Second Author', affiliations: [1], note: '†' },
  { name: 'Third Author',  affiliations: [2] },
],
authorNotes: '† Corresponding author: Second Author.',
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
venue: 'ICLR 2027 — Abstract submitted',
```

留 `null` 则该行完全不显示。

当前已完成摘要提交，PDF 是最新可提交的双盲匿名版本。
全文正式提交后，先确认站点 PDF 与实际提交的版本一致，再同步更新 `venue`、
`paperPdf.label` 和 `paperPdf.note`，保持实际进度、版本说明与文件一致。
投稿状态仅用文字说明，不公开私有投稿链接、内部编号或邮件截图。

注意 `venue` 和 `status` 是两件独立的事：投稿去向不代表论文已在 arXiv 公开，
改其中一个不会影响另一个。

---

### 6. 论文 PDF 直链（当前为 ICLR 待提交的双盲匿名版）

页面上有一个 **ICLR Manuscript (PDF)** 按钮，点开在新标签页里用浏览器自带的阅读器打开论文，
效果和 arXiv 的 PDF 链接一样。

按钮文案点名了是 ICLR 稿件而不是笼统的 "Paper" —— 因为 arXiv 公开后两个按钮会并排，
读者需要一眼看出哪个是哪个。

这份 PDF 和 arXiv preprint 是两份不同的东西（一个是面向 ICLR 的稿件，一个是 arXiv 预印本），
所以 **arXiv 公开之后这个按钮不会消失**，两个按钮会并列显示，各指各的版本。

按钮下方有版本说明，讲清楚这份 PDF 是面向 ICLR 2027 的最新可提交版本，按双盲格式匿名。
匿名作者栏不影响本站单独展示真实署名。

```js
paperPdf: {
  enabled: true,
  src: 'assets/paper/resot-paper.pdf',
  label: 'ICLR Manuscript (PDF)',
  note: 'Latest submission-ready version for ICLR 2027, anonymized for double-blind review.',
},
```

`label` 是按钮文案，**必填**；留空整个按钮不渲染（代码里没有兜底文案，
免得把某个具体投稿去向写死在渲染逻辑里，日后改投别处就会说假话）。

`note` 是按钮下方那行小字，补充按钮放不下的信息（这里是“作者匿名”），
留成空字符串 `''` 则只显示按钮、不显示说明。

**换成非匿名的 preprint 版本时，`label` 和 `note` 都要跟着改**，否则文案会和文件对不上。

**换新版论文**：把新 PDF 覆盖到 `assets/paper/resot-paper.pdf`（文件名保持不变），
提交推送即可，`config.js` 和代码都不用动 —— `src` 是全站唯一写死 PDF 路径的地方。

当前 PDF 更新于 2026-09-07，是最新可提交的双盲匿名版（投稿阶段于 2026-09-10 更正）。
网站署名由作者提供，与 PDF 中的匿名作者栏分别维护。
换 PDF 时也要核对网页摘要和 overview 图：若新版改动了对应内容，须同步更新
`index.html` 的摘要与 `assets/img/resot-overview.png`，避免网页混用旧论文内容。

> 覆盖同名文件后浏览器可能还拿着旧版缓存，自己确认时按 Ctrl+F5 强制刷新。

**关掉它**：`enabled` 改成 `false`，按钮和下面那行说明一起消失，页面不留空位。
这是唯一的关闭方式 —— 它不会因为 arXiv 公开而自动隐藏。

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
- 本仓库包含一份论文 PDF（`assets/paper/resot-paper.pdf`），是面向 ICLR 2027 的最新可提交双盲匿名版
  （首页页眉 "Under review as a conference paper at ICLR 2027"，作者栏 "Anonymous authors"）。
  PDF 页眉及匿名作者栏属于排版模板；页面投稿进度由 `venue` 单独维护。
  页面上通过 `paperPdf.note` 说明其可提交状态及匿名格式。
- 它与 arXiv preprint 是两份不同的东西，长期并列保留，arXiv 公开后也不撤下。
  如果之后编译出署真实作者的 preprint 版本，覆盖同名文件并同步改掉 `label` 和 `note`。
- 首页的 overview 配图可以点开看全分辨率原图，会在**新标签页**打开，
  看完直接关掉标签页即可回到主页，不会顶掉当前页面。
- 页面上的所有科研信息以论文原文为准；未确定的信息保持占位，不做推测性填写。
