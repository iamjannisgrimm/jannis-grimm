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

if (!/gsap\.set\(prompts,\s*\{[\s\S]*?y:\s*\(index\)\s*=>\s*-220[\s\S]*?z:\s*\(index\)\s*=>\s*360[\s\S]*?scale:\s*\(index\)\s*=>\s*1\.46/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt entry should start above the field from positive z/foreground scale");
}

if (!/\.to\(prompts,\s*\{[\s\S]*?y:\s*\(index\)\s*=>\s*220[\s\S]*?z:\s*\(index\)\s*=>\s*-360[\s\S]*?scale:\s*\(index\)\s*=>\s*0\.44/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt exit should keep falling down and away on negative z");
}

const startMatch = story.match(/TARS_PROMPT_STORM_SCROLL_START_VH\s*=\s*([\d.]+)/);
const endMatch = story.match(/TARS_PROMPT_STORM_SCROLL_END_VH\s*=\s*([\d.]+)/);
const promptExitMatch = story.match(/\.to\(prompts,\s*\{[\s\S]*?stagger:\s*\{\s*each:\s*0\.008,\s*from:\s*"edges"\s*\},\s*\}\s*,\s*([\d.]+)\s*\)/);
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

if (violations.length > 0) {
  console.error("TARS prompt storm sanity check failed:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log("TARS prompt storm sanity check passed.");
