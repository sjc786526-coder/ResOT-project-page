/* ResOT Project Page — 渲染逻辑
   本文件是纯逻辑，正常情况下不需要修改。要改内容请改 assets/js/config.js。 */

(function () {
  'use strict';

  var cfg = window.RESOT_CONFIG || {};
  var presets = cfg.statusPresets || {};
  var preset = presets[cfg.status] || presets['coming-soon'] || {};

  function $(id) { return document.getElementById(id); }

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

  if (cfg.venue) show($('venue'), String(cfg.venue));

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
        (cfg.authorsPlaceholder || '') + '</p>';
      return;
    }

    var order = affMap();
    var multiAff = (cfg.affiliations || []).length > 1;

    host.innerHTML = authors.map(function (a) {
      var name = a.url
        ? '<a href="' + a.url + '" target="_blank" rel="noopener">' + a.name + '</a>'
        : a.name;

      var marks = [];
      if (multiAff) {
        (a.affiliations || []).forEach(function (id) {
          if (order[id]) marks.push(order[id]);
        });
      }
      if (a.note) marks.push(a.note);

      return '<span class="author">' + name +
             (marks.length ? '<sup>' + marks.join(',') + '</sup>' : '') + '</span>';
    }).join('<span class="sep">, </span>');

    var affs = cfg.affiliations || [];
    if (affs.length) {
      show($('affiliations'), affs.map(function (a, i) {
        return (multiAff ? '<sup>' + (i + 1) + '</sup>' : '') + a.name;
      }).join('&nbsp;&nbsp; '));
    }

    if (cfg.authorNotes) show($('author-notes'), cfg.authorNotes);
  }

  renderAuthors();

  /* ---------------------------------------------------------- status --- */

  var statusHost = $('status');
  if (statusHost && preset.badge) {
    statusHost.innerHTML = '<span class="badge" data-status="' +
      (cfg.status || '') + '">' + preset.badge + '</span>';
  }

  /* ----------------------------------------------------------- links --- */

  function button(href, label, icon) {
    if (href) {
      return '<a class="btn btn--active" href="' + href + '" target="_blank" rel="noopener">' +
             icon + '<span>' + label + '</span></a>';
    }
    return '<span class="btn btn--pending" aria-disabled="true">' +
           icon + '<span>' + label + '</span></span>';
  }

  var links = cfg.links || {};
  var linkHost = $('links');
  if (linkHost) {
    linkHost.innerHTML = [
      button(links.arxiv, links.arxiv ? 'arXiv' : (preset.arxivButton || 'arXiv'), ICON.arxiv),
      button(links.code, links.code ? 'Code' : (cfg.codeButtonPending || 'Code'), ICON.code)
    ].join('');
  }

  /* ------------------------------------------------- optional status --- */
  /* enabled 为 false 或 src 为空时，整个 <section> 保持 hidden，
     不占据任何空间、不留空框。 */

  var note = cfg.statusNote || {};
  if (note.enabled && note.src) {
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
    footNote.textContent = (cfg.status === 'published')
      ? '\u00A9 ' + new Date().getFullYear() + ' The ResOT Authors.'
      : '\u00A9 ' + new Date().getFullYear() +
        ' The ResOT Authors. This page is updated as the preprint becomes publicly available.';
  }
})();
