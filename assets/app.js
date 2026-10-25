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
  let draftURL;
  if (new URLSearchParams(location.search).get("tema") === "tabor")
    form.elements.message.value =
      "Dobrý den, máme zájem o letní tábor 2027. Prosím o bližší informace k přihlášení. Děkujeme.";
  form.addEventListener("input", () => {
    feedback.hidden = true;
    form
      .querySelectorAll("input,textarea")
      .forEach((f) => f.setCustomValidity(""));
    if (draftURL) {
      URL.revokeObjectURL(draftURL);
      draftURL = undefined;
    }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name,
      email = form.elements.email,
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
    const subject = "Dotaz z webu Hlavonožec",
      body = `Dobrý den,\n\n${message.value.trim()}\n\n${name.value.trim()}\nE-mail: ${email.value.trim()}${phone.value.trim() ? "\nTelefon: " + phone.value.trim() : ""}`;
    feedback.replaceChildren();
    const title = document.createElement("strong");
    title.textContent = "E-mail je připravený. Zpráva zatím nebyla odeslána.";
    const intro = document.createElement("p");
    intro.textContent =
      "Otevřete zprávu ve svém e-mailovém programu a odešlete ji. Pokud se program neotevře, stáhněte e-mail nebo zkopírujte text a pošlete ho na spolekhlavonozec@gmail.com.";
    const preview = document.createElement("pre");
    preview.textContent = body;
    const actions = document.createElement("div");
    actions.className = "hero-actions";
    const open = document.createElement("a");
    open.className = "button";
    open.textContent = "Otevřít e-mailový program ↗";
    open.href = `mailto:spolekhlavonozec@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const download = document.createElement("a");
    download.className = "button secondary";
    download.textContent = "Stáhnout e-mail (.eml)";
    download.download = "dotaz-hlavonozec.eml";
    const bytes = new TextEncoder().encode(body.replace(/\n/g, "\r\n"));
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const encoded = btoa(binary)
      .match(/.{1,76}/g)
      .join("\r\n");
    if (draftURL) URL.revokeObjectURL(draftURL);
    draftURL = URL.createObjectURL(
      new Blob(
        [
          `To: spolekhlavonozec@gmail.com\r\nSubject: Dotaz z webu Hlavonozec\r\nX-Unsent: 1\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${encoded}\r\n`,
        ],
        { type: "message/rfc822" },
      ),
    );
    download.href = draftURL;
    actions.append(open, download);
    feedback.append(title, intro, preview, actions);
    feedback.hidden = false;
    feedback.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest",
    });
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
