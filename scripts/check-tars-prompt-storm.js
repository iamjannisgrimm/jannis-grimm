import { readFileSync } from "node:fs";
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
const fieldBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__field");
const promptBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__prompt");
const promptPillBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__promptPill");
const headlineAnchorBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__headline");
const headlineBlock = blockFor(".highlights-stack--tars .tars-prompt-storm__headlineCard");
const stageSetBlocks = story.match(/gsap\.set\(stage,\s*\{[\s\S]*?\}\);/g) ?? [];
const headlineSetBlocks = story.match(/gsap\.set\(headline,\s*\{[\s\S]*?\}\);/g) ?? [];

if (!/gsap\.set\(promptPills,\s*\{[\s\S]*?y:\s*\(index\)\s*=>\s*-220[\s\S]*?z:\s*\(index\)\s*=>\s*360[\s\S]*?scale:\s*\(index\)\s*=>\s*1\.46/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt entry should start above the field from positive z/foreground scale");
}

if (!/\.to\(promptPills,\s*\{[\s\S]*?y:\s*\(index\)\s*=>\s*220[\s\S]*?z:\s*\(index\)\s*=>\s*-360[\s\S]*?scale:\s*\(index\)\s*=>\s*0\.44/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt exit should keep falling down and away on negative z");
}

const startMatch = story.match(/TARS_PROMPT_STORM_SCROLL_START_VH\s*=\s*([\d.]+)/);
const endMatch = story.match(/TARS_PROMPT_STORM_SCROLL_END_VH\s*=\s*([\d.]+)/);
const promptExitMatch = story.match(/\.to\(promptPills,\s*\{[\s\S]*?stagger:\s*\{\s*each:\s*0\.008,\s*from:\s*"edges"\s*\},\s*\}\s*,\s*([\d.]+)\s*\)/);
const minHeightMatch = css.match(/\.highlights-stack--tars\s+\.tars-prompt-storm\s*\{[\s\S]*?min-height:\s*(\d+)dvh;/);
const mobileMinHeightMatch = css.match(/@media\s*\(max-width:\s*760px\)\s*\{[\s\S]*?\.highlights-stack--tars\s+\.tars-prompt-storm\s*\{[\s\S]*?min-height:\s*(\d+)dvh;/);

const scrollStart = startMatch ? Number(startMatch[1]) : NaN;
const scrollEnd = endMatch ? Number(endMatch[1]) : NaN;
const promptExit = promptExitMatch ? Number(promptExitMatch[1]) : NaN;
const minHeight = minHeightMatch ? Number(minHeightMatch[1]) : NaN;
const mobileMinHeight = mobileMinHeightMatch ? Number(mobileMinHeightMatch[1]) : NaN;

if (!Number.isFinite(scrollStart) || scrollStart < 0.9 || scrollStart > 0.98) {
  violations.push("ProductStoryStack.jsx: prompt storm should start shortly after the section enters the viewport");
}

if (!Number.isFinite(scrollEnd) || scrollEnd < 0.08 || scrollEnd > 0.16) {
  violations.push("ProductStoryStack.jsx: prompt storm scroll end should leave minimal dead zone before Agentic");
}

if (!Number.isFinite(promptExit) || promptExit < 0.86 || promptExit > 0.92) {
  violations.push("ProductStoryStack.jsx: prompts should exit late enough to finish close to Agentic");
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

if (!/\.tars-prompt-storm__prompt\s*\{[\s\S]*?backface-visibility:\s*hidden;/.test(css)) {
  violations.push("FeaturedProjectsStory.css: prompt pills should render as intact 3D chips");
}

if (!/transform-origin:\s*center\s+center;/.test(stageBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt storm stage must transform from center center");
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

if (headlineSetBlocks.length === 0 || headlineSetBlocks.some((block) => !/transformOrigin:\s*"center center"/.test(block))) {
  violations.push("ProductStoryStack.jsx: headline GSAP set calls must pin transformOrigin to center center");
}

if (!/gsap\.set\(prompts,\s*\{\s*opacity:\s*1,\s*transformOrigin:\s*"center center"\s*\}\);/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt anchors must stay transform-clean after CSS center anchoring");
}

if (!/gsap\.set\(promptPills,\s*\{[\s\S]*?x:\s*\(index\)[\s\S]*?y:\s*\(index\)\s*=>\s*-220[\s\S]*?transformOrigin:\s*"center center"/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt pill animation must happen inside centered prompt anchors");
}

if (/left:\s*(?:0|0px|0%);|top:\s*(?:0|0px|0%);/.test(promptBlock)) {
  violations.push("FeaturedProjectsStory.css: prompt anchors must not use top-left 0/0 origin defaults");
}

if (/left:\s*(?:0|0px|0%);|top:\s*(?:0|0px|0%);/.test(headlineAnchorBlock)) {
  violations.push("FeaturedProjectsStory.css: headline anchor must not use top-left 0/0 origin defaults");
}

if (violations.length > 0) {
  console.error("TARS prompt storm sanity check failed:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log("TARS prompt storm sanity check passed.");
