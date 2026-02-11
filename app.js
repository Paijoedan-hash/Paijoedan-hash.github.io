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
// Reference: Schofield WN. Predicting basal metabolic rate, new standards and
// review of previous work. Hum Nutr Clin Nutr 1985; 39C Suppl 1:5-41
// Equations from http://www.nafwa.org/schofield.php
// W = weight in kg, H = height in cm, result in kcal/day
function calcSchofield() {
  const sex = document.getElementById("schofield-sex").value;
  const age = n(document.getElementById("schofield-age").value);
  const weight = n(document.getElementById("schofield-weight").value);
  const height = n(document.getElementById("schofield-height").value);

  const errors = [];
  if (!Number.isFinite(age) || age < 0 || age > 30) errors.push("Usia harus 0-30 tahun.");
  if (!Number.isFinite(weight) || weight <= 0) errors.push("Berat harus > 0.");
  if (!Number.isFinite(height) || height <= 0) errors.push("Tinggi harus > 0.");

  const el = document.getElementById("schofield-result");

  if (errors.length) {
    el.classList.remove("muted");
    el.innerHTML = `<b>Periksa input:</b><ul>${errors.map(e => `<li>${e}</li>`).join("")}</ul>`;
    return;
  }

  let beeKcal;

  // Schofield equations (W = weight in kg, H = height in cm)
  if (sex === "M") {
    if (age < 3) {
      beeKcal = 0.167 * weight + 15.174 * height - 617.6;
    } else if (age < 10) {
      beeKcal = 19.59 * weight + 1.303 * height + 414.9;
    } else if (age < 18) {
      beeKcal = 16.25 * weight + 1.372 * height + 515.5;
    } else {
      beeKcal = 15.057 * weight - 0.1 * height + 705.8;
    }
  } else {
    if (age < 3) {
      beeKcal = 16.252 * weight + 10.232 * height - 413.5;
    } else if (age < 10) {
      beeKcal = 16.969 * weight + 1.618 * height + 371.2;
    } else if (age < 18) {
      beeKcal = 8.365 * weight + 4.65 * height + 200.0;
    } else {
      beeKcal = 13.623 * weight + 2.83 * height + 98.2;
    }
  }

  const bee = beeKcal * 4.184; // Convert to kJ/day for display

  let ageGroup;
  if (age < 3) ageGroup = "< 3 tahun";
  else if (age < 10) ageGroup = "3-10 tahun";
  else if (age < 18) ageGroup = "10-18 tahun";
  else ageGroup = "18-30 tahun";

  el.classList.remove("muted");
  el.innerHTML = `
    <div class="kv">
      <div><b>Jenis kelamin:</b> ${sex === "M" ? "Laki-laki" : "Perempuan"}</div>
      <div><b>Usia:</b> ${fmt(age, 0)} tahun (kelompok: ${ageGroup})</div>
      <div><b>Berat:</b> ${fmt(weight, 1)} kg</div>
      <div><b>Tinggi:</b> ${fmt(height, 1)} cm</div>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.12);margin:10px 0;">
      <div><b>BMR (Basal Metabolic Rate):</b> ${fmt(beeKcal, 1)} kcal/hari</div>
      <div><b>BMR:</b> ${fmt(bee, 1)} kJ/hari</div>
      <p class="muted" style="margin:10px 0 0;">
        Sumber: Schofield WN. Hum Nutr Clin Nutr 1985; 39C Suppl 1:5-41<br>
        Catatan: BMR adalah kebutuhan energi basal. Untuk kebutuhan energi total (TEE), perlu dikalikan dengan faktor aktivitas dan stress.
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
  el.textContent = "Masukkan data, lalu klik Hitung BMR.";
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
        Catatan: Nilai normal osmolaritas serum: 275-295 mOsm/kg. Formula yang digunakan: 2(Na) + Glucose/18 + BUN/2.8
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
        Catatan: MAP = ((PIP - PEEP) × Ti / (Ti + Te)) + PEEP. MAP penting untuk evaluasi strategi ventilasi dan oksigenasi.
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
        Catatan: OI = (FiO₂ × MAP × 100) / PaO₂. OI ≥ 25 menunjukkan gagal napas berat dan dapat memerlukan ECMO.
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
function calcPELOD() {
  const gcs = parseInt(document.getElementById("pelod-gcs").value);
  const pupil = parseInt(document.getElementById("pelod-pupil").value);
  const lactate = parseInt(document.getElementById("pelod-lactate").value);
  const mapCV = parseInt(document.getElementById("pelod-map-cv").value);
  const pfRatio = parseInt(document.getElementById("pelod-pf-ratio").value);
  const paco2 = parseInt(document.getElementById("pelod-paco2").value);
  const creatinine = parseInt(document.getElementById("pelod-creatinine").value);
  const wbc = parseInt(document.getElementById("pelod-wbc").value);
  const platelets = parseInt(document.getElementById("pelod-platelets").value);
  const liver = parseInt(document.getElementById("pelod-liver").value);

  const totalScore = gcs + pupil + lactate + mapCV + pfRatio + paco2 + creatinine + wbc + platelets + liver;

  // PELOD-2 mortality risk estimation using logistic regression
  // Formula: P(mortality) = 1 / (1 + exp(-(-0.71 + 0.12 * PELOD2_score)))
  // Based on Leteurtre et al., Lancet Respir Med. 2013;1(4):289-298
  const mortalityRisk = 100 / (1 + Math.exp(-((-0.71) + (0.12 * totalScore))));

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
      <div><b>Total PELOD-2 Score:</b> ${totalScore}</div>
      <div><b>Estimasi Risiko Mortalitas:</b> ${fmt(mortalityRisk, 1)}%</div>
      <div><b>Kategori Risiko:</b> ${riskCategory}</div>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.12);margin:10px 0;">
      <div style="font-size: 13px;">
        <b>Breakdown Skor:</b><br>
        - Neurologis (GCS + Pupil): ${gcs + pupil}<br>
        - Kardiovaskular (Laktat + MAP): ${lactate + mapCV}<br>
        - Respirasi (PF Ratio + PaCO₂): ${pfRatio + paco2}<br>
        - Renal: ${creatinine}<br>
        - Hematologi (WBC + Trombosit): ${wbc + platelets}<br>
        - Hepatik: ${liver}
      </div>
      <p class="muted" style="margin:10px 0 0;">
        Catatan: PELOD-2 score digunakan untuk menilai disfungsi organ multipel pada anak di ICU. Skor lebih tinggi = risiko mortalitas lebih tinggi.
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
  document.getElementById("pelod-creatinine").value = "0";
  document.getElementById("pelod-wbc").value = "0";
  document.getElementById("pelod-platelets").value = "0";
  document.getElementById("pelod-liver").value = "0";
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
