document.addEventListener("DOMContentLoaded", function () {
  const nettoInput = document.getElementById("netto");
  const marzaInput = document.getElementById("marza");
  const mieszkanieInput = document.getElementById("mieszkanie");

  const godzinyInput = document.getElementById("godziny");
  const pokazaneGodzinyInput = document.getElementById("pokazane_godziny");
  const pracownicyInput = document.getElementById("pracownicy");

  const kosztMieszkaniaInput = document.getElementById("koszt_mieszkania");
  const kosztTransportuInput = document.getElementById("koszt_transportu");
  const kosztOdziezyInput = document.getElementById("koszt_odziezy");

  const obliczBtn = document.getElementById("oblicz");

  function oblicz() {
    let netto = parseFloat(nettoInput.value);
    let marza = parseFloat(marzaInput.value);
    let mieszkanie = mieszkanieInput.checked;

    let godziny = parseFloat(godzinyInput.value);
    let pokazaneGodziny = parseFloat(pokazaneGodzinyInput.value);
    let pracownicy = parseInt(pracownicyInput.value, 10);

    let kosztMieszkania = parseFloat(kosztMieszkaniaInput.value) || 0;
    let kosztTransportu = parseFloat(kosztTransportuInput.value) || 0;
    let kosztOdziezy = parseFloat(kosztOdziezyInput.value) || 0;

    if (
      isNaN(netto) ||
      isNaN(marza) ||
      isNaN(godziny) ||
      isNaN(pokazaneGodziny) ||
      isNaN(pracownicy)
    ) {
      document.getElementById("wynik").style.display = "none";
      return;
    }

    if (godziny < 0 || pokazaneGodziny < 0 || pracownicy < 1) {
      document.getElementById("wynik").style.display = "none";
      return;
    }

    if (pokazaneGodziny > godziny) {
      pokazaneGodziny = godziny;
      pokazaneGodzinyInput.value = godziny;
    }

    function nettoZBrutto(brutto) {
      let skladkiPracownika = brutto * (0.0976 + 0.015); // emerytalna + rentowa
      let podstawaZdrowotna = brutto - skladkiPracownika;
      let skladkaZdrowotna = podstawaZdrowotna * 0.09;
      return brutto - skladkiPracownika - skladkaZdrowotna;
    }

    let brutto = netto;
    let krok = 0.01;
    let nettoObliczone = 0;
    let maxIter = 10000;
    let iter = 0;

    while (true) {
      nettoObliczone = nettoZBrutto(brutto);
      if (Math.abs(nettoObliczone - netto) < 0.01 || iter > maxIter) break;
      brutto += (nettoObliczone < netto) ? krok : -krok;
      iter++;
    }

    // koszt pracodawcy za 1h pokazana
    let koszt = brutto * (1 + 0.0976 + 0.065 + 0.0167 + 0.0245 + 0.0001);

    // stawka klienta za 1h
    let klient = koszt * (1 + marza / 100);

    // jeśli klient nie ma swojego mieszkania, doliczamy +1 zł / h
    if (!mieszkanie) {
      klient += 1;
    }

    let godzinyNiepokazane = godziny - pokazaneGodziny;

    // pełna wypłata pracownika
    let wynagrodzenieNetto = netto * godziny;

    // dodatkowy narzut legalny tylko na pokazywane godziny
    let narzutLegalnyNaGodzine = koszt - netto;
    let narzutLegalny = narzutLegalnyNaGodzine * pokazaneGodziny;

    // mieszkanie liczymy tylko jeśli klient go nie zapewnia
    let mieszkanieDoKosztu = mieszkanie ? 0 : kosztMieszkania;

    // łączny koszt 1 pracownika
    let kosztLaczny1 =
      wynagrodzenieNetto +
      narzutLegalny +
      mieszkanieDoKosztu +
      kosztTransportu +
      kosztOdziezy;

    // przychód z 1 pracownika
    let przychod1 = klient * godziny;

    // zysk z 1 pracownika
    let zysk1 = przychod1 - kosztLaczny1;

    // realna marża
    let marzaRealna1 = przychod1 > 0 ? (zysk1 / przychod1) * 100 : 0;

    // wszyscy pracownicy
    let przychodWszyscy = przychod1 * pracownicy;
    let kosztWszyscy = kosztLaczny1 * pracownicy;
    let zyskWszyscy = zysk1 * pracownicy;
    let marzaRealnaWszyscy = przychodWszyscy > 0 ? (zyskWszyscy / przychodWszyscy) * 100 : 0;

    // output
    document.getElementById("brutto").textContent = brutto.toFixed(2);
    document.getElementById("koszt").textContent = koszt.toFixed(2);
    document.getElementById("klient").textContent = klient.toFixed(2);

    document.getElementById("godziny_niepokazane").textContent = godzinyNiepokazane.toFixed(2);
    document.getElementById("wynagrodzenie_netto").textContent = wynagrodzenieNetto.toFixed(2);
    document.getElementById("narzut_legalny").textContent = narzutLegalny.toFixed(2);
    document.getElementById("mieszkanie_wynik").textContent = mieszkanieDoKosztu.toFixed(2);
    document.getElementById("transport_wynik").textContent = kosztTransportu.toFixed(2);
    document.getElementById("odziez_wynik").textContent = kosztOdziezy.toFixed(2);
    document.getElementById("koszt_laczny_1").textContent = kosztLaczny1.toFixed(2);
    document.getElementById("przychod_1").textContent = przychod1.toFixed(2);
    document.getElementById("zysk_1").textContent = zysk1.toFixed(2);
    document.getElementById("marza_realna_1").textContent = marzaRealna1.toFixed(2);

    document.getElementById("przychod_wszyscy").textContent = przychodWszyscy.toFixed(2);
    document.getElementById("koszt_wszyscy").textContent = kosztWszyscy.toFixed(2);
    document.getElementById("zysk_wszyscy").textContent = zyskWszyscy.toFixed(2);
    document.getElementById("marza_realna_wszyscy").textContent = marzaRealnaWszyscy.toFixed(2);

    document.getElementById("wynik").style.display = "block";
  }

  nettoInput.addEventListener("input", oblicz);
  marzaInput.addEventListener("input", oblicz);
  mieszkanieInput.addEventListener("change", oblicz);
  godzinyInput.addEventListener("input", oblicz);
  pokazaneGodzinyInput.addEventListener("input", oblicz);
  pracownicyInput.addEventListener("input", oblicz);
  kosztMieszkaniaInput.addEventListener("input", oblicz);
  kosztTransportuInput.addEventListener("input", oblicz);
  kosztOdziezyInput.addEventListener("input", oblicz);
  obliczBtn.addEventListener("click", oblicz);
});