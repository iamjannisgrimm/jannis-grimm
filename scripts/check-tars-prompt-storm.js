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

if (!/gsap\.set\(prompts,\s*\{[\s\S]*?x:\s*\(_index,\s*element\)\s*=>\s*centerOffsetFor\(element\)\.x[\s\S]*?y:\s*\(_index,\s*element\)\s*=>\s*centerOffsetFor\(element\)\.y[\s\S]*?z:\s*\(index\)\s*=>\s*360[\s\S]*?scale:\s*\(index\)\s*=>\s*1\.46/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt entry should originate at stage center from positive z/foreground scale");
}

if (!/\.to\(prompts,\s*\{[\s\S]*?x:\s*\(_index,\s*element\)\s*=>\s*centerOffsetFor\(element\)\.x[\s\S]*?y:\s*\(_index,\s*element\)\s*=>\s*centerOffsetFor\(element\)\.y\s*\+\s*140[\s\S]*?z:\s*\(index\)\s*=>\s*-360[\s\S]*?scale:\s*\(index\)\s*=>\s*0\.44/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt exit should collapse through center and away on negative z");
}

if (!/\.tars-prompt-storm__prompt\s*\{[\s\S]*?transform-origin:\s*center center;/.test(css)) {
  violations.push("FeaturedProjectsStory.css: prompt pills should transform from their center");
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
