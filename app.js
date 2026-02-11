// Utility functions
function n(v) {
  const x = Number(v);
  return Number.isFinite(x) ? x : NaN;
}

function fmt(v, digits = 2) {
  if (!Number.isFinite(v)) return "-";
  return v.toFixed(digits);
}

// Navigation functionality
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Calculator switching
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const calcType = link.dataset.calc;

      // Update active link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show selected calculator
      document.querySelectorAll('.calculator-section').forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(`calc-${calcType}`).classList.add('active');

      // Close mobile menu
      navMenu.classList.remove('active');

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ===== ANTHROPOMETRY CALCULATOR =====
function calcAnthropometry() {
  const sex = document.getElementById("sex").value;
  const ageMonths = n(document.getElementById("ageMonths").value);
  const weightKg = n(document.getElementById("weightKg").value);
  const heightCm = n(document.getElementById("heightCm").value);

  const errors = [];
  if (!Number.isFinite(ageMonths) || ageMonths < 0) errors.push("Usia (bulan) tidak valid.");
  if (!Number.isFinite(weightKg) || weightKg <= 0) errors.push("Berat (kg) harus > 0.");
  if (!Number.isFinite(heightCm) || heightCm <= 0) errors.push("Tinggi/Panjang (cm) harus > 0.");

  const el = document.getElementById("result");

  if (errors.length) {
    el.classList.remove("muted");
    el.innerHTML = `<b>Periksa input:</b><ul>${errors.map(e => `<li>${e}</li>`).join("")}</ul>`;
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const wfhRatio = weightKg / heightCm;

  el.classList.remove("muted");
  el.innerHTML = `
    <div class="kv">
      <div><b>Jenis kelamin:</b> ${sex === "L" ? "Laki-laki" : "Perempuan"}</div>
      <div><b>Usia:</b> ${fmt(ageMonths, 0)} bulan</div>
      <div><b>Berat:</b> ${fmt(weightKg, 2)} kg</div>
      <div><b>Tinggi/Panjang:</b> ${fmt(heightCm, 1)} cm</div>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.12);margin:10px 0;">
      <div><b>BMI (IMT):</b> ${fmt(bmi, 2)} kg/m²</div>
      <div><b>Rasio BB/TB (kg/cm):</b> ${fmt(wfhRatio, 4)}</div>
      <p class="muted" style="margin:10px 0 0;">
        Catatan: Untuk klasifikasi status gizi berbasis standar WHO (Z-score), diperlukan tabel referensi WHO.
      </p>
    </div>
  `;
}

function resetAnthropometry() {
  document.getElementById("sex").value = "L";
  document.getElementById("ageMonths").value = "";
  document.getElementById("weightKg").value = "";
  document.getElementById("heightCm").value = "";
  const el = document.getElementById("result");
  el.classList.add("muted");
  el.textContent = "Masukkan data, lalu klik Hitung.";
}

// ===== SCHOFIELD CALCULATOR =====
function calcSchofield() {
  const sex = document.getElementById("schofield-sex").value;
  const age = n(document.getElementById("schofield-age").value);
  const weight = n(document.getElementById("schofield-weight").value);
  const height = n(document.getElementById("schofield-height").value);

  const errors = [];
  if (!Number.isFinite(age) || age < 0) errors.push("Usia tidak valid.");
  if (!Number.isFinite(weight) || weight <= 0) errors.push("Berat harus > 0.");

  const el = document.getElementById("schofield-result");

  if (errors.length) {
    el.classList.remove("muted");
    el.innerHTML = `<b>Periksa input:</b><ul>${errors.map(e => `<li>${e}</li>`).join("")}</ul>`;
    return;
  }

  let beeKcal;
  const useHeight = Number.isFinite(height) && height > 0;

  // Schofield equations (kcal/day)
  // Weight-only: WHO/FAO/UNU (1985), adopted from Schofield WN. Hum Nutr Clin Nutr. 1985;39 Suppl 1:5-41.
  // Weight+height: Schofield (1985), height in metres.
  const heightM = useHeight ? height / 100 : 0;
  if (sex === "M") {
    if (age < 3) {
      beeKcal = useHeight ? (0.167 * weight + 1517.4 * heightM - 617.6) : (60.9 * weight - 54);
    } else if (age < 10) {
      beeKcal = useHeight ? (19.6 * weight + 130.3 * heightM + 414.9) : (22.7 * weight + 495);
    } else if (age < 18) {
      beeKcal = useHeight ? (16.25 * weight + 137.2 * heightM + 515.5) : (17.5 * weight + 651);
    } else if (age < 30) {
      beeKcal = useHeight ? (15.057 * weight + 100.8 * heightM + 503.0) : (15.3 * weight + 679);
    } else if (age < 60) {
      beeKcal = useHeight ? (11.472 * weight + 53.65 * heightM + 871.83) : (11.6 * weight + 879);
    } else {
      beeKcal = useHeight ? (11.711 * weight + 587.7 * heightM - 810.0) : (13.5 * weight + 487);
    }
  } else {
    if (age < 3) {
      beeKcal = useHeight ? (16.252 * weight + 1023.2 * heightM - 413.5) : (61.0 * weight - 51);
    } else if (age < 10) {
      beeKcal = useHeight ? (16.969 * weight + 161.8 * heightM + 371.2) : (22.5 * weight + 499);
    } else if (age < 18) {
      beeKcal = useHeight ? (8.365 * weight + 465.0 * heightM + 200.0) : (12.2 * weight + 746);
    } else if (age < 30) {
      beeKcal = useHeight ? (13.623 * weight + 266.0 * heightM + 625.0) : (14.7 * weight + 496);
    } else if (age < 60) {
      beeKcal = useHeight ? (8.126 * weight + 845.6 * heightM - 4.66) : (8.7 * weight + 829);
    } else {
      beeKcal = useHeight ? (9.082 * weight + 658.5 * heightM - 302.1) : (10.5 * weight + 596);
    }
  }

  const bee = beeKcal * 4.184; // Convert to kJ/day for display

  el.classList.remove("muted");
  el.innerHTML = `
    <div class="kv">
      <div><b>Jenis kelamin:</b> ${sex === "M" ? "Laki-laki" : "Perempuan"}</div>
      <div><b>Usia:</b> ${fmt(age, 0)} tahun</div>
      <div><b>Berat:</b> ${fmt(weight, 1)} kg</div>
      ${useHeight ? `<div><b>Tinggi:</b> ${fmt(height, 1)} cm</div>` : ''}
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.12);margin:10px 0;">
      <div><b>BEE (Basal Energy Expenditure):</b> ${fmt(beeKcal, 0)} kcal/hari</div>
      <div><b>BEE:</b> ${fmt(bee, 0)} kJ/hari</div>
      <p class="muted" style="margin:10px 0 0;">
        Catatan: BEE adalah kebutuhan energi basal. Untuk kebutuhan energi total (TEE), perlu dikalikan dengan faktor aktivitas dan stress.<br>
        Referensi: Schofield WN. <i>Hum Nutr Clin Nutr.</i> 1985;39 Suppl 1:5-41. WHO/FAO/UNU Technical Report 724 (1985).
      </p>
    </div>
  `;
}

function resetSchofield() {
  document.getElementById("schofield-sex").value = "M";
  document.getElementById("schofield-age").value = "";
  document.getElementById("schofield-weight").value = "";
  document.getElementById("schofield-height").value = "";
  const el = document.getElementById("schofield-result");
  el.classList.add("muted");
  el.textContent = "Masukkan data, lalu klik Hitung BEE.";
}

// ===== OSMOLARITY CALCULATOR =====
function calcOsmolarity() {
  const sodium = n(document.getElementById("osm-sodium").value);
  const glucose = n(document.getElementById("osm-glucose").value);
  const bun = n(document.getElementById("osm-bun").value);
  const potassium = n(document.getElementById("osm-potassium").value);

  const errors = [];
  if (!Number.isFinite(sodium) || sodium <= 0) errors.push("Sodium harus > 0.");
  if (!Number.isFinite(glucose) || glucose < 0) errors.push("Glucose harus ≥ 0.");
  if (!Number.isFinite(bun) || bun < 0) errors.push("BUN harus ≥ 0.");

  const el = document.getElementById("osmolarity-result");

  if (errors.length) {
    el.classList.remove("muted");
    el.innerHTML = `<b>Periksa input:</b><ul>${errors.map(e => `<li>${e}</li>`).join("")}</ul>`;
    return;
  }

  // Formula: Osm = 2(Na) + Glucose/18 + BUN/2.8
  // Alternative with K: Osm = 2(Na + K) + Glucose/18 + BUN/2.8
  let osmolarity;
  if (Number.isFinite(potassium) && potassium > 0) {
    osmolarity = 2 * (sodium + potassium) + (glucose / 18) + (bun / 2.8);
  } else {
    osmolarity = 2 * sodium + (glucose / 18) + (bun / 2.8);
  }

  let interpretation = "";
  if (osmolarity < 275) {
    interpretation = "Hypo-osmolar (< 275 mOsm/kg)";
  } else if (osmolarity <= 295) {
    interpretation = "Normal (275-295 mOsm/kg)";
  } else {
    interpretation = "Hyper-osmolar (> 295 mOsm/kg)";
  }

  el.classList.remove("muted");
  el.innerHTML = `
    <div class="kv">
      <div><b>Sodium (Na):</b> ${fmt(sodium, 1)} mEq/L</div>
      <div><b>Glucose:</b> ${fmt(glucose, 1)} mg/dL</div>
      <div><b>BUN:</b> ${fmt(bun, 1)} mg/dL</div>
      ${Number.isFinite(potassium) && potassium > 0 ? `<div><b>Potassium (K):</b> ${fmt(potassium, 1)} mEq/L</div>` : ''}
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.12);margin:10px 0;">
      <div><b>Osmolaritas Serum:</b> ${fmt(osmolarity, 1)} mOsm/kg</div>
      <div><b>Interpretasi:</b> ${interpretation}</div>
      <p class="muted" style="margin:10px 0 0;">
        Catatan: Nilai normal osmolaritas serum: 275-295 mOsm/kg.<br>
        Formula: 2(Na) + Glucose/18 + BUN/2.8.<br>
        Referensi: Purssell RA, et al. <i>J Toxicol Clin Toxicol.</i> 2001;39(7):721-723.
      </p>
    </div>
  `;
}

function resetOsmolarity() {
  document.getElementById("osm-sodium").value = "";
  document.getElementById("osm-glucose").value = "";
  document.getElementById("osm-bun").value = "";
  document.getElementById("osm-potassium").value = "";
  const el = document.getElementById("osmolarity-result");
  el.classList.add("muted");
  el.textContent = "Masukkan data, lalu klik Hitung Osmolaritas.";
}

// ===== MEAN AIRWAY PRESSURE CALCULATOR =====
function calcMAP() {
  const pip = n(document.getElementById("map-pip").value);
  const peep = n(document.getElementById("map-peep").value);
  const inspTime = n(document.getElementById("map-insp-time").value);
  const expTime = n(document.getElementById("map-exp-time").value);

  const errors = [];
  if (!Number.isFinite(pip) || pip < 0) errors.push("PIP harus ≥ 0.");
  if (!Number.isFinite(peep) || peep < 0) errors.push("PEEP harus ≥ 0.");
  if (!Number.isFinite(inspTime) || inspTime <= 0) errors.push("Inspiratory Time harus > 0.");
  if (!Number.isFinite(expTime) || expTime <= 0) errors.push("Expiratory Time harus > 0.");

  const el = document.getElementById("map-result");

  if (errors.length) {
    el.classList.remove("muted");
    el.innerHTML = `<b>Periksa input:</b><ul>${errors.map(e => `<li>${e}</li>`).join("")}</ul>`;
    return;
  }

  const totalTime = inspTime + expTime;
  const meanAirwayPressure = ((pip - peep) * inspTime / totalTime) + peep;
  
  const ieRatio = `1:${fmt(expTime / inspTime, 2)}`;

  el.classList.remove("muted");
  el.innerHTML = `
    <div class="kv">
      <div><b>PIP:</b> ${fmt(pip, 1)} cmH₂O</div>
      <div><b>PEEP:</b> ${fmt(peep, 1)} cmH₂O</div>
      <div><b>Inspiratory Time:</b> ${fmt(inspTime, 2)} detik</div>
      <div><b>Expiratory Time:</b> ${fmt(expTime, 2)} detik</div>
      <div><b>I:E Ratio:</b> ${ieRatio}</div>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.12);margin:10px 0;">
      <div><b>Mean Airway Pressure (MAP):</b> ${fmt(meanAirwayPressure, 2)} cmH₂O</div>
      <p class="muted" style="margin:10px 0 0;">
        Catatan: MAP = ((PIP - PEEP) × Ti / (Ti + Te)) + PEEP (model gelombang persegi).<br>
        Referensi: Marini JJ, Ravenscraft SA. <i>Chest.</i> 1992;101(2):568-576.
      </p>
    </div>
  `;
}

function resetMAP() {
  document.getElementById("map-pip").value = "";
  document.getElementById("map-peep").value = "";
  document.getElementById("map-insp-time").value = "";
  document.getElementById("map-exp-time").value = "";
  const el = document.getElementById("map-result");
  el.classList.add("muted");
  el.textContent = "Masukkan data, lalu klik Hitung MAP.";
}

// ===== OXYGENATION INDEX CALCULATOR =====
function calcOI() {
  const fio2 = n(document.getElementById("oi-fio2").value);
  const map = n(document.getElementById("oi-map").value);
  const pao2 = n(document.getElementById("oi-pao2").value);

  const errors = [];
  if (!Number.isFinite(fio2) || fio2 < 21 || fio2 > 100) errors.push("FiO₂ harus antara 21-100%.");
  if (!Number.isFinite(map) || map <= 0) errors.push("MAP harus > 0.");
  if (!Number.isFinite(pao2) || pao2 <= 0) errors.push("PaO₂ harus > 0.");

  const el = document.getElementById("oi-result");

  if (errors.length) {
    el.classList.remove("muted");
    el.innerHTML = `<b>Periksa input:</b><ul>${errors.map(e => `<li>${e}</li>`).join("")}</ul>`;
    return;
  }

  const fio2Decimal = fio2 / 100;
  const oi = (fio2Decimal * map * 100) / pao2;

  let interpretation = "";
  let severity = "";
  if (oi < 5) {
    interpretation = "Normal/Mild";
    severity = "";
  } else if (oi < 15) {
    interpretation = "Moderate";
    severity = "result-warning";
  } else if (oi < 25) {
    interpretation = "Severe";
    severity = "result-danger";
  } else {
    interpretation = "Very Severe (pertimbangkan ECMO)";
    severity = "result-danger";
  }

  el.classList.remove("muted");
  el.className = `result ${severity}`;
  el.innerHTML = `
    <div class="kv">
      <div><b>FiO₂:</b> ${fmt(fio2, 0)}%</div>
      <div><b>Mean Airway Pressure:</b> ${fmt(map, 1)} cmH₂O</div>
      <div><b>PaO₂:</b> ${fmt(pao2, 1)} mmHg</div>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.12);margin:10px 0;">
      <div><b>Oxygenation Index (OI):</b> ${fmt(oi, 2)}</div>
      <div><b>Interpretasi:</b> ${interpretation}</div>
      <p class="muted" style="margin:10px 0 0;">
        Catatan: OI = (FiO₂ × MAP × 100) / PaO₂. OI ≥ 25 menunjukkan gagal napas berat dan dapat memerlukan ECMO.<br>
        Referensi: Trachsel D, et al. <i>Intensive Care Med.</i> 2005;31(2):327-332.
      </p>
    </div>
  `;
}

function resetOI() {
  document.getElementById("oi-fio2").value = "";
  document.getElementById("oi-map").value = "";
  document.getElementById("oi-pao2").value = "";
  const el = document.getElementById("oi-result");
  el.classList.add("muted");
  el.className = "result muted";
  el.textContent = "Masukkan data, lalu klik Hitung OI.";
}

// ===== PELOD-2 SCORE CALCULATOR =====
// Reference: Leteurtre S, et al. Crit Care Med. 2013;41(7):1761-1773.
function calcPELOD() {
  const gcs = parseInt(document.getElementById("pelod-gcs").value);
  const pupil = parseInt(document.getElementById("pelod-pupil").value);
  const lactate = parseInt(document.getElementById("pelod-lactate").value);
  const mapCV = parseInt(document.getElementById("pelod-map-cv").value);
  const pfRatio = parseInt(document.getElementById("pelod-pf-ratio").value);
  const paco2 = parseInt(document.getElementById("pelod-paco2").value);
  const ventilation = parseInt(document.getElementById("pelod-ventilation").value);
  const creatinine = parseInt(document.getElementById("pelod-creatinine").value);
  const wbc = parseInt(document.getElementById("pelod-wbc").value);
  const platelets = parseInt(document.getElementById("pelod-platelets").value);

  const totalScore = gcs + pupil + lactate + mapCV + pfRatio + paco2 + ventilation + creatinine + wbc + platelets;

  // PELOD-2 mortality risk estimation using logistic regression
  // Formula: logit(P) = -6.61 + 0.47 * PELOD2_score
  // Based on Leteurtre et al., Crit Care Med. 2013;41(7):1761-1773
  const mortalityRisk = 100 / (1 + Math.exp(-((-6.61) + (0.47 * totalScore))));

  let riskCategory = "";
  let severity = "";
  if (mortalityRisk < 5) {
    riskCategory = "Rendah";
    severity = "result-success";
  } else if (mortalityRisk < 15) {
    riskCategory = "Sedang";
    severity = "result-warning";
  } else {
    riskCategory = "Tinggi";
    severity = "result-danger";
  }

  const el = document.getElementById("pelod-result");
  el.classList.remove("muted");
  el.className = `result ${severity}`;
  el.innerHTML = `
    <div class="kv">
      <div><b>Total PELOD-2 Score:</b> ${totalScore} / 33</div>
      <div><b>Estimasi Risiko Mortalitas:</b> ${fmt(mortalityRisk, 1)}%</div>
      <div><b>Kategori Risiko:</b> ${riskCategory}</div>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.12);margin:10px 0;">
      <div style="font-size: 13px;">
        <b>Breakdown Skor:</b><br>
        - Neurologis (GCS + Pupil): ${gcs + pupil}<br>
        - Kardiovaskular (Laktat + MAP): ${lactate + mapCV}<br>
        - Respirasi (PF Ratio + PaCO₂ + Ventilasi): ${pfRatio + paco2 + ventilation}<br>
        - Renal: ${creatinine}<br>
        - Hematologi (WBC + Trombosit): ${wbc + platelets}
      </div>
      <p class="muted" style="margin:10px 0 0;">
        Catatan: PELOD-2 score digunakan untuk menilai disfungsi organ multipel pada anak di ICU. Skor lebih tinggi = risiko mortalitas lebih tinggi.<br>
        Referensi: Leteurtre S, et al. <i>Crit Care Med.</i> 2013;41(7):1761-1773.
      </p>
    </div>
  `;
}

function resetPELOD() {
  document.getElementById("pelod-gcs").value = "0";
  document.getElementById("pelod-pupil").value = "0";
  document.getElementById("pelod-lactate").value = "0";
  document.getElementById("pelod-map-cv").value = "0";
  document.getElementById("pelod-pf-ratio").value = "0";
  document.getElementById("pelod-paco2").value = "0";
  document.getElementById("pelod-ventilation").value = "0";
  document.getElementById("pelod-creatinine").value = "0";
  document.getElementById("pelod-wbc").value = "0";
  document.getElementById("pelod-platelets").value = "0";
  const el = document.getElementById("pelod-result");
  el.classList.add("muted");
  el.className = "result muted";
  el.textContent = "Masukkan data, lalu klik Hitung PELOD-2 Score.";
}

// Initialize all event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation
  initNavigation();

  // Anthropometry
  document.getElementById("btnCalc").addEventListener("click", calcAnthropometry);
  document.getElementById("btnReset").addEventListener("click", resetAnthropometry);

  // Schofield
  document.getElementById("btnSchofield").addEventListener("click", calcSchofield);
  document.getElementById("btnSchofieldReset").addEventListener("click", resetSchofield);

  // Osmolarity
  document.getElementById("btnOsmolarity").addEventListener("click", calcOsmolarity);
  document.getElementById("btnOsmolarityReset").addEventListener("click", resetOsmolarity);

  // MAP
  document.getElementById("btnMAP").addEventListener("click", calcMAP);
  document.getElementById("btnMAPReset").addEventListener("click", resetMAP);

  // OI
  document.getElementById("btnOI").addEventListener("click", calcOI);
  document.getElementById("btnOIReset").addEventListener("click", resetOI);

  // PELOD
  document.getElementById("btnPELOD").addEventListener("click", calcPELOD);
  document.getElementById("btnPELODReset").addEventListener("click", resetPELOD);
});
