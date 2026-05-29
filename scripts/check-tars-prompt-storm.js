import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const files = [
  "src/components/featured/ProductStoryStack.jsx",
  "src/components/featured/FeaturedProjectsStory.css",
];

const violations = [];

for (const file of files) {
  const content = readFileSync(resolve(root, file), "utf8");

  if (/prompt-float|tarsPromptStormFloat/.test(content)) {
    violations.push(`${file}: found legacy prompt float animation tokens`);
  }

  const promptTextBlocks = content.match(/\.highlights-stack--tars\s+\.tars-prompt-storm__promptText\s*\{[^}]*\}/g) ?? [];
  for (const block of promptTextBlocks) {
    if (/\banimation(?:-[\w-]+)?\s*:/.test(block)) {
      violations.push(`${file}: prompt text has its own animation`);
      break;
    }
  }
}

const story = readFileSync(resolve(root, "src/components/featured/ProductStoryStack.jsx"), "utf8");
const css = readFileSync(resolve(root, "src/components/featured/FeaturedProjectsStory.css"), "utf8");

const blockFor = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{[\\s\\S]*?\\}`))?.[0] ?? "";
};

const stageBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__stage");
const groupBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__group");
const fieldBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__field");
const promptBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__prompt");
const promptPillBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__promptPill");
const headlineAnchorBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__headline");
const headlineBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__headlineCard");
const stageSetBlocks = story.match(/gsap\.set\(stage,\s*\{[\s\S]*?\}\);/g) ?? [];
const groupSetBlocks = story.match(/gsap\.set\(group,\s*\{[\s\S]*?\}\);/g) ?? [];

if (!/querySelector\("\.tars-prompt-storm__group"\)/.test(story)) {
  violations.push("ProductStoryStack.jsx: storm boundary transition must target the centered group");
}

if (/querySelector\("\.tars-prompt-storm__headlineCard"\)|gsap\.set\(headline|\.to\(headline/.test(story)) {
  violations.push("ProductStoryStack.jsx: headline must not have an independent boundary transition");
}

if (/gsap\.utils\.toArray\("\.tars-prompt-storm__prompt"|gsap\.set\(prompts|\.to\(prompts,\s*\{[\s\S]*?opacity/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt anchors must not have per-chip boundary opacity transitions");
}

if (/gsap\.set\(promptPills,\s*\{\s*opacity\s*:|\.to\(promptPills,\s*\{\s*opacity\s*:/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt pills must not control boundary visibility with opacity tweens");
}

const startMatch = story.match(/TARS_PROMPT_STORM_SCROLL_START_VH\s*=\s*([\d.]+)/);
const endMatch = story.match(/TARS_PROMPT_STORM_SCROLL_END_VH\s*=\s*([\d.]+)/);
const entryYMatch = story.match(/TARS_PROMPT_STORM_ENTRY_Y\s*=\s*(-?[\d.]+)/);
const entryZMatch = story.match(/TARS_PROMPT_STORM_ENTRY_Z\s*=\s*(-?[\d.]+)/);
const exitYMatch = story.match(/TARS_PROMPT_STORM_EXIT_Y\s*=\s*(-?[\d.]+)/);
const exitZMatch = story.match(/TARS_PROMPT_STORM_EXIT_Z\s*=\s*(-?[\d.]+)/);
const groupExitMatch = story.match(/\.to\(group,\s*\{[\s\S]*?opacity:\s*0[\s\S]*?\}\s*,\s*([\d.]+)\s*\)/);
const minHeightMatch = css.match(/\.highlights-stack--tars\s+\.tars-prompt-storm\s*\{[\s\S]*?min-height:\s*(\d+)dvh;/);
const mobileMinHeightMatch = css.match(/@media\s*\(max-width:\s*760px\)\s*\{[\s\S]*?\.highlights-stack--tars\s+\.tars-prompt-storm\s*\{[\s\S]*?min-height:\s*(\d+)dvh;/);

const scrollStart = startMatch ? Number(startMatch[1]) : NaN;
const scrollEnd = endMatch ? Number(endMatch[1]) : NaN;
const entryY = entryYMatch ? Number(entryYMatch[1]) : NaN;
const entryZ = entryZMatch ? Number(entryZMatch[1]) : NaN;
const exitY = exitYMatch ? Number(exitYMatch[1]) : NaN;
const exitZ = exitZMatch ? Number(exitZMatch[1]) : NaN;
const groupExit = groupExitMatch ? Number(groupExitMatch[1]) : NaN;
const minHeight = minHeightMatch ? Number(minHeightMatch[1]) : NaN;
const mobileMinHeight = mobileMinHeightMatch ? Number(mobileMinHeightMatch[1]) : NaN;

if (!Number.isFinite(scrollStart) || scrollStart < 0.9 || scrollStart > 0.98) {
  violations.push("ProductStoryStack.jsx: prompt storm should start shortly after the section enters the viewport");
}

if (!Number.isFinite(scrollEnd) || scrollEnd < 0.08 || scrollEnd > 0.16) {
  violations.push("ProductStoryStack.jsx: prompt storm scroll end should leave minimal dead zone before Agentic");
}

if (!Number.isFinite(entryY) || entryY > -180) {
  violations.push("ProductStoryStack.jsx: prompt chips should enter from above the settled field");
}

if (!Number.isFinite(entryZ) || entryZ < 240) {
  violations.push("ProductStoryStack.jsx: prompt chips should rain in with forward Z depth");
}

if (!Number.isFinite(exitY) || exitY < 150) {
  violations.push("ProductStoryStack.jsx: prompt chips should exit downward from the settled field");
}

if (!Number.isFinite(exitZ) || exitZ > -260) {
  violations.push("ProductStoryStack.jsx: prompt chips should exit backward in Z depth");
}

if (!Number.isFinite(groupExit) || groupExit < 0.86 || groupExit > 0.92) {
  violations.push("ProductStoryStack.jsx: centered group should exit late enough to finish close to Agentic");
}

if (!Number.isFinite(minHeight) || minHeight < 150 || minHeight > 190) {
  violations.push("FeaturedProjectsStory.css: prompt storm desktop scroll range should stay compact but readable");
}

if (!Number.isFinite(mobileMinHeight) || mobileMinHeight < 165 || mobileMinHeight > 205) {
  violations.push("FeaturedProjectsStory.css: prompt storm mobile scroll range should stay compact but readable");
}

if (!/\.tars-prompt-storm__stage\s*\{[\s\S]*?perspective:\s*1320px;[\s\S]*?perspective-origin:\s*50%\s+38%;/.test(css)) {
  violations.push("FeaturedProjectsStory.css: prompt storm stage should preserve a foreground rain perspective origin");
}

if (!/\.tars-prompt-storm__promptPill\s*\{[\s\S]*?backface-visibility:\s*hidden;/.test(css)) {
  violations.push("FeaturedProjectsStory.css: prompt pills should render as intact 3D chips");
}

if (!/transform-origin:\s*center\s+center;/.test(stageBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt storm stage must transform from center center");
}

if (!/left:\s*50%;/.test(groupBlock) || !/top:\s*50%;/.test(groupBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt storm group must be anchored at viewport center");
}

if (!/transform:\s*translate3d\(-50%,\s*-50%,\s*0\)\s*scale\(0\.88\);/.test(groupBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt storm group must have a center-origin CSS transform");
}

if (!/opacity:\s*0;/.test(groupBlock)) {
  violations.push("FeaturedProjectsStory.css: centered group must own boundary visibility");
}

if (!/transform-origin:\s*center\s+center;/.test(fieldBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt storm field must transform from center center");
}

if (!/left:\s*50%;/.test(promptBlock) || !/top:\s*50%;/.test(promptBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt anchors must use immutable 50%/50% layout, not variable top-left-prone layout");
}

if (!/--prompt-offset-x:\s*0px;/.test(promptBlock) || !/--prompt-offset-y:\s*0px;/.test(promptBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt offset variables must default to center-safe 0px values");
}

if (!/transform:\s*translate3d\(-50%,\s*-50%,\s*0\)\s*translate3d\(var\(--prompt-offset-x,\s*0px\),\s*var\(--prompt-offset-y,\s*0px\),\s*0\);/.test(promptBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt anchor transform must always include center translation before offsets");
}

if (!/transform:\s*translate3d\(0,\s*0,\s*0\)\s*rotate\(var\(--prompt-rotate,\s*0deg\)\)\s*scale\(1\);/.test(promptPillBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt pill visual transform must be local to the centered anchor");
}

if (!/transform-origin:\s*center\s+center;/.test(promptBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt chips must transform from center center");
}

if (!/left:\s*50%;/.test(headlineAnchorBlock) || !/top:\s*50%;/.test(headlineAnchorBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt storm headline anchor must use immutable 50%/50% layout");
}

if (!/transform:\s*translate3d\(-50%,\s*-50%,\s*0\);/.test(headlineAnchorBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt storm headline anchor must include center translation");
}

if (!/transform-origin:\s*center\s+center;/.test(headlineAnchorBlock) || !/transform-origin:\s*center\s+center;/.test(headlineBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt storm headline must transform from center center inside a centered anchor");
}

if (stageSetBlocks.length === 0 || stageSetBlocks.some((block) => !/transformOrigin:\s*"center center"/.test(block))) {
  violations.push("ProductStoryStack.jsx: stage GSAP set calls must pin transformOrigin to center center");
}

if (groupSetBlocks.length === 0 || groupSetBlocks.some((block) => !/transformOrigin:\s*"center center"/.test(block) || !/xPercent:\s*-50/.test(block) || !/yPercent:\s*-50/.test(block))) {
  violations.push("ProductStoryStack.jsx: group GSAP set calls must pin center origin and preserve center translation");
}

if (!/\.to\(group,\s*\{[\s\S]*?opacity:\s*1[\s\S]*?scale:\s*1[\s\S]*?\},\s*0\)/.test(story)) {
  violations.push("ProductStoryStack.jsx: group must fade/scale in from center as one unit");
}

if (!/\.to\(group,\s*\{[\s\S]*?opacity:\s*0[\s\S]*?scale:\s*0\.84[\s\S]*?\},\s*0\.88\)/.test(story)) {
  violations.push("ProductStoryStack.jsx: group must fade/scale out from center as one unit");
}

if (!/gsap\.set\(promptPills,\s*\{[\s\S]*?x:\s*0[\s\S]*?y:\s*\(index\)\s*=>\s*TARS_PROMPT_STORM_ENTRY_Y[\s\S]*?z:\s*\(index\)\s*=>\s*TARS_PROMPT_STORM_ENTRY_Z[\s\S]*?\}\);/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt chip entry should be top/Z depth motion with no sideways origin");
}

if (!/\.to\(promptPills,\s*\{[\s\S]*?y:\s*\(index\)\s*=>\s*TARS_PROMPT_STORM_EXIT_Y[\s\S]*?x:\s*0[\s\S]*?z:\s*\(index\)\s*=>\s*TARS_PROMPT_STORM_EXIT_Z[\s\S]*?\},\s*0\.8\)/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt chip exit should be bottom/back Z depth motion with no sideways origin");
}

if (/left:\s*(?:0|0px|0%);|top:\s*(?:0|0px|0%);/.test(promptBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt anchors must not use top-left 0/0 origin defaults");
}

if (/left:\s*(?:0|0px|0%);|top:\s*(?:0|0px|0%);/.test(headlineAnchorBlock)) {
  violations.push("FeaturedProjectsStory.css: headline anchor must not use top-left 0/0 origin defaults");
}

if (!/opacity:\s*1;/.test(promptBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt anchors must remain laid out/visible inside the group");
}

if (!/opacity:\s*1;/.test(headlineBlock)) {
  violations.push("FeaturedProjectsStory.css: headline card must remain visible inside the group");
}

async function runBrowserBoundaryCheck() {
  const url = process.env.TARS_PROMPT_STORM_QA_URL;
  if (!url) return null;

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (error) {
    throw new Error(`Browser boundary QA requested but Playwright is unavailable: ${error.message}`);
  }

  const artifact = resolve(root, process.env.TARS_PROMPT_STORM_QA_ARTIFACT ?? "artifacts/tars-prompt-storm-boundary-qa.json");
  const screenshot = resolve(root, process.env.TARS_PROMPT_STORM_QA_SCREENSHOT ?? "artifacts/tars-prompt-storm-boundary-qa.png");
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});

    const samples = [];
    const points = [
      ["before-start", -0.02],
      ["start", 0],
      ["just-after-start", 0.01],
      ["mid-scene-early", 0.25],
      ["mid-scene", 0.5],
      ["mid-scene-late", 0.75],
      ["just-before-end", 0.99],
      ["end", 1],
      ["after-end", 1.02],
    ];

    for (const [label, progress] of points) {
      const scrollY = await page.evaluate((targetProgress) => {
        const section = document.querySelector(".tars-prompt-storm");
        if (!section) throw new Error("Missing .tars-prompt-storm section");
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const start = viewportHeight * 0.94;
        const end = viewportHeight * 0.12 - section.getBoundingClientRect().height;
        const rectTop = start - targetProgress * (start - end);
        return Math.max(0, sectionTop - rectTop);
      }, progress);

      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(80);

      samples.push(await page.evaluate((sampleLabel) => {
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const topLeftCutoff = { x: viewport.width * 0.28, y: viewport.height * 0.28 };
        const inheritedOpacity = (node) => {
          let opacity = 1;
          let current = node;
          while (current && current.nodeType === 1) {
            opacity *= Number(window.getComputedStyle(current).opacity || 1);
            current = current.parentElement;
          }
          return opacity;
        };
        const nodes = Array.from(document.querySelectorAll(".tars-prompt-storm__headlineCard, .tars-prompt-storm__promptPill"));
        const elements = nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          const style = window.getComputedStyle(node);
          const opacity = Number(style.opacity || 0);
          const effectiveOpacity = inheritedOpacity(node);
          const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          const visible = effectiveOpacity > 0.03 && opacity > 0.03 && style.visibility !== "hidden" && style.display !== "none" && rect.width > 1 && rect.height > 1 && rect.bottom > 0 && rect.right > 0 && rect.left < viewport.width && rect.top < viewport.height;
          return {
            className: node.className,
            opacity,
            effectiveOpacity,
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            center,
            visible,
            topLeftish: visible && center.x < topLeftCutoff.x && center.y < topLeftCutoff.y,
          };
        });
        const headline = elements.find((element) => String(element.className).includes("tars-prompt-storm__headlineCard"));
        const visiblePrompts = elements.filter((element) => String(element.className).includes("tars-prompt-storm__promptPill") && element.visible);
        const isBoundarySample = !sampleLabel.startsWith("mid-scene");
        return {
          label: sampleLabel,
          scrollY: window.scrollY,
          viewport,
          violations: isBoundarySample ? elements.filter((element) => element.topLeftish) : [],
          headlineVisible: Boolean(headline?.visible),
          visiblePromptCount: visiblePrompts.length,
          visibleCount: elements.filter((element) => element.visible).length,
          elements: elements.filter((element) => element.visible || element.topLeftish).slice(0, 12),
        };
      }, label));
    }

    mkdirSync(dirname(artifact), { recursive: true });
    await page.screenshot({ path: screenshot, fullPage: false });
    const midSceneSamples = samples.filter((sample) => sample.label.startsWith("mid-scene"));
    const visibilityViolations = midSceneSamples.filter((sample) => !sample.headlineVisible || sample.visiblePromptCount < 8);
    const result = { ok: samples.every((sample) => sample.violations.length === 0) && visibilityViolations.length === 0, url, screenshot, samples };
    writeFileSync(artifact, `${JSON.stringify(result, null, 2)}\n`);
    if (!result.ok) {
      if (samples.some((sample) => sample.violations.length > 0)) {
        violations.push(`Browser boundary QA: visible top-left-ish storm elements found; see ${artifact}`);
      }
      if (visibilityViolations.length > 0) {
        violations.push(`Browser visibility QA: prompt storm headline and prompt chips must be visible mid-scene; see ${artifact}`);
      }
    }
    return artifact;
  } finally {
    await browser.close();
  }
}

try {
  const artifact = await runBrowserBoundaryCheck();
  if (violations.length > 0) {
    console.error("TARS prompt storm sanity check failed:");
    for (const violation of violations) console.error(`- ${violation}`);
    process.exit(1);
  }

  console.log("TARS prompt storm sanity check passed.");
  if (artifact) console.log(`Boundary browser QA artifact: ${artifact}`);
} catch (error) {
  console.error("TARS prompt storm sanity check failed:");
  console.error(`- ${error.message}`);
  process.exit(1);
}
