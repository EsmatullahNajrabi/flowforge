document.addEventListener("DOMContentLoaded", () => {
  // 1. Cursor Logic
  const cursor = document.getElementById("cursor"), blur = document.getElementById("cursor-blur");
  document.addEventListener("mousemove", e => {
    cursor.style.left = e.clientX + "px"; cursor.style.top = e.clientY + "px";
    setTimeout(() => { blur.style.left = e.clientX + "px"; blur.style.top = e.clientY + "px"; }, 50);
  });
  document.querySelectorAll("button, a, .kanban-card, input, select").forEach(el => {
    el.addEventListener("mouseenter", () => { cursor.style.transform = "scale(2)"; cursor.style.border = "1px solid var(--primary)"; cursor.style.background = "transparent"; });
    el.addEventListener("mouseleave", () => { cursor.style.transform = "scale(1)"; cursor.style.border = "none"; cursor.style.background = "white"; });
  });

  // 2. Initialize Vanilla Tilt for 3D depth
  VanillaTilt.init(document.querySelectorAll(".glass-panel"), { speed: 400 });

  // 3. Initial GSAP Animation
  gsap.from(".gsap-anim", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" });

  // 4. Revenue Chart (Chart.js)
  const ctx = document.getElementById('revenueChart').getContext('2d');
  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(0, 229, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [{
        label: 'Sponsorship Revenue',
        data: [3000, 4500, 4200, 7000, 8500, 11000],
        borderColor: '#00E5FF', backgroundColor: gradient,
        borderWidth: 3, fill: true, tension: 0.4, pointBackgroundColor: '#fff'
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { color: 'rgba(255,255,255,0.05)' } } } }
  });

  // 5. Populate Templates
  const tGrid = document.getElementById("templateGrid");
  BRANDDECK_DATA.templates.forEach((t, i) => {
    tGrid.innerHTML += `
      <div class="col-md-6">
        <div class="glass-panel p-4 rounded-4 h-100" data-tilt data-tilt-max="2">
          <h5 class="text-white fw-bold pop-out">${t.title}</h5>
          <textarea class="form-control glass-input my-3 pop-out text-secondary" rows="5" id="copy${i}" readonly>${t.content}</textarea>
          <button class="btn btn-outline-light rounded-pill pop-out w-100" onclick="copyText('copy${i}')"><i class="fa-solid fa-clipboard me-2"></i>Copy to Clipboard</button>
        </div>
      </div>
    `;
  });

  // 6. Populate Kanban
  BRANDDECK_DATA.deals.forEach(deal => {
    const card = document.createElement('div');
    card.className = "kanban-card mb-3";
    card.draggable = true; card.id = deal.id;
    card.addEventListener('dragstart', drag);
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="text-white mb-0 fw-bold"><i class="fa-solid ${deal.logo} me-2 text-primary"></i>${deal.brand}</h6>
      </div>
      <h4 class="text-primary fw-bold mb-2">${deal.value}</h4>
      <span class="badge bg-secondary bg-opacity-25 text-light rounded-pill">${deal.deliverables[0]}</span>
    `;
    document.getElementById(deal.stage).appendChild(card);
  });

  // 7. Calculator Engine & Animation
  document.getElementById("calcForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const subs = parseInt(document.getElementById("inpSubs").value);
    const views = parseInt(document.getElementById("inpViews").value);
    const eng = parseFloat(document.getElementById("inpEng").value);
    const niche = document.getElementById("inpNiche").value;
    
    // Complex looking logic for "AI" vibe
    const baseCPV = 0.05; // $50 CPM
    const multiplier = BRANDDECK_DATA.nicheMultipliers[niche] * (1 + (eng/100));
    
    const rates = [
      { type: "Dedicated Video", price: Math.round(views * baseCPV * multiplier * 2.5), desc: "10-15 Min Deep Dive" },
      { type: "60s Integration", price: Math.round(views * baseCPV * multiplier), desc: "Mid-roll ad read" },
      { type: "Shorts Package", price: Math.round(views * baseCPV * multiplier * 0.8), desc: "2x Vertical Videos" }
    ];

    const grid = document.getElementById("resultGrid");
    grid.innerHTML = ""; grid.classList.remove("d-none");

    rates.forEach((r, i) => {
      grid.innerHTML += `
        <div class="col-md-4">
          <div class="glass-panel p-4 rounded-4 text-center rate-card opacity-0" data-tilt data-tilt-max="10">
            <h5 class="text-secondary pop-out">${r.type}</h5>
            <h2 class="display-5 fw-bold text-white my-3 pop-out">$<span class="counter" data-target="${r.price}">0</span></h2>
            <p class="small text-secondary mb-0 pop-out">${r.desc}</p>
          </div>
        </div>
      `;
    });

    VanillaTilt.init(document.querySelectorAll(".rate-card"));
    
    // 3D pop-in animation
    gsap.to(".rate-card", { opacity: 1, y: -20, rotationX: 10, duration: 0.5, stagger: 0.15, ease: "back.out(2)" });

    // Number counting animation
    setTimeout(() => {
      document.querySelectorAll('.counter').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        gsap.to(counter, { innerHTML: target, duration: 1.5, snap: { innerHTML: 1 }, ease: "power2.out" });
      });
    }, 300);
  });
});

// Kanban Drag & Drop API functions (Global)
function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }
function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const targetCol = ev.target.closest('.glass-column');
  if (targetCol) {
    targetCol.appendChild(document.getElementById(data));
    // Add a flash effect on drop
    gsap.from(document.getElementById(data), { scale: 1.1, boxShadow: "0 0 20px #00E5FF", duration: 0.3 });
  }
}

// Copy clipboard global
window.copyText = (id) => {
  const el = document.getElementById(id);
  el.select(); document.execCommand("copy");
  alert("Copied to clipboard!");
};