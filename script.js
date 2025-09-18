// ====== Config ======
const API_KEY = "C1ncpApj3NhTlHSX7KLeYdd06nt3L2nG0bAcIOPlB5FkZtWugpjvytDT";
const ENDPOINT = (q, per = 12) =>
  `https://api.pexels.com/v1/search?query=${q}&per_page=${per}`;

const word = "dogs"

// ====== DOM refs ======
const row       = document.getElementById("galleryRow");
const btnMain   = document.getElementById("btnPrimary");
const btnAlt    = document.getElementById("btnSecondary");
const topLoader = document.getElementById("topLoader");

// modal refs
const modal      = new bootstrap.Modal(document.getElementById("photoModal"));
const modalImg   = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalCap   = document.getElementById("modalCaption");

// Create one card
function cardMarkup(p) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="card shadow-sm h-100">
        <img src="${p.src.medium}" class="card-img-top object-cover" alt="${p.alt || "photo"}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title mb-2">${p.photographer || "Photographer"}</h6>
          <p class="card-text small text-muted mb-3">ID: ${p.id}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <button class="btn btn-sm btn-outline-secondary" data-view='${p.src.large}' data-alt='${p.alt || ""}' data-ph='${p.photographer || ""}'>View</button>
              <button class="btn btn-sm btn-outline-danger" data-hide>Hide</button>
            </div>
            <small class="text-muted">${p.width}×${p.height}</small>
          </div>
        </div>
      </div>
    </div>`;
}

// Render many photos
function render(photos) {
  row.innerHTML = photos.map(cardMarkup).join("");
}

// Load & render (shows tiny spinner in navbar)
function loadImages(query) {
  topLoader.classList.add("show");

  fetch(ENDPOINT(query), {
    headers: { Authorization: API_KEY }
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(json => render(json.photos || []))
    .catch(err => {
      row.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">Errore nel caricamento: ${err.message}</div>
        </div>`;
    })
    .finally(() => topLoader.classList.remove("show"));
}



// Event delegation for card buttons
row.addEventListener("click", e => {
  const t = e.target;
  const card = t.closest(".card");

  if (t.matches("[data-hide]")) {
    card.closest(".col-12, .col-sm-6, .col-md-4, .col-lg-3").remove();
  }

  if (t.matches("[data-view]")) {
    const url = t.getAttribute("data-view");
    modalImg.src = url;
    modalTitle.textContent = t.getAttribute("data-ph") || "Photo";
    modalCap.textContent = t.getAttribute("data-alt") || "";
    modal.show();
  }
});


// Button actions
btnMain.addEventListener("click",     () => loadImages(word));
btnAlt.addEventListener("click",      () => loadImages("hamsters"));


// Load something on first view

loadImages(word);