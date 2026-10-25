import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => readFile(path.join(root, p), "utf8");
const anchors = {
  index: "o-nas",
  tym: "tym",
  tabor: "tabor",
  galerie: "galerie",
  kontakt: "kontakt",
  prihlaska: "prihlaska",
  soukromi: "soukromi",
};
function linkSections(html) {
  return html.replace(
    /href="(index|tym|tabor|galerie|kontakt|prihlaska|soukromi)\.html(?:\?tema=tabor)?(?:#contact-form)?"/g,
    (_, page) =>
      `href="#${anchors[page]}"${_.includes("?tema=tabor") ? " data-contact-link" : ""}`,
  );
}
function sectionContent(html) {
  return html
    .replace(/<main\b[^>]*>/, '<div class="section-body">')
    .replace(/<\/main>/, "</div>")
    .replace(/<h1\b([^>]*)>/g, "<h2$1 data-section-title>")
    .replace(/<\/h1>/g, "</h2>");
}
const [header, footer] = await Promise.all([
  read("src/components/header.html"),
  read("src/components/footer.html"),
]);
const sections = [];
for (const id of ["index", "tabor", "prihlaska", "tym", "galerie", "kontakt"]) {
  let content = await read("src/pages/" + id + ".html");
  if (id === "index")
    content = content
      .replace(/<main\b[^>]*>/, '<div class="section-body">')
      .replace(/<\/main>/, "</div>");
  else content = sectionContent(content);
  sections.push(
    `<section class="page-section" id="${anchors[id]}"${id !== "prihlaska" ? " data-nav-section" : ""}>${linkSections(content)}</section>`,
  );
}
const privacy = sectionContent(await read("src/pages/soukromi.html"));
sections.push(
  `<section class="privacy-section container narrow" id="soukromi"><details><summary>Ochrana osobních údajů a soukromí</summary>${privacy}</details></section>`,
);
const html = `<!doctype html>\n<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><title>Hlavonožec, z. s. | Letní tábory a akce pro děti</title><meta name="description" content="Letní tábory a výpravy pro děti od 6 do 15 let. Poznejte spolek Hlavonožec, naše vedoucí a připravovaný tábor 2027 v Horní Bečvě."><meta property="og:title" content="Hlavonožec – společně za zážitky"><meta property="og:description" content="Respektující přístup, přátelství a společné zážitky v přírodě. Připravujeme letní tábor 2027 v Horní Bečvě."><meta property="og:type" content="website"><link rel="icon" type="image/png" href="assets/favicon.png"><link rel="stylesheet" href="assets/fonts.css"><link rel="stylesheet" href="assets/design.css"><link rel="stylesheet" href="assets/site.css"><script src="assets/app.js" defer></script></head><body data-page="onepage">${linkSections(header)}<main class="site-main" id="main" tabindex="-1">${sections.join("\n")}</main>${linkSections(footer)}</body></html>\n`;
await writeFile(path.join(root, "index.html"), html);
// Preserve any earlier direct links while keeping the visitor on one page.
for (const [id, anchor] of Object.entries(anchors)) {
  if (id === "index") continue;
  await writeFile(
    path.join(root, id + ".html"),
    `<!doctype html><html lang="cs"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=index.html#${anchor}"><title>Hlavonožec</title><a href="index.html#${anchor}">Pokračovat na web Hlavonožec</a></html>`,
  );
}
console.log("Hotovo: jeden souvislý web s navigací na sekce.");
