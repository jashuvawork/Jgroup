#!/usr/bin/env node
/**
 * Download public media from @j_surprise_events_ via imginn viewer.
 * Run: node scripts/download-instagram-events.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GALLERY = path.join(ROOT, "public/events/gallery");
const VIDEOS = path.join(ROOT, "public/events/videos");
const MANIFEST = path.join(ROOT, "public/events/manifest.json");
const PROFILE = "https://imginn.com/j_surprise_events_/";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function fetchHtml(url) {
  return execSync(`curl -sL -A "${UA}" "${url}"`, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
}

function decodeEntities(s) {
  return s.replace(/&#38;/g, "&").replace(/&amp;/g, "&");
}

function slugify(text, max = 48) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, max);
}

function download(url, dest) {
  const dir = path.dirname(dest);
  fs.mkdirSync(dir, { recursive: true });
  execSync(`curl -sL -A "${UA}" -o "${dest}" "${url}"`, { stdio: "pipe" });
  const size = fs.statSync(dest).size;
  if (size < 5000) throw new Error(`File too small (${size}b): ${dest}`);
}

function parsePost(html, shortcode) {
  const caption =
    html.match(/Tagged Users:[\s\S]*?<\/div>\s*([^<]{10,400})/i)?.[1]?.trim() ||
    html.match(/#birthdaysurprise[\s\S]{0,200}/i)?.[0]?.trim() ||
    "";

  const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  const ogVideo = html.match(/property="og:video(?::url)?" content="([^"]+)"/)?.[1];

  const videoUrls = [
    ogVideo,
    ...[...html.matchAll(/https:\/\/[^"'\s<>]+\.mp4[^"'\s<>]*/g)].map((m) => m[0]),
  ].filter(Boolean);

  const imageUrls = [
    ogImage,
    ...[...html.matchAll(/https:\/\/s[0-9]\.imginn\.com\/[^"'\s<>]+\.jpg[^"'\s<>]*/g)].map((m) => m[0]),
  ]
    .filter(Boolean)
    .map(decodeEntities)
    .filter((u) => !u.includes("s150x150") && !u.includes("profile_pic"));

  const isVideo = videoUrls.length > 0 || html.includes("video-icon") || /video/i.test(ogImage || "");

  return {
    shortcode,
    caption,
    isVideo,
    imageUrl: imageUrls[0] || null,
    videoUrl: videoUrls[0] ? decodeEntities(videoUrls[0]) : null,
  };
}

function inferPackage(caption, isVideo) {
  const c = caption.toLowerCase();
  if (c.includes("car") || c.includes("vehicle") || c.includes("bike")) return "Car Decoration";
  if (c.includes("flash") || c.includes("mob") || c.includes("dance")) return "Flash Mob (Local)";
  if (c.includes("chocolate") || c.includes("bouquet") || c.includes("gift") || c.includes("rose"))
    return "Basic Package";
  if (c.includes("rooftop") || c.includes("house") || c.includes("home")) return "House Surprise";
  if (c.includes("wedding") || c.includes("mandap") || c.includes("haldi")) return "Mandapam / Haldi & Event Decoration";
  if (c.includes("birthday") || c.includes("cake") || c.includes("balloon")) return "Birthday Decoration";
  if (isVideo) return "Surprise at Restaurant";
  return "Basic Package";
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  for (const dir of [GALLERY, VIDEOS]) {
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
    } else {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const profileHtml = fetchHtml(PROFILE);
  const shortcodes = [...new Set([...profileHtml.matchAll(/\/p\/([A-Za-z0-9_-]+)\//g)].map((m) => m[1]))];
  console.log(`Found ${shortcodes.length} posts on profile page`);

  const manifest = [];
  let index = 0;

  for (const shortcode of shortcodes) {
    index++;
    const postUrl = `https://imginn.com/p/${shortcode}/`;
    const igUrl = `https://www.instagram.com/p/${shortcode}/`;
    console.log(`[${index}/${shortcodes.length}] ${shortcode}`);

    let html;
    try {
      html = fetchHtml(postUrl);
    } catch (e) {
      console.warn(`  skip fetch: ${e.message}`);
      continue;
    }

    const post = parsePost(html, shortcode);
    const pkg = inferPackage(post.caption, post.isVideo);
    const base = `${String(index).padStart(2, "0")}-${slugify(pkg)}-${shortcode.slice(0, 6)}`;

    try {
      if (post.videoUrl) {
        const dest = path.join(VIDEOS, `${base}.mp4`);
        download(post.videoUrl, dest);
        manifest.push({
          file: `events/videos/${path.basename(dest)}`,
          type: "video",
          package: pkg,
          description: post.caption.slice(0, 200) || pkg,
          instagramUrl: igUrl,
          shortcode,
        });
        console.log(`  video -> ${path.basename(dest)}`);
      }

      if (post.imageUrl) {
        const dest = path.join(GALLERY, `${base}.jpg`);
        download(post.imageUrl, dest);
        manifest.push({
          file: `events/gallery/${path.basename(dest)}`,
          type: "image",
          package: pkg,
          description: post.caption.slice(0, 200) || pkg,
          instagramUrl: igUrl,
          shortcode,
        });
        console.log(`  image -> ${path.basename(dest)}`);
      }
    } catch (e) {
      console.warn(`  download failed: ${e.message}`);
    }

    await sleep(400);
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\nDone. ${manifest.length} media items -> ${MANIFEST}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
