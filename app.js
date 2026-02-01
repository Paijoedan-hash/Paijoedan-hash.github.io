function n(v) {
  const x = Number(v);
  return Number.isFinite(x) ? x : NaN;
}

function fmt(v, digits = 2) {
  if (!Number.isFinite(v)) return "-";
  return v.toFixed(digits);
}

function calc() {
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

  // BB/TB sederhana (bukan Z-score): hanya rasio kg per cm untuk gambaran
  const wfhRatio = weightKg / heightCm; // kg/cm

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

function resetForm() {
  document.getElementById("sex").value = "L";
  document.getElementById("ageMonths").value = "";
  document.getElementById("weightKg").value = "";
  document.getElementById("heightCm").value = "";
  const el = document.getElementById("result");
  el.classList.add("muted");
  el.textContent = "Masukkan data, lalu klik Hitung.";
}

document.getElementById("btnCalc").addEventListener("click", calc);
document.getElementById("btnReset").addEventListener("click", resetForm);
