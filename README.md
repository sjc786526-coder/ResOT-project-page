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
.nojekyll                        关闭 GitHub Pages 的 Jekyll 处理
```

---

## 如何更新（都只改 `assets/js/config.js`）

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

```js
venue: 'Under review at ICLR 2027',
```

留 `null` 则该行完全不显示。

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
- 本仓库不包含论文 PDF。paper 链接一律指向 arXiv 官方页面。
- 首页的 overview 配图可以点开看全分辨率原图，会在**新标签页**打开，
  看完直接关掉标签页即可回到主页，不会顶掉当前页面。
- 页面上的所有科研信息以论文原文为准；未确定的信息保持占位，不做推测性填写。
