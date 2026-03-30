(function () {
  const DEFAULT_URL = "https://img.freepik.com/free-photo/aesthetic-minimal-white-grid-pattern-wallpaper_53876-96916.jpg?semt=ais_incoming&w=740&q=80";

  // Prevent duplicates if rerun
  document.getElementById("overlay-panel")?.remove();
  document.getElementById("overlay-image")?.remove();
  document.getElementById("overlay-style")?.remove();

  // Load font
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap";
  document.head.appendChild(fontLink);

  // Styles
  const style = document.createElement("style");
  style.id = "overlay-style";
  style.textContent = `
    #overlay-panel, #overlay-panel * { box-sizing: border-box; }

    #overlay-panel {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 300px;
      max-width: calc(100vw - 40px);
      padding: 16px;
      border-radius: 18px;
      background: rgba(17,17,17,0.92);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 16px 40px rgba(0,0,0,0.5);
      backdrop-filter: blur(14px);
      color: #f3f4f6;
      font-family: "Open Sans", sans-serif;
      z-index: 2147483647;
    }

    #overlay-panel .overlay-title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 14px;
      color: #fff;
    }

    #overlay-panel .overlay-group + .overlay-group { margin-top: 12px; }

    #overlay-panel .overlay-label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 400;
      user-select: none;
      cursor: pointer;
      color: #e5e7eb;
    }

    #overlay-panel .overlay-checkbox {
      width: 16px;
      height: 16px;
      accent-color: #7c3aed;
      cursor: pointer;
      flex: 0 0 auto;
    }

    #overlay-panel .field-label {
      display: block;
      margin-bottom: 6px;
      font-size: 12px;
      font-weight: 700;
      color: #d1d5db;
    }

    #overlay-panel .overlay-input {
      width: 100%;
      padding: 9px 11px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.04);
      color: #f9fafb;
      font-family: "Open Sans", sans-serif;
      font-size: 12px;
      outline: none;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.35);
      transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
    }

    #overlay-panel .overlay-input:focus {
      border-color: rgba(124, 58, 237, 0.85);
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.22);
      background: rgba(255, 255, 255, 0.06);
    }

    #overlay-panel .overlay-footer {
      margin-top: 14px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.72);
      line-height: 1.4;
    }

    #overlay-panel .overlay-footer a {
      color: #93c5fd;
      text-decoration: none;
      font-weight: 700;
    }

    #overlay-panel .overlay-footer a:hover {
      text-decoration: underline;
    }

    #overlay-panel .overlay-button {
      margin-top: 12px;
      width: 100%;
      padding: 8px 0;
      border-radius: 10px;
      background: #ED3A3A;
      color: #fff;
      font-weight: 700;
      font-family: "Open Sans", sans-serif;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }

    #overlay-panel .overlay-button:hover {
      background: #A82222;
    }
  `;
  document.head.appendChild(style);

  // Image
  const img = document.createElement("img");
  img.id = "overlay-image";
  img.src = DEFAULT_URL;
  img.draggable = false;
  Object.assign(img.style, {
    position: "fixed",
    top: "100px",
    left: "100px",
    width: "300px",
    opacity: "0.5",
    zIndex: "2147483646",
    cursor: "move",
    userSelect: "none",
    pointerEvents: "auto",
    borderRadius: "10px",
    boxShadow: "0 10px 28px rgba(0,0,0,0.35)"
  });
  img.addEventListener("dragstart", e => e.preventDefault());
  document.body.appendChild(img);

  let baseWidth = 300;
  let scaleValue = 1;
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  function applyScale() {
    img.style.width = `${Math.max(20, baseWidth * scaleValue)}px`;
    scaleInput.value = Number(scaleValue).toFixed(2);
  }

  function setPointerMode(clickThrough) {
    if (clickThrough) { img.style.pointerEvents = "none"; img.style.cursor = "default"; }
    else { img.style.pointerEvents = "auto"; img.style.cursor = "move"; }
  }

  img.addEventListener("mousedown", e => {
    if (img.style.pointerEvents === "none") return;
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - img.offsetLeft;
    offsetY = e.clientY - img.offsetTop;
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    img.style.left = `${e.clientX - offsetX}px`;
    img.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => { isDragging = false; });

  img.addEventListener("wheel", e => {
    if (img.style.pointerEvents === "none") return;
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.05 : 0.95;
    scaleValue *= factor;
    applyScale();
  });

  // Panel
  const panel = document.createElement("div");
  panel.id = "overlay-panel";
  panel.innerHTML = `
    <div class="overlay-title">Overlay Controls</div>

    <label class="overlay-label overlay-group">
      <input class="overlay-checkbox" id="toggleVisibility" type="checkbox" checked />
      <span>Show Image</span>
    </label>

    <label class="overlay-label overlay-group">
      <input class="overlay-checkbox" id="toggleClickThrough" type="checkbox" />
      <span>Click-through</span>
    </label>

    <div class="overlay-group">
      <label class="field-label" for="scaleInput">Scale</label>
      <input class="overlay-input" id="scaleInput" type="number" step="0.1" min="0.1" value="1" />
    </div>

    <div class="overlay-group">
      <label class="field-label" for="urlInput">Image URL</label>
      <input class="overlay-input" id="urlInput" type="text" value="${DEFAULT_URL}" spellcheck="false" />
    </div>

    <button class="overlay-button" id="deleteOverlay">Delete Overlay</button>

    <div class="overlay-footer">
      Developed by
      <a href="https://github.com/dawoodhq" target="_blank" rel="noopener noreferrer">@dawoodhq</a>
    </div>
  `;
  document.body.appendChild(panel);

  const toggleVisibility = panel.querySelector("#toggleVisibility");
  const toggleClickThrough = panel.querySelector("#toggleClickThrough");
  const scaleInput = panel.querySelector("#scaleInput");
  const urlInput = panel.querySelector("#urlInput");
  const deleteBtn = panel.querySelector("#deleteOverlay");

  toggleVisibility.addEventListener("change", () => { img.style.display = toggleVisibility.checked ? "block" : "none"; });
  toggleClickThrough.addEventListener("change", () => { setPointerMode(toggleClickThrough.checked); });
  scaleInput.addEventListener("input", () => {
    const val = parseFloat(scaleInput.value);
    if (!Number.isNaN(val) && val > 0) { scaleValue = val; applyScale(); }
  });
  urlInput.addEventListener("change", () => {
    const next = urlInput.value.trim();
    if (next) img.src = next;
  });

  deleteBtn.addEventListener("click", () => {
    img.remove();
    panel.remove();
    style.remove();
  });

  setPointerMode(false);
  applyScale();
})();
