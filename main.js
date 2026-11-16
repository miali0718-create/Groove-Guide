/**
 * Groove Guide — main.js
 * 讀取 data/styles.json，負責首頁列表與共用介紹頁面的動態渲染。
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  const stylesGrid = document.getElementById('styles-grid');
  const detailContainer = document.getElementById('style-detail-container');

  try {
    const styles = await fetchStylesData();

    if (stylesGrid) {
      renderIndexPage(stylesGrid, styles);
    }

    if (detailContainer) {
      renderDetailPage(detailContainer, styles);
    }
  } catch (error) {
    handleError(error, stylesGrid || detailContainer);
  }
}

/**
 * 讀取 styles.json
 */
async function fetchStylesData() {
  const response = await fetch('data/styles.json');
  if (!response.ok) {
    throw new Error(`無法載入舞風資料庫 (HTTP ${response.status})`);
  }
  return await response.json();
}

/**
 * 首頁舞風列表渲染
 */
function renderIndexPage(container, styles) {
  if (!styles || styles.length === 0) {
    container.innerHTML = `
      <div class="state-box">
        <h3>目前無舞風資料</h3>
        <p>資料庫中尚未登記任何舞風。</p>
      </div>
    `;
    return;
  }

  const cardsHtml = styles.map(style => {
    return `
      <article class="style-card">
        <div>
          <div class="card-tag">ID: ${escapeHtml(style.id)}</div>
          <h3 class="card-title">${escapeHtml(style.name)}</h3>
          <p class="card-desc">${escapeHtml(style.description)}</p>
        </div>
        <div>
          <a href="style.html?id=${encodeURIComponent(style.id)}" class="card-link" aria-label="查看 ${escapeHtml(style.name)} 完整介紹">
            閱讀完整介紹 &rarr;
          </a>
        </div>
      </article>
    `;
  }).join('');

  container.innerHTML = cardsHtml;
}

/**
 * 共用介紹頁面 (style.html) 依網址參數渲染
 */
function renderDetailPage(container, styles) {
  const params = new URLSearchParams(window.location.search);
  const styleId = params.get('id');

  if (!styleId) {
    renderNotFound(container, '未提供舞風代碼 (ID)', styles);
    return;
  }

  const style = styles.find(s => s.id.toLowerCase() === styleId.toLowerCase());

  if (!style) {
    renderNotFound(container, `找不到代碼為「${escapeHtml(styleId)}」的舞風資料`, styles);
    return;
  }

  // 設定瀏覽器分頁標題
  document.title = `${style.name} — Groove Guide 街舞新手入門指南`;

  // 渲染動作技巧
  const movesHtml = renderMoves(style.moves);

  // 渲染個人觀察 (若為 null 顯示說明)
  const observationsHtml = style.personal_observations !== null && style.personal_observations !== undefined
    ? `<div class="block-text">${escapeHtml(style.personal_observations)}</div>`
    : `<div class="observation-empty">💡 目前無經使用者確認的個人觀察紀錄。</div>`;

  // 渲染資料來源
  const sourcesHtml = renderSources(style.sources);

  // 渲染其他舞風快速切換晶片
  const otherChips = styles.map(s => {
    const isCurrent = s.id === style.id;
    return `
      <a href="style.html?id=${encodeURIComponent(s.id)}" class="style-chip ${isCurrent ? 'active' : ''}">
        ${escapeHtml(s.name)}
      </a>
    `;
  }).join('');

  container.innerHTML = `
    <header class="detail-header">
      <nav class="breadcrumbs" aria-label="導覽路徑">
        <a href="index.html">首頁</a> &gt; <span>${escapeHtml(style.name)}</span>
      </nav>
      <span class="detail-id-badge">STYLE // ${escapeHtml(style.id)}</span>
      <h1 class="detail-title">${escapeHtml(style.name)}</h1>
      <p class="detail-lead">${escapeHtml(style.description)}</p>
    </header>

    <div class="detail-sections">
      <!-- 歷史與文化背景 -->
      <section class="detail-block">
        <h2 class="block-title">歷史與文化背景</h2>
        <div class="block-text">${escapeHtml(style.history)}</div>
      </section>

      <!-- 舞蹈特色 -->
      <section class="detail-block">
        <h2 class="block-title">舞蹈特色</h2>
        <div class="block-text">${escapeHtml(style.features)}</div>
      </section>

      <!-- 音樂特色 -->
      <section class="detail-block">
        <h2 class="block-title">音樂特色</h2>
        <div class="block-text">${escapeHtml(style.music)}</div>
      </section>

      <!-- 代表性動作或技巧 -->
      <section class="detail-block">
        <h2 class="block-title">代表性動作或技巧</h2>
        ${movesHtml}
      </section>

      <!-- 初學者入門建議 -->
      <section class="detail-block">
        <h2 class="block-title">初學者入門建議</h2>
        <div class="block-text">${escapeHtml(style.beginner_guide)}</div>
      </section>

      <!-- 個人觀察 -->
      <section class="detail-block">
        <h2 class="block-title">個人觀察與體悟</h2>
        ${observationsHtml}
      </section>

      <!-- 資料來源 -->
      <section class="detail-block">
        <h2 class="block-title">資料來源與文獻</h2>
        ${sourcesHtml}
      </section>
    </div>

    <!-- 底部切換其他舞風 -->
    <nav class="style-switch-nav" aria-label="切換其他舞風">
      <div class="section-label">MORE STYLES</div>
      <h3 style="font-size: 1.1rem; font-weight: 700;">探索其他街舞舞風</h3>
      <div class="chips-container">
        ${otherChips}
      </div>
    </nav>
  `;
}

