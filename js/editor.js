/* ============================================================================
   editor.js — in-site content editor.

   Click the small dot next to the site name in the navbar, then click
   "UNLOCK EDITOR" 5 times to reveal the editor dashboard. From there you
   can manage skins, servers, the reviews button, and the thumbnails
   gallery + order button — all from the browser, no code required.

   IMPORTANT — HOW THIS ACTUALLY WORKS (read this):
   This is a plain static website with no server/database behind it.
   Edits made here are saved in THIS BROWSER ONLY (localStorage), so only
   you (on this device/browser) will see them while you're working.
   To make changes visible to every visitor, use the "Export content.js"
   button after editing, then upload that file to your GitHub repo,
   replacing js/content.js. That's what actually publishes changes.

   NOTE: there is no password on this — clicking the dot and pressing the
   button 5 times opens the editor for anyone who finds it. That's fine
   in practice: nothing done here changes your live site until you
   deliberately export and re-upload content.js, so a visitor poking
   around can only affect their own browser's local preview, never your
   published site.
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_DATA_KEY = "gb_content_data";
  const STORAGE_OPEN_KEY = "gb_editor_open";
  const UNLOCK_CLICKS_NEEDED = 5;
  const UNLOCK_CLICK_TIMEOUT_MS = 4000; // clicks must land within this window of each other

  // Apply any locally-saved edits over the shipped content.js BEFORE
  // main.js reads window.SITE_CONTENT.
  (function applySavedOverride() {
    try {
      const saved = localStorage.getItem(STORAGE_DATA_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          window.SITE_CONTENT = parsed;
        }
      }
    } catch (e) {
      console.error("Could not load saved editor data, using shipped content.js instead:", e);
    }
  })();

  function getData() {
    return window.SITE_CONTENT;
  }

  function persist(data, opts) {
    opts = opts || {};
    window.SITE_CONTENT = data;
    try {
      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      alert("Could not save changes in this browser (storage may be full or disabled).");
      return;
    }
    if (opts.reload !== false) {
      location.reload();
    }
  }

  function isOpen() {
    return sessionStorage.getItem(STORAGE_OPEN_KEY) === "1";
  }

  /* ---------------------------- MODAL HELPERS ---------------------------- */
  function closeModal() {
    const existing = document.querySelector(".gb-modal-overlay");
    if (existing) existing.remove();
  }

  function openModal(innerHtml, wide) {
    closeModal();
    const overlay = document.createElement("div");
    overlay.className = "gb-modal-overlay";
    overlay.innerHTML = `<div class="gb-modal${wide ? " gb-modal-wide" : ""}">${innerHtml}</div>`;
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    document.body.appendChild(overlay);
    document.addEventListener("keydown", escToClose);
    return overlay.querySelector(".gb-modal");
  }

  function escToClose(e) {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escToClose);
    }
  }

  function esc(str) {
    if (str === undefined || str === null) return "";
    return String(str).replace(/"/g, "&quot;");
  }

  /* ---------------------------- UNLOCK GATE (click 5 times) ---------------------------- */
  function openUnlockGate() {
    const modal = openModal(`
      <div class="gb-gate">
        <h2 class="gb-gate-title">THE EDITOR</h2>
        <button class="gb-btn gb-primary gb-unlock-btn" id="gbUnlockBtn" type="button">UNLOCK EDITOR</button>
        <p class="gb-hint" id="gbUnlockHint">Click ${UNLOCK_CLICKS_NEEDED} times to reveal!</p>
      </div>
    `);

    let clicks = 0;
    let resetTimer = null;
    const btn = modal.querySelector("#gbUnlockBtn");
    const hint = modal.querySelector("#gbUnlockHint");

    btn.addEventListener("click", () => {
      clicks++;
      const remaining = UNLOCK_CLICKS_NEEDED - clicks;
      if (remaining > 0) {
        hint.textContent = `${remaining} more click${remaining === 1 ? "" : "s"}...`;
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          clicks = 0;
          hint.textContent = `Click ${UNLOCK_CLICKS_NEEDED} times to reveal!`;
        }, UNLOCK_CLICK_TIMEOUT_MS);
      } else {
        clearTimeout(resetTimer);
        sessionStorage.setItem(STORAGE_OPEN_KEY, "1");
        openDashboard();
      }
    });
  }

  /* ---------------------------- DASHBOARD ---------------------------- */
  function openDashboard() {
    const d = getData();
    const highlights = (d.home && d.home.highlights) || [];
    const servers = d.servers || [];
    const gallery = (d.thumbnails && d.thumbnails.gallery) || [];

    const skinCardsHtml = highlights
      .map(
        (h) => `
      <div class="gb-mini-card">
        <div class="gb-mini-thumb"><img src="${esc(h.skin)}" alt="${esc(h.title)}" onerror="this.style.opacity=0"></div>
        <strong>${esc(h.title)}</strong>
      </div>`
      )
      .join("") || `<p class="gb-hint">No slides yet.</p>`;

    const galleryCardsHtml = gallery
      .slice(0, 6)
      .map(
        (g) => `
      <div class="gb-mini-card gb-mini-card-square">
        <div class="gb-mini-thumb"><img src="${esc(g.image)}" alt="${esc(g.caption)}" onerror="this.style.opacity=0"></div>
      </div>`
      )
      .join("") || `<p class="gb-hint">No gallery images yet.</p>`;

    const serverListHtml = servers
      .map((s) => `<div class="gb-mini-row">${esc(s.name)}</div>`)
      .join("") || `<p class="gb-hint">No servers yet.</p>`;

    const modal = openModal(`
      <h2 class="gb-gate-title" style="text-align:left;font-size:1.4rem;">THE EDITOR</h2>
      <p class="gb-sub">Changes save to this browser. Use "Export content.js" below afterwards to publish them for everyone.</p>

      <div class="gb-dash-grid">
        <div class="gb-dash-card">
          <div class="gb-dash-card-head">SKINS</div>
          <div class="gb-mini-grid">${skinCardsHtml}</div>
          <button class="gb-btn gb-small" id="gbEditHighlights" type="button">Manage Skins &amp; Slides</button>
        </div>

        <div class="gb-dash-card">
          <div class="gb-dash-card-head">SERVERS</div>
          <div class="gb-mini-list">${serverListHtml}</div>
          <button class="gb-btn gb-small" id="gbEditServers" type="button">Manage Servers</button>
        </div>

        <div class="gb-dash-card">
          <div class="gb-dash-card-head">REVIEWS</div>
          <a class="gb-btn gb-primary gb-mini-preview-btn" href="${esc(d.reviews.buttonLink)}" target="_blank" rel="noopener">${esc(d.reviews.buttonText)}</a>
          <button class="gb-btn gb-small" id="gbEditReviews" type="button">Edit Reviews Button</button>
        </div>

        <div class="gb-dash-card">
          <div class="gb-dash-card-head">THUMBNAILS</div>
          <div class="gb-mini-grid">${galleryCardsHtml}</div>
          <a class="gb-btn gb-primary gb-mini-preview-btn" href="${esc(d.thumbnails.orderButtonLink)}" target="_blank" rel="noopener">${esc(d.thumbnails.orderButtonText)}</a>
          <button class="gb-btn gb-small" id="gbEditThumbnails" type="button">Manage Gallery &amp; Order Button</button>
        </div>
      </div>

      <div class="gb-dash-utility">
        <button class="gb-btn gb-small" id="gbEditText" type="button">Edit Site Text</button>
        <button class="gb-btn gb-small" id="gbEditAdvanced" type="button">Advanced (all data)</button>
        <button class="gb-btn gb-small gb-primary" id="gbExport" type="button">Export content.js</button>
        <button class="gb-btn gb-small" id="gbLock" type="button">Exit Edit Mode</button>
      </div>
    `, true);

    modal.querySelector("#gbEditText").addEventListener("click", openTextEditor);
    modal.querySelector("#gbEditHighlights").addEventListener("click", () =>
      openListManager({
        title: "Skins & Slides",
        sub: "These are the 4 slides in the homepage skin carousel — each can show a different skin and accent color.",
        getList: (dd) => (dd.home && dd.home.highlights) || [],
        setList: (dd, list) => { dd.home.highlights = list; },
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Description (not shown on-site, for your reference)", type: "textarea" },
          { key: "link", label: "Link (e.g. staffing.html)", type: "text" },
          { key: "skin", label: "Skin file path (e.g. assets/skins/skin-staffing.png)", type: "text" },
          { key: "color1", label: "Accent Color 1 (hex, e.g. #6dffb0)", type: "text" },
          { key: "color2", label: "Accent Color 2 (hex, e.g. #7ad9ff)", type: "text" },
        ],
        emptyItem: { title: "New Item", text: "", link: "", skin: "assets/skin.png", color1: "#6dffb0", color2: "#7ad9ff" },
        itemLabel: (i) => i.title,
        itemSub: (i) => i.skin,
      })
    );
    modal.querySelector("#gbEditServers").addEventListener("click", () =>
      openListManager({
        title: "Servers",
        sub: "Shown on the Staffing page.",
        getList: (dd) => dd.servers || [],
        setList: (dd, list) => { dd.servers = list; },
        fields: [
          { key: "name", label: "Server Name", type: "text" },
          { key: "address", label: "Server Address", type: "text" },
          { key: "icon", label: "Icon path (e.g. assets/icons/myicon.png)", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "link", label: "Server Website Link", type: "text" },
        ],
        emptyItem: { name: "New Server", address: "", icon: "assets/icons/server-example.png", description: "", link: "" },
        itemLabel: (i) => i.name,
        itemSub: (i) => i.address,
      })
    );
    modal.querySelector("#gbEditReviews").addEventListener("click", openReviewsEditor);
    modal.querySelector("#gbEditThumbnails").addEventListener("click", openThumbnailsEditor);
    modal.querySelector("#gbEditAdvanced").addEventListener("click", openAdvancedEditor);
    modal.querySelector("#gbExport").addEventListener("click", exportContentJs);
    modal.querySelector("#gbLock").addEventListener("click", () => {
      sessionStorage.removeItem(STORAGE_OPEN_KEY);
      closeModal();
    });
  }

  /* ---------------------------- SITE TEXT EDITOR ---------------------------- */
  function openTextEditor() {
    const d = getData();
    const modal = openModal(`
      <h2>Edit Site Text</h2>
      <p class="gb-sub">Changes save to this browser. Use "Export content.js" afterwards to publish them for everyone.</p>

      <div class="gb-field"><label>Site Name</label><input type="text" id="f_siteName" value="${esc(d.general.siteName)}"></div>
      <div class="gb-field"><label>Tagline</label><input type="text" id="f_tagline" value="${esc(d.general.tagline)}"></div>
      <div class="gb-field"><label>Footer Text</label><input type="text" id="f_footerText" value="${esc(d.general.footerText)}"></div>

      <div class="gb-field"><label>Homepage Hero Title</label><input type="text" id="f_heroTitle" value="${esc(d.home.heroTitle)}"></div>
      <div class="gb-field"><label>Homepage Hero Subtitle</label><input type="text" id="f_heroSubtitle" value="${esc(d.home.heroSubtitle)}"></div>
      <div class="gb-field-row">
        <div class="gb-field"><label>Hero Button Text</label><input type="text" id="f_heroButtonText" value="${esc(d.home.heroButtonText)}"></div>
        <div class="gb-field"><label>Hero Button Link</label><input type="text" id="f_heroButtonLink" value="${esc(d.home.heroButtonLink)}"></div>
      </div>
      <div class="gb-field"><label>About Title</label><input type="text" id="f_aboutTitle" value="${esc(d.home.aboutTitle)}"></div>
      <div class="gb-field"><label>About Text</label><textarea id="f_aboutText">${esc(d.home.aboutText)}</textarea></div>

      <div class="gb-field"><label>Staffing Page Title</label><input type="text" id="f_staffTitle" value="${esc(d.staffing.pageTitle)}"></div>
      <div class="gb-field"><label>Staffing Page Intro</label><textarea id="f_staffIntro">${esc(d.staffing.pageIntro)}</textarea></div>
      <div class="gb-field-row">
        <div class="gb-field"><label>Staffing Accent Color 1</label><input type="text" id="f_staffColor1" value="${esc(d.staffing.color1)}"></div>
        <div class="gb-field"><label>Staffing Accent Color 2</label><input type="text" id="f_staffColor2" value="${esc(d.staffing.color2)}"></div>
      </div>

      <div class="gb-field"><label>SSing Page Title</label><input type="text" id="f_ssingTitle" value="${esc(d.ssing.pageTitle)}"></div>
      <div class="gb-field"><label>SSing Page Intro</label><textarea id="f_ssingIntro">${esc(d.ssing.pageIntro)}</textarea></div>
      <div class="gb-field-row">
        <div class="gb-field"><label>SSing Accent Color 1</label><input type="text" id="f_ssingColor1" value="${esc(d.ssing.color1)}"></div>
        <div class="gb-field"><label>SSing Accent Color 2</label><input type="text" id="f_ssingColor2" value="${esc(d.ssing.color2)}"></div>
      </div>

      <div class="gb-field"><label>Thumbnails Page Title</label><input type="text" id="f_thumbTitle" value="${esc(d.thumbnails.pageTitle)}"></div>
      <div class="gb-field"><label>Thumbnails Page Intro</label><textarea id="f_thumbIntro">${esc(d.thumbnails.pageIntro)}</textarea></div>
      <div class="gb-field-row">
        <div class="gb-field"><label>Thumbnails Accent Color 1</label><input type="text" id="f_thumbColor1" value="${esc(d.thumbnails.color1)}"></div>
        <div class="gb-field"><label>Thumbnails Accent Color 2</label><input type="text" id="f_thumbColor2" value="${esc(d.thumbnails.color2)}"></div>
      </div>

      <div class="gb-field"><label>Reviews Page Title</label><input type="text" id="f_revTitle" value="${esc(d.reviews.pageTitle)}"></div>
      <div class="gb-field"><label>Reviews Page Intro</label><textarea id="f_revIntro">${esc(d.reviews.pageIntro)}</textarea></div>
      <div class="gb-field-row">
        <div class="gb-field"><label>Reviews Accent Color 1</label><input type="text" id="f_revColor1" value="${esc(d.reviews.color1)}"></div>
        <div class="gb-field"><label>Reviews Accent Color 2</label><input type="text" id="f_revColor2" value="${esc(d.reviews.color2)}"></div>
      </div>

      <div class="gb-actions">
        <button class="gb-btn" id="gbCancelText" type="button">Cancel</button>
        <button class="gb-btn gb-primary" id="gbSaveText" type="button">Save Changes</button>
      </div>
    `, true);

    modal.querySelector("#gbCancelText").addEventListener("click", closeModal);
    modal.querySelector("#gbSaveText").addEventListener("click", () => {
      const g = (id) => modal.querySelector(id).value;
      d.general.siteName = g("#f_siteName");
      d.general.tagline = g("#f_tagline");
      d.general.footerText = g("#f_footerText");
      d.home.heroTitle = g("#f_heroTitle");
      d.home.heroSubtitle = g("#f_heroSubtitle");
      d.home.heroButtonText = g("#f_heroButtonText");
      d.home.heroButtonLink = g("#f_heroButtonLink");
      d.home.aboutTitle = g("#f_aboutTitle");
      d.home.aboutText = g("#f_aboutText");
      d.staffing.pageTitle = g("#f_staffTitle");
      d.staffing.pageIntro = g("#f_staffIntro");
      d.staffing.color1 = g("#f_staffColor1");
      d.staffing.color2 = g("#f_staffColor2");
      d.ssing.pageTitle = g("#f_ssingTitle");
      d.ssing.pageIntro = g("#f_ssingIntro");
      d.ssing.color1 = g("#f_ssingColor1");
      d.ssing.color2 = g("#f_ssingColor2");
      d.thumbnails.pageTitle = g("#f_thumbTitle");
      d.thumbnails.pageIntro = g("#f_thumbIntro");
      d.thumbnails.color1 = g("#f_thumbColor1");
      d.thumbnails.color2 = g("#f_thumbColor2");
      d.reviews.pageTitle = g("#f_revTitle");
      d.reviews.pageIntro = g("#f_revIntro");
      d.reviews.color1 = g("#f_revColor1");
      d.reviews.color2 = g("#f_revColor2");
      persist(d);
    });
  }

  /* ---------------------------- REVIEWS BUTTON EDITOR ---------------------------- */
  function openReviewsEditor() {
    const d = getData();
    const modal = openModal(`
      <h2>Reviews Button</h2>
      <p class="gb-sub">The Reviews page is just a button pointing at your Discord.</p>
      <div class="gb-field"><label>Button Text</label><input type="text" id="f_revBtnText" value="${esc(d.reviews.buttonText)}"></div>
      <div class="gb-field"><label>Button Link (your Discord invite)</label><input type="text" id="f_revBtnLink" value="${esc(d.reviews.buttonLink)}"></div>
      <div class="gb-actions">
        <button class="gb-btn" id="gbCancelRev" type="button">Cancel</button>
        <button class="gb-btn gb-primary" id="gbSaveRev" type="button">Save Changes</button>
      </div>
    `);
    modal.querySelector("#gbCancelRev").addEventListener("click", closeModal);
    modal.querySelector("#gbSaveRev").addEventListener("click", () => {
      d.reviews.buttonText = modal.querySelector("#f_revBtnText").value;
      d.reviews.buttonLink = modal.querySelector("#f_revBtnLink").value;
      persist(d);
    });
  }

  /* ---------------------------- THUMBNAILS: GALLERY (with upload) + ORDER BUTTON ---------------------------- */
  function openThumbnailsEditor() {
    const d = getData();
    let list = (d.thumbnails.gallery || []).slice();

    function renderList(modal) {
      const container = modal.querySelector("#gbGalleryItems");
      container.innerHTML =
        list
          .map(
            (item, i) => `
        <div class="gb-list-item">
          <div class="gb-list-item-text" style="display:flex;align-items:center;gap:10px;">
            <img src="${esc(item.image)}" alt="" style="width:36px;height:36px;object-fit:cover;border-radius:6px;flex-shrink:0;" onerror="this.style.opacity=0">
            <span>${esc(item.caption) || "(no caption)"}</span>
          </div>
          <div class="gb-list-item-actions">
            <button class="gb-icon-btn" data-edit="${i}" type="button" title="Edit">✎</button>
            <button class="gb-icon-btn gb-danger" data-del="${i}" type="button" title="Delete">✕</button>
          </div>
        </div>`
          )
          .join("") || `<p class="gb-hint">No images yet — click "Add New Image" below.</p>`;

      container.querySelectorAll("[data-edit]").forEach((btn) => {
        btn.addEventListener("click", () => openItemForm(modal, parseInt(btn.dataset.edit, 10)));
      });
      container.querySelectorAll("[data-del]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const i = parseInt(btn.dataset.del, 10);
          if (confirm("Delete this image?")) {
            list.splice(i, 1);
            renderList(modal);
          }
        });
      });
    }

    function openItemForm(modal, index) {
      const isNew = index === undefined;
      const item = isNew ? { image: "", caption: "" } : Object.assign({}, list[index]);

      const formWrap = modal.querySelector("#gbGalleryFormWrap");
      formWrap.innerHTML = `
        <div class="gb-modal" style="padding:0;border:none;box-shadow:none;background:transparent;max-height:none;">
          <h2 style="font-size:1.05rem;">${isNew ? "Add New Image" : "Edit Image"}</h2>
          <div class="gb-field">
            <label>Upload a picture (any size)</label>
            <input type="file" id="galleryUploadInput" accept="image/*">
          </div>
          <div class="gb-field">
            <label>Or paste an image path/URL</label>
            <input type="text" id="galleryImagePath" value="${esc(item.image)}" placeholder="assets/icons/example.png">
          </div>
          <div class="gb-field" id="galleryPreviewWrap" style="${item.image ? "" : "display:none;"}">
            <label>Preview</label>
            <img id="galleryPreviewImg" src="${esc(item.image)}" style="max-width:100%;border-radius:10px;border:1px solid var(--panel-border);">
          </div>
          <div class="gb-field"><label>Caption (optional)</label><input type="text" id="galleryCaption" value="${esc(item.caption)}"></div>
          <div class="gb-actions">
            <button class="gb-btn" id="gbGalleryItemCancel" type="button">Cancel</button>
            <button class="gb-btn gb-primary" id="gbGalleryItemSave" type="button">${isNew ? "Add" : "Save"}</button>
          </div>
        </div>`;
      formWrap.style.display = "block";
      modal.querySelector("#gbGalleryItems").style.display = "none";
      modal.querySelector("#gbGalleryAddNewBtn").style.display = "none";

      const pathInput = formWrap.querySelector("#galleryImagePath");
      const previewWrap = formWrap.querySelector("#galleryPreviewWrap");
      const previewImg = formWrap.querySelector("#galleryPreviewImg");

      function updatePreview(src) {
        if (!src) {
          previewWrap.style.display = "none";
          return;
        }
        previewImg.src = src;
        previewWrap.style.display = "";
      }

      formWrap.querySelector("#galleryUploadInput").addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          pathInput.value = reader.result; // data URL — works with no backend needed
          updatePreview(reader.result);
        };
        reader.readAsDataURL(file);
      });
      pathInput.addEventListener("input", () => updatePreview(pathInput.value));

      formWrap.querySelector("#gbGalleryItemCancel").addEventListener("click", () => {
        formWrap.style.display = "none";
        formWrap.innerHTML = "";
        modal.querySelector("#gbGalleryItems").style.display = "";
        modal.querySelector("#gbGalleryAddNewBtn").style.display = "";
      });
      formWrap.querySelector("#gbGalleryItemSave").addEventListener("click", () => {
        const updated = {
          image: pathInput.value,
          caption: formWrap.querySelector("#galleryCaption").value,
        };
        if (isNew) {
          list.push(updated);
        } else {
          list[index] = updated;
        }
        formWrap.style.display = "none";
        formWrap.innerHTML = "";
        modal.querySelector("#gbGalleryItems").style.display = "";
        modal.querySelector("#gbGalleryAddNewBtn").style.display = "";
        renderList(modal);
      });
    }

    const modal = openModal(`
      <h2>Gallery &amp; Order Button</h2>
      <p class="gb-sub">Upload pictures of any size — they'll display at their natural shape, no cropping.</p>

      <div class="gb-field-row">
        <div class="gb-field"><label>Order Button Text</label><input type="text" id="f_orderText" value="${esc(d.thumbnails.orderButtonText)}"></div>
        <div class="gb-field"><label>Order Button Link (Discord invite)</label><input type="text" id="f_orderLink" value="${esc(d.thumbnails.orderButtonLink)}"></div>
      </div>

      <div class="gb-list" id="gbGalleryItems"></div>
      <div id="gbGalleryFormWrap"></div>
      <button class="gb-btn gb-small" id="gbGalleryAddNewBtn" type="button">+ Add New Image</button>

      <div class="gb-actions">
        <button class="gb-btn" id="gbGalleryCancel" type="button">Cancel</button>
        <button class="gb-btn gb-primary" id="gbGallerySave" type="button">Save All Changes</button>
      </div>
    `, true);

    renderList(modal);
    modal.querySelector("#gbGalleryAddNewBtn").addEventListener("click", () => openItemForm(modal, undefined));
    modal.querySelector("#gbGalleryCancel").addEventListener("click", closeModal);
    modal.querySelector("#gbGallerySave").addEventListener("click", () => {
      d.thumbnails.gallery = list;
      d.thumbnails.orderButtonText = modal.querySelector("#f_orderText").value;
      d.thumbnails.orderButtonLink = modal.querySelector("#f_orderLink").value;
      persist(d);
    });
  }

  /* ---------------------------- GENERIC LIST MANAGER (skins / servers) ---------------------------- */
  function openListManager(cfg) {
    const d = getData();
    let list = cfg.getList(d).slice();

    function renderList(modal) {
      const container = modal.querySelector("#gbListItems");
      container.innerHTML =
        list
          .map(
            (item, i) => `
        <div class="gb-list-item">
          <div class="gb-list-item-text">
            <strong>${esc(cfg.itemLabel(item))}</strong>
            <span>${esc(cfg.itemSub(item))}</span>
          </div>
          <div class="gb-list-item-actions">
            <button class="gb-icon-btn" data-edit="${i}" type="button" title="Edit">✎</button>
            <button class="gb-icon-btn gb-danger" data-del="${i}" type="button" title="Delete">✕</button>
          </div>
        </div>`
          )
          .join("") || `<p class="gb-hint">Nothing here yet — click "Add New" below.</p>`;

      container.querySelectorAll("[data-edit]").forEach((btn) => {
        btn.addEventListener("click", () => openItemForm(modal, parseInt(btn.dataset.edit, 10)));
      });
      container.querySelectorAll("[data-del]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const i = parseInt(btn.dataset.del, 10);
          if (confirm("Delete this item?")) {
            list.splice(i, 1);
            renderList(modal);
          }
        });
      });
    }

    function openItemForm(modal, index) {
      const isNew = index === undefined;
      const item = isNew ? Object.assign({}, cfg.emptyItem) : list[index];

      const fieldsHtml = cfg.fields
        .map((f) => {
          if (f.type === "textarea") {
            return `<div class="gb-field"><label>${esc(f.label)}</label><textarea id="itemField_${f.key}">${esc(item[f.key])}</textarea></div>`;
          }
          if (f.type === "number") {
            return `<div class="gb-field"><label>${esc(f.label)}</label><input type="number" min="1" max="5" id="itemField_${f.key}" value="${esc(item[f.key])}"></div>`;
          }
          return `<div class="gb-field"><label>${esc(f.label)}</label><input type="text" id="itemField_${f.key}" value="${esc(item[f.key])}"></div>`;
        })
        .join("");

      const formWrap = modal.querySelector("#gbItemFormWrap");
      formWrap.innerHTML = `
        <div class="gb-modal" style="padding:0;border:none;box-shadow:none;background:transparent;max-height:none;">
          <h2 style="font-size:1.05rem;">${isNew ? "Add New" : "Edit"} — ${esc(cfg.title)}</h2>
          ${fieldsHtml}
          <div class="gb-actions">
            <button class="gb-btn" id="gbItemCancel" type="button">Cancel</button>
            <button class="gb-btn gb-primary" id="gbItemSave" type="button">${isNew ? "Add" : "Save"}</button>
          </div>
        </div>`;
      formWrap.style.display = "block";
      modal.querySelector("#gbListItems").style.display = "none";
      modal.querySelector("#gbAddNewBtn").style.display = "none";

      formWrap.querySelector("#gbItemCancel").addEventListener("click", () => {
        formWrap.style.display = "none";
        formWrap.innerHTML = "";
        modal.querySelector("#gbListItems").style.display = "";
        modal.querySelector("#gbAddNewBtn").style.display = "";
      });
      formWrap.querySelector("#gbItemSave").addEventListener("click", () => {
        const updated = {};
        cfg.fields.forEach((f) => {
          const val = formWrap.querySelector("#itemField_" + f.key).value;
          updated[f.key] = f.type === "number" ? parseInt(val, 10) || 0 : val;
        });
        if (isNew) {
          list.push(updated);
        } else {
          list[index] = updated;
        }
        formWrap.style.display = "none";
        formWrap.innerHTML = "";
        modal.querySelector("#gbListItems").style.display = "";
        modal.querySelector("#gbAddNewBtn").style.display = "";
        renderList(modal);
      });
    }

    const modal = openModal(`
      <h2>${esc(cfg.title)}</h2>
      <p class="gb-sub">${esc(cfg.sub || "")}</p>
      <div class="gb-list" id="gbListItems"></div>
      <div id="gbItemFormWrap"></div>
      <button class="gb-btn gb-small" id="gbAddNewBtn" type="button">+ Add New</button>
      <div class="gb-actions">
        <button class="gb-btn" id="gbListCancel" type="button">Cancel</button>
        <button class="gb-btn gb-primary" id="gbListSave" type="button">Save All Changes</button>
      </div>
    `, true);

    renderList(modal);
    modal.querySelector("#gbAddNewBtn").addEventListener("click", () => openItemForm(modal, undefined));
    modal.querySelector("#gbListCancel").addEventListener("click", closeModal);
    modal.querySelector("#gbListSave").addEventListener("click", () => {
      cfg.setList(d, list);
      persist(d);
    });
  }

  /* ---------------------------- ADVANCED (RAW JSON) EDITOR ---------------------------- */
  function openAdvancedEditor() {
    const d = getData();
    const modal = openModal(`
      <h2>Advanced Editor</h2>
      <p class="gb-sub">
        This shows ALL site data as raw text (social links, servers, SSing items, staffing
        timeline — everything). Edit carefully and keep the same structure. Only for people
        comfortable editing code-like text.
      </p>
      <div class="gb-field">
        <textarea id="gbRawJson" style="min-height:340px; font-family:Consolas,monospace; font-size:.8rem;">${esc(JSON.stringify(d, null, 2))}</textarea>
      </div>
      <div class="gb-error" id="gbRawError"></div>
      <div class="gb-actions">
        <button class="gb-btn gb-danger" id="gbResetAll" type="button">Reset Site to Default</button>
        <button class="gb-btn" id="gbRawCancel" type="button">Cancel</button>
        <button class="gb-btn gb-primary" id="gbRawSave" type="button">Save</button>
      </div>
    `, true);

    modal.querySelector("#gbRawCancel").addEventListener("click", closeModal);
    modal.querySelector("#gbRawSave").addEventListener("click", () => {
      const raw = modal.querySelector("#gbRawJson").value;
      try {
        const parsed = JSON.parse(raw);
        persist(parsed);
      } catch (e) {
        modal.querySelector("#gbRawError").textContent = "That's not valid — check for a missing comma, quote, or bracket.";
      }
    });
    modal.querySelector("#gbResetAll").addEventListener("click", () => {
      if (confirm("This removes all local edits saved in this browser and reverts to the site's shipped content.js. Continue?")) {
        localStorage.removeItem(STORAGE_DATA_KEY);
        location.reload();
      }
    });
  }

  /* ---------------------------- EXPORT content.js ---------------------------- */
  function exportContentJs() {
    const d = getData();
    const fileText =
      "/* content.js — exported from the in-site editor.\n" +
      "   Replace js/content.js in your site files with this file, then\n" +
      "   commit/upload it to GitHub to make these changes live for everyone. */\n\n" +
      "window.SITE_CONTENT = " +
      JSON.stringify(d, null, 2) +
      ";\n";

    const blob = new Blob([fileText], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  /* ---------------------------- INIT ---------------------------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest("#editorDotBtn")) {
      e.preventDefault();
      if (isOpen()) {
        openDashboard();
      } else {
        openUnlockGate();
      }
    }
  });
})();
