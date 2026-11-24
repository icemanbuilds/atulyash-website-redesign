/* Shared behaviour for the five blends: menu, pack choice, PIN check. Each page only styles it. */
(function () {
  var WA = "https://wa.me/919818588996?text=";

  /* Menu: a <details data-menu>. Closes on link tap, Escape and outside tap. */
  document.querySelectorAll("[data-menu]").forEach(function (m) {
    m.addEventListener("click", function (e) { if (e.target.closest("a")) m.open = false; });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && m.open) { m.open = false; m.querySelector("summary").focus(); }
    });
    document.addEventListener("click", function (e) { if (m.open && !m.contains(e.target)) m.open = false; });
  });

  /* Packs: buttons [data-kg] inside [data-packs]; [data-total] and [data-order] follow the choice. */
  document.querySelectorAll("[data-packs]").forEach(function (g) {
    var scope = g.closest("section") || document;
    function pick(btn) {
      g.querySelectorAll("[data-kg]").forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      var kg = +btn.dataset.kg, price = kg * 120;
      scope.querySelectorAll("[data-total]").forEach(function (t) { t.textContent = "₹" + price; });
      scope.querySelectorAll("[data-kgout]").forEach(function (t) { t.textContent = kg + " kg"; });
      scope.querySelectorAll("[data-order]").forEach(function (a) {
        a.href = WA + encodeURIComponent("Hi, I would like to order " + kg + " kg of Atulyash atta.");
      });
    }
    g.querySelectorAll("[data-kg]").forEach(function (b) { b.addEventListener("click", function () { pick(b); }); });
    var start = g.querySelector('[aria-pressed="true"]') || g.querySelector("[data-kg]");
    if (start) pick(start);
  });

  /* PIN check: sample only. Delhi NCR PIN prefixes count as served until the live list is confirmed. */
  var NCR = /^(110|121|122|124|201|203)\d{3}$/;
  document.querySelectorAll("[data-pin]").forEach(function (f) {
    var input = f.querySelector("input"), out = f.querySelector("output");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = (input.value || "").replace(/\D/g, "");
      f.classList.remove("ok", "no", "bad");
      if (v.length !== 6) { out.textContent = "Enter all 6 digits of your PIN code."; f.classList.add("bad"); input.setAttribute("aria-invalid", "true"); input.focus(); return; }
      input.removeAttribute("aria-invalid");
      if (NCR.test(v)) { out.innerHTML = "Yes, we deliver to " + v + '. <a href="#packs">Choose my atta</a>'; f.classList.add("ok"); }
      else { out.innerHTML = "We do not deliver to " + v + ' yet. <a href="' + WA + encodeURIComponent("Hi, please tell me when you deliver to " + v + ".") + '">WhatsApp us</a>'; f.classList.add("no"); }
    });
    input.addEventListener("input", function () { input.value = input.value.replace(/\D/g, "").slice(0, 6); });
  });

  /* Any link to #pin focuses the PIN field. */
  document.querySelectorAll('a[href="#pin"]').forEach(function (a) {
    a.addEventListener("click", function () { setTimeout(function () { var i = document.querySelector("#pin input"); if (i) i.focus({ preventScroll: true }); }, 350); });
  });
})();