/**
 * 動作技巧格式化
 */
function renderMoves(moves) {
  if (!moves || !Array.isArray(moves) || moves.length === 0) {
    return `<div class="block-text" style="color: var(--text-dim);">待查證 / 暫無動作資料</div>`;
  }

  const items = moves.map(move => {
    if (typeof move === 'object' && move !== null) {
      return `
        <div class="move-card">
          <div class="move-title">${escapeHtml(move.name || '')}</div>
          <div class="move-desc">${escapeHtml(move.description || '')}</div>
        </div>
      `;
    }
    return `
      <div class="move-card">
        <div class="move-title">${escapeHtml(move)}</div>
      </div>
    `;
  }).join('');

  return `<div class="moves-grid">${items}</div>`;
}

/**
 * 資料來源格式化
 */
function renderSources(sources) {
  if (!sources || !Array.isArray(sources) || sources.length === 0) {
    return `<div class="block-text" style="color: var(--text-dim);">待查證</div>`;
  }

  const items = sources.map(source => {
    const title = source.title || '參考資料';
    const author = source.author_institution ? ` | 機構/作者：${escapeHtml(source.author_institution)}` : '';
    const date = source.date_accessed ? ` | 查閱日期：${escapeHtml(source.date_accessed)}` : '';
    const url = source.url || '#';

    return `
      <li class="source-item">
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="source-link">
          ${escapeHtml(title)}
        </a>
        <div class="source-info">${author}${date}</div>
      </li>
    `;
  }).join('');

  return `<ul class="sources-list">${items}</ul>`;
}

/**
 * 找不到舞風時的處理
 */
function renderNotFound(container, message, styles) {
  const chips = (styles || []).map(s => `
    <a href="style.html?id=${encodeURIComponent(s.id)}" class="style-chip">
      ${escapeHtml(s.name)}
    </a>
  `).join('');

  container.innerHTML = `
    <div class="state-box">
      <h3>舞風未找到</h3>
      <p>${escapeHtml(message)}</p>
      <div style="margin-bottom: 1.5rem;">
        <div class="chips-container" style="justify-content: center;">
          ${chips}
        </div>
      </div>
      <a href="index.html" class="btn btn-primary">返回首頁</a>
    </div>
  `;
}

/**
 * 錯誤訊息顯示
 */
function handleError(error, container) {
  console.error('[Groove Guide] 載入失敗:', error);
  if (!container) return;

  const isLocalFile = window.location.protocol === 'file:';
  const localNotice = isLocalFile ? `
    <p style="margin-top: 1rem; color: #fbbf24; font-size: 0.85rem; text-align: left;">
      <strong>⚠️ 提示：</strong>您目前以本機檔案 (file://) 開啟，瀏覽器預設的安全性原則會阻擋讀取本地 JSON。<br>
      請使用 VS Code Live Server、Python 內建伺服器（<code>python -m http.server 8000</code>）或直接部署於 GitHub Pages 預覽。
    </p>
  ` : '';

  container.innerHTML = `
    <div class="state-box">
      <h3>無法讀取舞風資料</h3>
      <p>${escapeHtml(error.message)}</p>
      ${localNotice}
      <div style="margin-top: 1rem;">
        <a href="index.html" class="btn btn-outline">重新整理</a>
      </div>
    </div>
  `;
}

/**
 * 跳脫 HTML 防範 XSS
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
