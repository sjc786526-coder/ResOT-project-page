/* ResOT Project Page — 渲染逻辑
   本文件是纯逻辑，正常情况下不需要修改。要改内容请改 assets/js/config.js。 */

(function () {
  'use strict';

  var cfg = window.RESOT_CONFIG || {};
  var links = cfg.links || {};
  var presets = cfg.statusPresets || {};

  /* status 与 links.arxiv 必须自洽，两个方向都要管：
       写了 'published' 却没填链接 -> 退回“已提交、待公开”，不做没有依据的断言；
       填了链接却忘了改 status -> 视为已公开（arXiv 的 abs 页面只在正式公开后存在）。
     status 拼错或漏填时归一到最保守的 'coming-soon'，不会出现徽章文字和配色对不上的情况。 */
  var status = cfg.status;
  if (!presets[status]) status = 'coming-soon';
  if (links.arxiv) status = 'published';
  else if (status === 'published') status = 'arxiv-pending';

  var preset = presets[status] || presets['coming-soon'] || {};

  function $(id) { return document.getElementById(id); }

  /* config.js 里的内容都是普通文本，拼进 HTML 前统一转义，
     这样作者名、单位名、链接里出现 & < > " ' 也不会弄坏页面。 */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function show(el, html) {
    if (!el) return;
    el.innerHTML = html;
    el.hidden = false;
  }

  var ICON = {
    arxiv: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
           '<path d="M9.5 1H4a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 4 15h8a1.5 1.5 0 0 0 1.5-1.5V5L9.5 1Zm0 1.6L11.9 5H9.5V2.6ZM5 8h6v1.1H5V8Zm0 2.6h6v1.1H5v-1.1Z"/></svg>',
    code:  '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
           '<path d="M5.6 3.3 1 8l4.6 4.7.9-.9L2.8 8l3.7-3.8-.9-.9Zm4.8 0-.9.9L13.2 8l-3.7 3.8.9.9L15 8l-4.6-4.7Z"/></svg>',
    paper: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
           '<path d="M1.4 2.5c1.9-.6 3.9-.5 5.8.4v10.6c-1.9-.9-3.9-1-5.8-.4V2.5Zm7.4.4c1.9-.9 3.9-1 5.8-.4v10.6c-1.9-.6-3.9-.5-5.8.4V2.9Z"/></svg>'
  };

  /* ---------------------------------------------------------- venue ---- */

  if (cfg.venue) show($('venue'), esc(cfg.venue));

  /* -------------------------------------------------- authors / affil -- */

  function affMap() {
    var map = {};
    (cfg.affiliations || []).forEach(function (a, i) {
      map[a.id != null ? a.id : i + 1] = i + 1; // id -> 展示序号
    });
    return map;
  }

  function renderAuthors() {
    var host = $('authors');
    if (!host) return;

    var authors = cfg.authors || [];
    if (!authors.length) {
      host.innerHTML = '<p class="authors-placeholder">' +
        esc(cfg.authorsPlaceholder) + '</p>';
      return;
    }

    var order = affMap();
    var multiAff = (cfg.affiliations || []).length > 1;

    host.innerHTML = authors.map(function (a) {
      var name = a.url
        ? '<a href="' + esc(a.url) + '" target="_blank" rel="noopener">' + esc(a.name) + '</a>'
        : esc(a.name);

      var marks = [];
      if (multiAff) {
        (a.affiliations || []).forEach(function (id) {
          if (order[id]) marks.push(order[id]);
        });
      }
      if (a.note) marks.push(esc(a.note));

      return '<span class="author">' + name +
             (marks.length ? '<sup>' + marks.join(',') + '</sup>' : '') + '</span>';
    }).join('<span class="sep">, </span>');

    var affs = cfg.affiliations || [];
    if (affs.length) {
      show($('affiliations'), affs.map(function (a, i) {
        return (multiAff ? '<sup>' + (i + 1) + '</sup>' : '') + esc(a.name);
      }).join('&nbsp;&nbsp; '));
    }

    if (cfg.authorNotes) show($('author-notes'), esc(cfg.authorNotes));
  }

  renderAuthors();

  /* ---------------------------------------------------------- status --- */

  var statusHost = $('status');
  if (statusHost && preset.badge) {
    statusHost.innerHTML = '<span class="badge" data-status="' +
      esc(status) + '">' + esc(preset.badge) + '</span>';
  }

  /* ----------------------------------------------------------- links --- */

  function button(href, label, icon) {
    if (href) {
      return '<a class="btn btn--active" href="' + esc(href) + '" target="_blank" rel="noopener">' +
             icon + '<span>' + esc(label) + '</span></a>';
    }
    return '<span class="btn btn--pending" aria-disabled="true">' +
           icon + '<span>' + esc(label) + '</span></span>';
  }

  /* 本地论文 PDF 直链（具体版本及投稿阶段由配置说明）。
     它和 arXiv preprint 是两份不同的东西，因此 arXiv 公开后这个按钮不会撤下，
     两者并列显示，各自指向各自的版本。
     enabled、src、label 缺任何一个都视为配置不完整，整个按钮不出现，不留空位。
     label 是必填项：这里不设兜底文案，因为兜底只能写死某个具体版本
     （"Paper" 太笼统，"ICLR Submission" 则是把投稿去向这个事实断言写进渲染逻辑，
     日后改投别处就会变成假话）。文案属于配置，缺了就别渲染。 */
  var pdf = cfg.paperPdf || {};
  var showPdf = !!(pdf.enabled && pdf.src && pdf.label);

  var linkHost = $('links');
  if (linkHost) {
    linkHost.innerHTML = [
      showPdf ? button(pdf.src, pdf.label, ICON.paper) : '',
      button(links.arxiv, links.arxiv ? 'arXiv' : (preset.arxivButton || 'arXiv'), ICON.arxiv),
      button(links.code, links.code ? 'Code' : (cfg.codeButtonPending || 'Code'), ICON.code)
    ].join('');
  }

  /* PDF 的版本说明与按钮同进同退：按钮不出现时这行也不出现。 */
  if (showPdf && pdf.note) show($('paper-note'), esc(pdf.note));

  /* ------------------------------------------------- optional status --- */
  /* enabled 为 false 或 src 为空时，整个 <section> 保持 hidden，
     不占据任何空间、不留空框。
     已正式公开后，“等待公开”的提交回执截图不再适用，一律不显示，
     这样切到 published 时不用记得回来关掉它。 */

  var note = cfg.statusNote || {};
  if (note.enabled && note.src && status !== 'published') {
    var img = $('status-note-img');
    var cap = $('status-note-caption');
    var sec = $('status-note');
    if (img && sec) {
      img.src = note.src;
      img.alt = note.alt || '';
      if (cap) {
        if (note.caption) cap.textContent = note.caption;
        else cap.remove();
      }
      sec.hidden = false;
    }
  }

  /* ---------------------------------------------------------- footer --- */

  var footNote = $('footer-note');
  if (footNote) {
    footNote.textContent = (status === 'published')
      ? '\u00A9 ' + new Date().getFullYear() + ' The ResOT Authors.'
      : '\u00A9 ' + new Date().getFullYear() +
        ' The ResOT Authors. This page is updated as the preprint becomes publicly available.';
  }
})();
