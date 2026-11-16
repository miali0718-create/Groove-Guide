# Groove Guide｜街舞新手入門指南

## 專案介紹

Groove Guide 是一個提供街舞初學者認識不同街舞舞風的網站。

本專案介紹 Hip-hop、Popping、Locking、Breaking、Waacking 及 Krump 六種舞風，協助初學者了解各種舞風的歷史背景、特色、音樂及入門技巧。

本專案的核心不只是建立網站，而是設計一套可重複使用的 AI 工作規則，讓 AI 能依照固定規範快速新增舞風資料，不需要每次重新設計或建立整個網頁。

## 網站網址

- GitHub Pages：https://miali0718-create.github.io/Groove-Guide/
- GitHub Repository：https://github.com/miali0718-create/Groove-Guide

## 使用技術

- HTML：建立網站頁面結構。
- CSS：控制網站視覺樣式。
- JavaScript：讀取及呈現舞風資料。
- JSON：儲存各種舞風的介紹內容。
- GitHub Pages：部署靜態網站。

## 專案資料夾架構

```text
Groove-Guide/
├── AGENTS.md
├── DECISIONS.md
├── README.md
├── index.html
├── style.html
├── css/
│   └── style.css
├── data/
│   └── styles.json
└── js/
    └── main.js
```

## 六種舞風

1. Hip-hop
2. Popping
3. Locking
4. Breaking
5. Waacking
6. Krump

## AI 規則化新增舞風方式

本專案使用共用 HTML 模板搭配 JSON 資料管理，避免每新增一種舞風就重新建立一個網頁。

未來若要新增舞風，AI 應遵循以下流程：

1. 先閱讀 `AGENTS.md`，了解專案規則。
2. 檢查 `data/styles.json`，確認是否已存在該舞風。
3. 查找可信賴的資料來源。
4. 依照既有 JSON 欄位格式建立新資料。
5. 將新資料加入 `data/styles.json`，保留原有舞風內容。
6. 確認首頁能連結至新增舞風。
7. 確認共用介紹頁能正確讀取新增資料。
8. 檢查 JSON 格式及網站功能。

新增舞風時，不應任意更改原有資料結構或重新建立整份 HTML 頁面。

## 個人經驗資料規範

每種舞風都有獨立的 `personal_observations` 欄位，用來記錄使用者的個人舞蹈經驗與觀察。

- 使用者尚未提供內容時，欄位使用 `null`。
- AI 不得自行編造使用者的親身經驗。
- 新增舞風時，不得覆蓋或刪除其他舞風原有的個人經驗。

## AI 工作規則

`AGENTS.md` 是本專案的主要 AI 工作規範，包含：

- 專案架構與技術規範
- JSON 資料格式
- 新增舞風 SOP
- 資料來源規範
- 網站設計規範
- AI 修改限制及完成檢查清單

未來進行專案擴充時，應先閱讀並遵循這份文件。

## 專案核心目標

建立一套可重複使用、容易擴充的 AI 網站內容製作流程，讓 AI 能在既有規則下快速新增內容，同時維持原有網站架構及資料完整性。
