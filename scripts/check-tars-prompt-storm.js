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
const transitionStormStart = story.indexOf("function TarsTransitionStorm()");
const transitionStormEnd = story.indexOf("function TarsScrollSections", transitionStormStart);
const transitionStorm = transitionStormStart >= 0 && transitionStormEnd > transitionStormStart
  ? story.slice(transitionStormStart, transitionStormEnd)
  : "";

if (!/<section\s+className="tars-prompt-storm is-initializing"/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt storm should render hidden until centered setup is applied");
}

if (/centerOffsetFor|promptOffsetFor|const\s+rect\s*=\s*element\.getBoundingClientRect\(\)|stage\.getBoundingClientRect\(\)/.test(transitionStorm)) {
  violations.push("ProductStoryStack.jsx: prompt storm should not measure current child rects that can encode top-left defaults");
}

if (!/const promptTargetFor = \(element\) => \(\{[\s\S]*?--prompt-target-x[\s\S]*?--prompt-target-y[\s\S]*?\}\);/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt targets should come from deterministic center-relative CSS vars");
}

if (!/gsap\.set\(prompts,\s*\{[\s\S]*?opacity:\s*0,[\s\S]*?xPercent:\s*-50,[\s\S]*?yPercent:\s*-50,[\s\S]*?x:\s*0,[\s\S]*?y:\s*0,[\s\S]*?z:\s*\(index\)\s*=>\s*520/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt entry should start hidden at the stage center with positive z");
}

if (!/\.to\(prompts,\s*\{[\s\S]*?opacity:\s*\(index\)[\s\S]*?x:\s*\(_index,\s*element\)\s*=>\s*promptTargetFor\(element\)\.x[\s\S]*?y:\s*\(_index,\s*element\)\s*=>\s*promptTargetFor\(element\)\.y[\s\S]*?z:\s*0[\s\S]*?duration:\s*0\.24/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt visible positions should animate out from center to stage-relative targets");
}

if (!/\.to\(prompts,\s*\{[\s\S]*?opacity:\s*0,[\s\S]*?x:\s*0,[\s\S]*?y:\s*0,[\s\S]*?z:\s*\(index\)\s*=>\s*-460[\s\S]*?scale:\s*\(index\)\s*=>\s*0\.36/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt exit should collapse through center and away on negative z");
}

if (!/"--prompt-target-x":\s*`\$\{x - 50\}vw`[\s\S]*?"--prompt-target-y":\s*`\$\{y - 50\}vh`/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt inline styles should define center-relative vw/vh targets");
}

if (!/const start = viewportHeight \* 0\.66;[\s\S]*?const end = -rect\.height \+ viewportHeight \* 0\.54;/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt storm scroll range should be short and decisive");
}

if (!/gsap\.set\(headline,\s*\{\s*opacity:\s*0,\s*y:\s*0[\s\S]*?\}\);/.test(story) || !/\.to\(headline,\s*\{\s*opacity:\s*0,\s*y:\s*0/.test(story)) {
  violations.push("ProductStoryStack.jsx: headline should enter and exit from centered y=0 state");
}

if (!/\.tars-prompt-storm\s*\{[\s\S]*?opacity:\s*0;[\s\S]*?\}[\s\S]*?\.tars-prompt-storm\.is-ready\s*\{[\s\S]*?opacity:\s*1;/.test(css)) {
  violations.push("FeaturedProjectsStory.css: prompt storm should stay hidden until JS marks centered setup ready");
}

if (!/\.tars-prompt-storm__prompt\s*\{[\s\S]*?left:\s*50%;[\s\S]*?top:\s*50%;[\s\S]*?--prompt-target-x:\s*0vw;[\s\S]*?--prompt-target-y:\s*0vh;[\s\S]*?opacity:\s*0;[\s\S]*?transform:\s*translate3d\(-50%,\s*-50%,\s*0\)\s+translate3d\(0,\s*0,\s*0\)/.test(css)) {
  violations.push("FeaturedProjectsStory.css: prompt pills need centered hidden CSS defaults, not top-left defaults");
}

const promptBlocks = (css.match(/\.highlights-stack--tars\s+\.tars-prompt-storm__prompt\s*\{[^}]*\}/g) ?? [])
  .filter((block) => /--prompt-target-x/.test(block));
for (const block of promptBlocks) {
  if (/(?:left:\s*0;|top:\s*0;|opacity:\s*1;)/.test(block)) {
    violations.push("FeaturedProjectsStory.css: prompt pills must not have top-left or visible defaults");
    break;
  }
}

if (/gsap\.fromTo\(prompts|gsap\.fromTo\(headline|gsap\.fromTo\(stage/.test(story)) {
  violations.push("ProductStoryStack.jsx: prompt storm should avoid fromTo origins that can flash viewport/page origin");
}

if (!/\.tars-prompt-storm\s*\{[\s\S]*?min-height:\s*138dvh;/.test(css)) {
  violations.push("FeaturedProjectsStory.css: prompt storm should use a faster short scroll section");
}

if (!/\.tars-prompt-storm__headline\s*\{[\s\S]*?opacity:\s*0;/.test(css)) {
  violations.push("FeaturedProjectsStory.css: headline should be hidden before centered JS setup");
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
