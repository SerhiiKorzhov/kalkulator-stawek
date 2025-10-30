document.addEventListener("DOMContentLoaded", function() {

  const nettoInput = document.getElementById("netto");
  const marzaInput = document.getElementById("marza");
  const mieszkanieInput = document.getElementById("mieszkanie");

  function oblicz() {
    let netto = parseFloat(nettoInput.value);
    let marza = parseFloat(marzaInput.value);
    let mieszkanie = mieszkanieInput.checked;

    if (isNaN(netto) || isNaN(marza)) {
      document.getElementById("wynik").style.display = "none";
      return;
    }

    // Если нет жилья, добавляем +1 zł
    let nettoPlus = mieszkanie ? netto : netto + 1;

    // --- Расчёт brutto итерацией ---
    function nettoZBrutto(brutto) {
      // Składki pracownika
      let skladkiPracownika = brutto * (0.0976 + 0.015); // emerytalna + rentowa
      let podstawaZdrowotna = brutto - skladkiPracownika;
      let skladkaZdrowotna = podstawaZdrowotna * 0.09;
      return brutto - skladkiPracownika - skladkaZdrowotna;
    }

    let brutto = nettoPlus;
    let krok = 0.01;
    let nettoObliczone = 0;
    let maxIter = 10000;
    let iter = 0;

    while (true) {
      nettoObliczone = nettoZBrutto(brutto);
      if (Math.abs(nettoObliczone - nettoPlus) < 0.01 || iter > maxIter) break;
      brutto += (nettoObliczone < nettoPlus) ? krok : -krok;
      iter++;
    }

    // Koszt pracodawcy = brutto + składki pracodawcy
    // Emerytalne 9.76%, Rentowe 6.5%, Wypadkowe 1.67%, FP 2.45%, FGŚP 0.01%
    let koszt = brutto * (1 + 0.0976 + 0.065 + 0.0167 + 0.0245 + 0.0001);

    // Stawka dla klienta = koszt * (1 + marza/100)
    let klient = koszt * (1 + marza / 100);

    // Вывод
    document.getElementById("brutto").textContent = brutto.toFixed(2);
    document.getElementById("koszt").textContent = koszt.toFixed(2);
    document.getElementById("klient").textContent = klient.toFixed(2);
    document.getElementById("wynik").style.display = "block";
  }

  // События пересчёта
  nettoInput.addEventListener("input", oblicz);
  marzaInput.addEventListener("input", oblicz);
  mieszkanieInput.addEventListener("change", oblicz);

});
