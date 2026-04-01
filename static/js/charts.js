/**
 * MedByte — Chart helpers & UI utilities
 */

// ── Clock ──
function updateClock() {
  const el = document.getElementById('clock');
  if (el) {
    const n = new Date();
    el.textContent = n.toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  }
}
setInterval(updateClock, 1000);
updateClock();

// ── Sidebar Toggle ──
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}
document.addEventListener('click', e => {
  const s = document.getElementById('sidebar');
  const t = document.getElementById('menu-tog');
  if (s && s.classList.contains('open') && !s.contains(e.target) && t && !t.contains(e.target))
    s.classList.remove('open');
});

// ── Modal ──
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('show'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('show'); document.body.style.overflow = ''; }
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-bg')) {
    e.target.classList.remove('show');
    document.body.style.overflow = '';
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-bg.show').forEach(m => {
      m.classList.remove('show'); document.body.style.overflow = '';
    });
});

// ── Chart Color Palette ──
const CC = {
  blue:   { m: '#3b82f6', g: ['rgba(59,130,246,0.35)',  'rgba(59,130,246,0)'] },
  cyan:   { m: '#06b6d4', g: ['rgba(6,182,212,0.35)',   'rgba(6,182,212,0)'] },
  green:  { m: '#10b981', g: ['rgba(16,185,129,0.35)',  'rgba(16,185,129,0)'] },
  orange: { m: '#f97316', g: ['rgba(249,115,22,0.35)',  'rgba(249,115,22,0)'] },
  purple: { m: '#8b5cf6', g: ['rgba(139,92,246,0.35)',  'rgba(139,92,246,0)'] },
  red:    { m: '#ef4444', g: ['rgba(239,68,68,0.35)',   'rgba(239,68,68,0)'] },
};

const BASE_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 600, easing: 'easeInOutQuart' },
  plugins: {
    legend: {
      labels: { color: '#64748b', font: { family: 'Inter', size: 11 }, padding: 14, usePointStyle: true, pointStyleWidth: 7 }
    },
    tooltip: {
      backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#cbd5e1',
      borderColor: '#334155', borderWidth: 1, padding: 10, cornerRadius: 8
    }
  },
  scales: {
    x: { ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } }
  }
};

function mkGrad(ctx, key, h = 260) {
  const c = CC[key] || CC.blue;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, c.g[0]);
  g.addColorStop(1, c.g[1]);
  return g;
}

// ── Single-line chart ──
function initLine(id, labels, data, colKey = 'blue', label = 'Patients') {
  const cv = document.getElementById(id);
  if (!cv) return;
  const ctx = cv.getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: CC[colKey].m,
        backgroundColor: mkGrad(ctx, colKey),
        fill: true, tension: 0.4, borderWidth: 2.5,
        pointRadius: 3, pointHoverRadius: 6,
        pointBackgroundColor: CC[colKey].m,
        pointBorderColor: '#0a0e1a', pointBorderWidth: 2
      }]
    },
    options: { ...BASE_OPTS, plugins: { ...BASE_OPTS.plugins, legend: { display: false } } }
  });
}

// ── Multi-line comparison chart ──
function initCompare(id, labels, datasets) {
  const cv = document.getElementById(id);
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const colKeys = ['blue', 'cyan', 'green', 'orange'];
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        borderColor: CC[colKeys[i % 4]].m,
        backgroundColor: i === 0 ? mkGrad(ctx, colKeys[i]) : 'transparent',
        fill: i === 0,
        tension: 0.4,
        borderWidth: 2.5,
        borderDash: i === 1 ? [6, 4] : undefined,
        pointRadius: 3, pointHoverRadius: 6,
        pointBackgroundColor: CC[colKeys[i % 4]].m,
        pointBorderColor: '#0a0e1a', pointBorderWidth: 2
      }))
    },
    options: BASE_OPTS
  });
}

// ── Doughnut ──
function initDonut(id, labels, data) {
  const cv = document.getElementById(id);
  if (!cv) return;
  return new Chart(cv.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
        borderColor: '#111827', borderWidth: 3, hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '70%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 10 }, padding: 10, usePointStyle: true } },
        tooltip: BASE_OPTS.plugins.tooltip
      }
    }
  });
}

// ── Bar chart ──
function initBar(id, labels, datasets) {
  const cv = document.getElementById(id);
  if (!cv) return;
  const colKeys = ['blue', 'purple', 'green', 'orange'];
  return new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: CC[colKeys[i % 4]].g[0],
        borderColor: CC[colKeys[i % 4]].m,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      }))
    },
    options: { ...BASE_OPTS, plugins: { ...BASE_OPTS.plugins } }
  });
}

// ── AI Prediction form ──
function runPrediction() {
  const h = document.getElementById('ph')?.value;
  const b = document.getElementById('pb')?.value;
  const s = document.getElementById('ps')?.value;
  const er = document.getElementById('per')?.value;
  if (!h || !b || !s) return;

  const btn = document.getElementById('pred-btn');
  if (btn) { btn.textContent = '⏳ Predicting...'; btn.disabled = true; }

  fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hour: +h, beds_available: +b, staff_count: +s, er_arrivals: +(er || 5) })
  })
    .then(r => r.json())
    .then(d => {
      document.getElementById('pv').textContent = d.patients_next_hour;
      document.getElementById('pb_need').textContent = d.beds_needed_24h;
      document.getElementById('ps_need').textContent = d.staff_needed_24h;
      document.getElementById('pc').textContent = d.confidence_patients + '%';
      document.getElementById('pr').textContent = d.risk_patients;
      document.getElementById('pu').textContent = d.bed_utilization + '%';
      const rEl = document.getElementById('pr');
      const riskColors = { Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#10b981' };
      rEl.style.color = riskColors[d.risk_patients] || '#10b981';
      document.getElementById('pred-res').style.display = 'block';
      if (btn) { btn.textContent = '🤖 Run Prediction'; btn.disabled = false; }
    })
    .catch(e => { console.error(e); if (btn) { btn.textContent = '🤖 Run Prediction'; btn.disabled = false; } });
}

// ── Acknowledge alert ──
function ackAlert(id, btn) {
  fetch('/alerts/acknowledge/' + id, { method: 'POST' })
    .then(r => {
      if (r.ok) {
        btn.closest('.al').classList.add('acked');
        btn.textContent = '✓'; btn.disabled = true;
        btn.className = 'btn btn-sm btn-ok';
        const b = document.querySelector('.sb-badge');
        if (b) { const c = parseInt(b.textContent) - 1; if (c <= 0) b.style.display = 'none'; else b.textContent = c; }
      }
    });
}

// ── Discharge patient ──
function discharge(id) {
  if (!confirm('Discharge this patient?')) return;
  fetch('/patients/discharge/' + id, { method: 'POST' })
    .then(r => { if (r.ok) location.reload(); });
}

// ── Staggered entrance animations ──
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.m-card').forEach((c, i) => {
    c.style.animation = `stIn 0.4s ease ${i * 0.07}s backwards`;
  });
  document.querySelectorAll('.dt tbody tr').forEach((r, i) => {
    r.style.animation = `stIn 0.3s ease ${i * 0.04}s backwards`;
  });
  document.querySelectorAll('.res-card').forEach((c, i) => {
    c.style.animation = `stIn 0.4s ease ${i * 0.06}s backwards`;
  });
});
