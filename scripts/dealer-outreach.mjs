#!/usr/bin/env node
/**
 * Generates a dealer outreach list with:
 * - Dealer name, website, country
 * - Their Metalorix listing URL (so they can verify they're listed)
 * - A template email to paste into their contact form
 *
 * Usage: node scripts/dealer-outreach.mjs > outreach-list.tsv
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Quick-parse dealers from source (avoids TS compilation)
const dealersSrc = readFileSync(
  resolve(__dirname, "../src/lib/data/dealers.ts"),
  "utf-8"
);

// Extract DEALER_COUNTRIES for slug mapping
const countriesSrc = readFileSync(
  resolve(__dirname, "../src/lib/data/dealers.ts"),
  "utf-8"
);

// Parse dealers from the DEALERS array
const dealerBlocks = dealersSrc
  .split(/\n\s*\{/)
  .slice(1)
  .map((b) => "{" + b.split(/\n\s*\}/)[0] + "}");

const dealers = [];
for (const block of dealerBlocks) {
  const id = block.match(/id:\s*"([^"]+)"/)?.[1];
  const name = block.match(/name:\s*"([^"]+)"/)?.[1];
  const website = block.match(/website:\s*"([^"]+)"/)?.[1];
  const countryCode = block.match(/countryCode:\s*"([^"]+)"/)?.[1];
  const city = block.match(/city:\s*"([^"]+)"/)?.[1];
  const featured = block.includes("featured: true");
  if (name && website) {
    dealers.push({ id, name, website, countryCode, city, featured });
  }
}

// Parse country slugs for building Metalorix URLs
const countryMap = {};
const countryRegex =
  /code:\s*"(\w+)"[\s\S]*?slug:\s*\{[^}]*en:\s*"([^"]+)"/g;
let cm;
while ((cm = countryRegex.exec(countriesSrc)) !== null) {
  countryMap[cm[1]] = cm[2];
}

console.log("Name\tWebsite\tCountry\tCity\tFeatured\tMetalorix Listing URL");
for (const d of dealers) {
  const countrySlug = countryMap[d.countryCode] || d.countryCode;
  const listingUrl = `https://metalorix.com/en/where-to-buy/${countrySlug}`;
  console.log(
    `${d.name}\t${d.website}\t${d.countryCode.toUpperCase()}\t${d.city || ""}\t${d.featured ? "Yes" : ""}\t${listingUrl}`
  );
}

console.error(`\n--- ${dealers.length} dealers with websites ---`);
console.error("\n=== ENGLISH EMAIL TEMPLATE (paste into dealer contact forms) ===\n");
console.error(`Subject: Your listing on Metalorix.com — free backlink opportunity

Hi,

I'm reaching out from Metalorix (https://metalorix.com), a precious metals price tracking platform used by investors worldwide.

Your shop is listed in our trusted dealer directory at:
[PASTE THEIR LISTING URL HERE]

We'd love it if you could add a link to Metalorix on your website — it helps your customers track prices and helps us keep the platform free. Here's a ready-to-use HTML badge:

<a href="https://metalorix.com" target="_blank" rel="noopener" title="Metalorix — Precious Metals Prices">
  <img src="https://metalorix.com/icon-192.png" alt="Metalorix" width="48" height="48" style="border-radius:8px" />
</a>

You can also find more badge options and our press kit at:
https://metalorix.com/en/press

If you'd like to update your listing info or have any questions, just reply to this email.

Best regards,
Metalorix Team
hola@metalorix.com
`);

console.error("\n=== SPANISH EMAIL TEMPLATE ===\n");
console.error(`Asunto: Tu ficha en Metalorix.com — oportunidad de backlink gratuito

Hola,

Me pongo en contacto desde Metalorix (https://metalorix.com), una plataforma de seguimiento de precios de metales preciosos usada por inversores de todo el mundo.

Tu tienda aparece en nuestro directorio de dealers de confianza en:
[PEGA AQUÍ LA URL DE SU FICHA]

Nos encantaría que añadieras un enlace a Metalorix en tu web — ayuda a tus clientes a seguir los precios y nos ayuda a mantener la plataforma gratuita. Aquí tienes un badge HTML listo para usar:

<a href="https://metalorix.com" target="_blank" rel="noopener" title="Metalorix — Precios de Metales Preciosos">
  <img src="https://metalorix.com/icon-192.png" alt="Metalorix" width="48" height="48" style="border-radius:8px" />
</a>

También puedes encontrar más opciones de badges y nuestro kit de prensa en:
https://metalorix.com/es/prensa

Si quieres actualizar la información de tu ficha o tienes alguna pregunta, responde a este mensaje.

Un saludo,
Equipo Metalorix
hola@metalorix.com
`);
