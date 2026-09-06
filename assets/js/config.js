/* =============================================================================
 * ResOT Project Page — 站点配置（唯一需要长期维护的文件）
 *
 * 页面上所有“会随时间变化”的信息都集中在这里：
 *   1) 论文当前状态   -> status
 *   2) 论文/代码链接  -> links
 *   3) 作者与单位     -> authors / affiliations
 *   4) 投稿去向       -> venue
 *   5) 可选状态截图   -> statusNote
 *   6) 论文 PDF 直链   -> paperPdf
 *
 * 改完保存、提交、推送即可生效，不需要动 index.html。
 * 详细操作步骤见 README.md。
 * ========================================================================== */

window.RESOT_CONFIG = {

  /* ---------------------------------------------------------------------
   * 1. 论文当前状态
   *    可选值（三选一）：
   *      'coming-soon'    尚未提交 arXiv
   *      'arxiv-pending'  已提交 arXiv，等待正式公开（announcement）
   *      'published'      arXiv 已正式公开   <-- 切到这个时必须同时填 links.arxiv
   * ------------------------------------------------------------------- */
  status: 'arxiv-pending',

  /* ---------------------------------------------------------------------
   * 2. 资源链接
   *    未就绪的一律保持 null，页面会自动显示为“待公开”的灰色按钮。
   *    绝对不要为了让按钮变成可点而填写不存在的地址。
   * ------------------------------------------------------------------- */
  links: {
    // arXiv 摘要页，例如 'https://arxiv.org/abs/2601.01234'
    arxiv: null,
    // 代码仓库，例如 'https://github.com/<user>/ResOT'
    code: null,
  },

  /* ---------------------------------------------------------------------
   * 3. 作者与单位
   *    authors 为空数组时，页面显示一句中性占位说明，不会留下空白。
   *
   *    示例：
   *      affiliations: [
   *        { id: 1, name: 'Example University' },
   *        { id: 2, name: 'Example Lab' },
   *      ],
   *      authors: [
   *        { name: 'First Author',  affiliations: [1], url: 'https://...', note: '*' },
   *        { name: 'Second Author', affiliations: [1, 2] },
   *        { name: 'Third Author',  affiliations: [2], note: '†' },
   *      ],
   *      authorNotes: '* Equal contribution.  † Corresponding author.',
   *
   *    单位只有一个时，可以把 affiliations 留成一条，authors 里写 [1]。
   * ------------------------------------------------------------------- */
  affiliations: [],
  authors: [],
  authorNotes: '',

  /* ---------------------------------------------------------------------
   * 4. 投稿去向（可选）
   *    留 null 则完全不显示。
   *    注意这与 arXiv 状态是两件事：投稿去向不代表论文已公开，措辞不要混用。
   * ------------------------------------------------------------------- */
  venue: 'Submitted to ICLR 2027',

  /* ---------------------------------------------------------------------
   * 5. 可选的状态截图（例如 arXiv 提交回执）
   *    enabled 为 false 时，整个区块不会被渲染 —— 页面不留空框、不留多余间距。
   *    启用步骤：把图片放到 assets/img/ 下，填好 src，把 enabled 改成 true。
   * ------------------------------------------------------------------- */
  statusNote: {
    enabled: false,
    src: 'assets/img/arxiv-submission.png',
    alt: 'arXiv submission confirmation',
    caption: 'arXiv submission confirmation. The preprint is awaiting public announcement.',
  },

  /* ---------------------------------------------------------------------
   * 6. arXiv 公开前的论文 PDF 直链（可选）
   *
   *    点开后由浏览器自带的 PDF 阅读器显示，和 arXiv 上的 PDF 链接一样。
   *
   *    换新版论文：把新 PDF 覆盖到下面 src 指向的那个文件即可（保持文件名不变），
   *    这里和代码都不用改。src 是全站唯一写死 PDF 路径的地方。
   *
   *    enabled 为 false 或文件缺失时，按钮不出现，页面不留任何痕迹。
   *
   *    ★ links.arxiv 一填上，这个按钮会自动消失 —— arXiv 官方页面永远优先，
   *      本地 PDF 只是公开前的过渡。那时记得把 PDF 文件也从仓库里删掉。
   * ------------------------------------------------------------------- */
  paperPdf: {
    enabled: true,
    src: 'assets/paper/resot-paper.pdf',
    label: 'Paper (PDF)',
  },

  /* ---------------------------------------------------------------------
   * 7. 各状态下的展示文案（一般无需改动）
   * ------------------------------------------------------------------- */
  statusPresets: {
    'coming-soon': {
      badge: 'Preprint — Coming Soon',
      arxivButton: 'arXiv — Coming Soon',
    },
    'arxiv-pending': {
      badge: 'arXiv Preprint — Submitted, Pending Announcement',
      arxivButton: 'arXiv — Pending',
    },
    'published': {
      badge: 'arXiv Preprint',
      arxivButton: 'arXiv',
    },
  },

  codeButtonPending: 'Code — Coming Soon',

  authorsPlaceholder: 'Author list and affiliations will be released together with the preprint.',
};
