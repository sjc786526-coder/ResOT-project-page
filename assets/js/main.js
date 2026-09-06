/* ResOT Project Page — 渲染逻辑
   本文件是纯逻辑，正常情况下不需要修改。要改内容请改 assets/js/config.js。 */

(function () {
  'use strict';

  var cfg = window.RESOT_CONFIG || {};
  var links = cfg.links || {};
  var presets = cfg.statusPresets || {};

  /* status 与 links.arxiv 必须自洽：只写了 'published' 却没填链接时，
     退回“已提交、待公开”，页面不做没有依据的断言。 */
  var status = cfg.status;
  if (status === 'published' && !links.arxiv) status = 'arxiv-pending';

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
           '<path d="M5.6 3.3 1 8l4.6 4.7.9-.9L2.8 8l3.7-3.8-.9-.9Zm4.8 0-.9.9L13.2 8l-3.7 3.8.9.9L15 8l-4.6-4.7Z"/></svg>'
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

  var linkHost = $('links');
  if (linkHost) {
    linkHost.innerHTML = [
      button(links.arxiv, links.arxiv ? 'arXiv' : (preset.arxivButton || 'arXiv'), ICON.arxiv),
      button(links.code, links.code ? 'Code' : (cfg.codeButtonPending || 'Code'), ICON.code)
    ].join('');
  }

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
