"use strict";
const toggle = document.querySelector(".menu-toggle"),
  menu = document.querySelector("#navigation");
function closeMenu(focus = false) {
  menu.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Otevřít menu");
  if (focus) toggle.focus();
}
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
  menu.classList.toggle("open", open);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true")
    closeMenu(true);
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".site-header")) closeMenu();
});
menu
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => closeMenu()));
matchMedia("(min-width:1024px)").addEventListener("change", () => closeMenu());
const form = document.getElementById("contact-form");
if (form) {
  const feedback = form.querySelector("#form-feedback");
  const submitButton = form.querySelector('button[type="submit"]');
  const fields = [...form.querySelectorAll("input,textarea")];
  let sending = false;
  form.addEventListener("input", () => {
    if (!sending) feedback.hidden = true;
    fields.forEach((field) => field.setCustomValidity(""));
  });
  function showFeedback(text, error = false) {
    feedback.textContent = text;
    feedback.hidden = false;
    feedback.setAttribute("role", error ? "alert" : "status");
    feedback.dataset.state = error ? "error" : "success";
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    const name = form.elements.name,
      phone = form.elements.phone,
      message = form.elements.message;
    name.setCustomValidity(
      name.value.trim().length < 2 ? "Vyplňte prosím své jméno." : "",
    );
    message.setCustomValidity(
      message.value.trim().length < 10
        ? "Napište prosím zprávu alespoň o 10 znacích."
        : "",
    );
    phone.setCustomValidity(
      phone.value.trim() && !/^[+\d\s()-]{6,25}$/.test(phone.value.trim())
        ? "Zkontrolujte prosím telefonní číslo."
        : "",
    );
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    for (const field of fields)
      if (field.name) data.set(field.name, field.value.trim());
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    sending = true;
    submitButton.disabled = true;
    submitButton.textContent = "Odesílám…";
    form.setAttribute("aria-busy", "true");
    fields.forEach((field) => (field.disabled = true));
    feedback.hidden = true;
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        credentials: "omit",
        signal: controller.signal,
      });
      if (response.ok) {
        form.reset();
        showFeedback(
          "Děkujeme! Vaše zpráva byla úspěšně odeslána. Ozveme se vám na uvedený e-mail.",
        );
      } else {
        showFeedback(
          response.status === 422
            ? "Zprávu se nepodařilo odeslat. Zkontrolujte vyplněné údaje a zkuste to znovu. Případně napište na spolekhlavonozec@gmail.com."
            : "Služba zprávu nepřijala. Text zůstal vyplněný. Zkuste to později nebo napište na spolekhlavonozec@gmail.com.",
          true,
        );
      }
    } catch (error) {
      showFeedback(
        error.name === "AbortError"
          ? "Potvrzení odeslání nepřišlo včas. Text zůstal vyplněný. Pokud se vám neozveme, kontaktujte nás na spolekhlavonozec@gmail.com."
          : "Odeslání se nepodařilo potvrdit. Zkontrolujte připojení. Text zůstal vyplněný; můžete jej poslat na spolekhlavonozec@gmail.com.",
        true,
      );
    } finally {
      clearTimeout(timeout);
      sending = false;
      fields.forEach((field) => (field.disabled = false));
      submitButton.disabled = false;
      submitButton.textContent = "Odeslat zprávu →";
      form.removeAttribute("aria-busy");
    }
  });
}
// Keep the navigation in sync with the visible section, including manual scroll.
const sectionLinks = [...menu.querySelectorAll('a[href^="#"]')];
const sections = [...document.querySelectorAll("[data-nav-section]")];
let scrollQueued = false;
function updateActiveSection() {
  scrollQueued = false;
  const line = document.querySelector(".site-header").offsetHeight + 130;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= line) active = section;
  }
  sectionLinks.forEach((a) => {
    if (a.hash === "#" + active.id) a.setAttribute("aria-current", "location");
    else a.removeAttribute("aria-current");
  });
}
addEventListener(
  "scroll",
  () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateActiveSection);
    }
  },
  { passive: true },
);
addEventListener("resize", updateActiveSection);
updateActiveSection();
document.querySelectorAll("[data-contact-link]").forEach((a) =>
  a.addEventListener("click", () => {
    if (form) {
      form.elements.message.value =
        "Dobrý den, máme zájem o letní tábor 2027. Prosím o bližší informace k přihlášení. Děkujeme.";
      form.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }),
);
function openPrivacy() {
  if (location.hash === "#soukromi") {
    const details = document.querySelector("#soukromi>details");
    if (details) details.open = true;
  }
}
addEventListener("hashchange", openPrivacy);
openPrivacy();
document.querySelectorAll('a[href="#soukromi"]').forEach((a) =>
  a.addEventListener("click", () => {
    document.querySelector("#soukromi>details").open = true;
  }),
);
