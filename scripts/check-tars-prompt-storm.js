import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const storyPath = "src/components/featured/ProductStoryStack.jsx";
const cssPath = "src/components/featured/FeaturedProjectsStory.css";
const story = readFileSync(resolve(root, storyPath), "utf8");
const css = readFileSync(resolve(root, cssPath), "utf8");

const violations = [];
const blockFor = (source, selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return source.match(new RegExp(`${escaped}\\s*\\{[\\s\\S]*?\\n\\}`, "m"))?.[0] ?? "";
};

const transitionStormStart = story.indexOf("function TarsTransitionStorm()");
const transitionStormEnd = story.indexOf("function TarsScrollSections", transitionStormStart);
const transitionStorm = transitionStormStart >= 0 && transitionStormEnd > transitionStormStart
  ? story.slice(transitionStormStart, transitionStormEnd)
  : "";

if (!transitionStorm) {
  violations.push(`${storyPath}: missing TarsTransitionStorm implementation`);
}

for (const [file, content] of [[storyPath, story], [cssPath, css]]) {
  if (/prompt-float|tarsPromptStormFloat/.test(content)) {
    violations.push(`${file}: found legacy prompt float animation tokens`);
  }
}

if (!/<section\s+className="tars-prompt-storm"/.test(transitionStorm)) {
  violations.push(`${storyPath}: storm should render as a plain deterministic section, without hidden-ready classes`);
}

if (/is-initializing|is-ready/.test(transitionStorm)) {
  violations.push(`${storyPath}: storm should not depend on hidden-ready initialization states`);
}

if (/centerOffsetFor|promptOffsetFor|element\.getBoundingClientRect\(\)|stage\.getBoundingClientRect\(\)/.test(transitionStorm)) {
  violations.push(`${storyPath}: prompt storm should not measure child/stage rects for animation origins`);
}

if (!/const\s+promptVarsFor\s*=\s*\(element\)\s*=>\s*\(\{[\s\S]*--prompt-target-x[\s\S]*--prompt-target-y[\s\S]*--prompt-entry-x[\s\S]*--prompt-entry-y[\s\S]*\}\);/.test(transitionStorm)) {
  violations.push(`${storyPath}: prompt positions should come from deterministic CSS variables`);
}

if (!/"--prompt-target-x":\s*`\$\{x - 50\}vw`[\s\S]*"--prompt-target-y":\s*`\$\{y - 50\}vh`[\s\S]*"--prompt-entry-x"[\s\S]*"--prompt-entry-y"/.test(transitionStorm)) {
  violations.push(`${storyPath}: inline prompt variables must include center-relative target and above-screen entry positions`);
}

if (!/gsap\.set\(prompts,\s*\{[\s\S]*opacity:\s*0,[\s\S]*xPercent:\s*-50,[\s\S]*yPercent:\s*-50,[\s\S]*entryX[\s\S]*entryY[\s\S]*z:\s*\(index\)\s*=>\s*680/.test(transitionStorm)) {
  violations.push(`${storyPath}: prompt entry should start hidden, centered as whole chips, above/front in positive z`);
}

if (!/\.to\(prompts,\s*\{[\s\S]*x:\s*\(_index,\s*element\)\s*=>\s*promptVarsFor\(element\)\.x[\s\S]*y:\s*\(_index,\s*element\)\s*=>\s*promptVarsFor\(element\)\.y[\s\S]*duration:\s*0\.24/.test(transitionStorm)) {
  violations.push(`${storyPath}: prompt rain should animate quickly into deterministic stage targets`);
}

if (!/\.to\(prompts,\s*\{\s*opacity:[\s\S]*duration:\s*0\.42\s*\},\s*0\.34\)/.test(transitionStorm)) {
  violations.push(`${storyPath}: prompt storm should hold enough visible chips through the middle of the scene`);
}

if (!/\.to\(prompts,\s*\{[\s\S]*z:\s*\(index\)\s*=>\s*-260[\s\S]*filter:\s*"blur\(15px\)"[\s\S]*\},\s*0\.76\)[\s\S]*\.to\(prompts,\s*\{[\s\S]*opacity:\s*0,[\s\S]*z:\s*\(index\)\s*=>\s*-620[\s\S]*scale:\s*\(index\)\s*=>\s*0\.22/.test(transitionStorm)) {
  violations.push(`${storyPath}: prompt exit should fade/shrink/blur into negative-z back depth`);
}

if (/gsap\.fromTo\(prompts|gsap\.fromTo\(headline|gsap\.fromTo\(stage/.test(transitionStorm)) {
  violations.push(`${storyPath}: prompt storm should avoid fromTo origins that can flash from page/viewport origin`);
}

if (!/const sceneDistance = Math\.max\(rect\.height - viewportHeight, viewportHeight \* 0\.88\);[\s\S]*const progress = gsap\.utils\.clamp\(0, 1, -rect\.top \/ sceneDistance\);/.test(transitionStorm)) {
  violations.push(`${storyPath}: scroll progress should map across the fullscreen section distance`);
}

if (!/const stickY = gsap\.utils\.clamp\(0, Math\.max\(0, rect\.height - viewportHeight\), -rect\.top\);[\s\S]*--storm-stick-y/.test(transitionStorm)) {
  violations.push(`${storyPath}: storm stage should have deterministic JS sticky fallback for nested scroll containers`);
}

const sectionBlock = blockFor(css, ".highlights-stack--tars .tars-prompt-storm");
if (!/min-height:\s*205dvh;[\s\S]*min-height:\s*205svh;[\s\S]*display:\s*block;/.test(sectionBlock)) {
  violations.push(`${cssPath}: prompt storm section should be a full-screen block scroll moment with enough scene height`);
}
if (/opacity:\s*0;/.test(sectionBlock)) {
  violations.push(`${cssPath}: prompt storm section must not hide itself before JS`);
}

const stageBlock = blockFor(css, ".highlights-stack--tars .tars-prompt-storm__stage");
if (!/position:\s*sticky;[\s\S]*top:\s*0;[\s\S]*transform:\s*translate3d\(0, var\(--storm-stick-y, 0px\), 0\);[\s\S]*width:\s*100vw;[\s\S]*height:\s*100dvh;[\s\S]*display:\s*grid;[\s\S]*place-items:\s*center;/.test(stageBlock)) {
  violations.push(`${cssPath}: sticky stage should occupy and center the full viewport`);
}
if (!/perspective:\s*1320px;[\s\S]*perspective-origin:\s*50%\s+38%;/.test(stageBlock)) {
  violations.push(`${cssPath}: stage needs a foreground rain perspective origin`);
}
if (/position:\s*fixed;/.test(stageBlock)) {
  violations.push(`${cssPath}: prompt storm stage should be section-scoped sticky, not fixed`);
}

const promptBlock = blockFor(css, ".highlights-stack--tars .tars-prompt-storm__prompt");
if (!/left:\s*50%;[\s\S]*top:\s*50%;[\s\S]*--prompt-target-x:\s*0vw;[\s\S]*--prompt-target-y:\s*0vh;[\s\S]*opacity:\s*0;[\s\S]*transform:\s*translate3d\(-50%,\s*-50%,\s*0\)/.test(promptBlock)) {
  violations.push(`${cssPath}: visible chips must have centered hidden defaults, never top-left defaults`);
}
if (/left:\s*0;|top:\s*0;|opacity:\s*1;/.test(promptBlock)) {
  violations.push(`${cssPath}: prompt chip defaults must not be top-left or visible`);
}
if (!/transform-origin:\s*center center;[\s\S]*transform-style:\s*preserve-3d;[\s\S]*backface-visibility:\s*hidden;[\s\S]*contain:\s*paint;/.test(promptBlock)) {
  violations.push(`${cssPath}: prompt pills should transform/render as intact 3D chips`);
}

const headlineBlock = blockFor(css, ".highlights-stack--tars .tars-prompt-storm__headline");
if (!/z-index:\s*3;[\s\S]*text-align:\s*center;[\s\S]*opacity:\s*1;/.test(headlineBlock)) {
  violations.push(`${cssPath}: headline should be centered and readable by default`);
}

if (!/\.tars-prompt-storm__stage::after\s*\{[\s\S]*z-index:\s*1;/.test(css) || !/\.tars-prompt-storm__field\s*\{[\s\S]*z-index:\s*2;/.test(css) || !/\.tars-prompt-storm__headline\s*\{[\s\S]*z-index:\s*3;/.test(css)) {
  violations.push(`${cssPath}: field/headline/vignette layering should preserve readable center headline over rain`);
}

const visibleMiddlePrompts = [...story.matchAll(/\["[^"]+",\s*(\d+),\s*(\d+),\s*"[^"]+",\s*"[^"]+"\]/g)]
  .filter(([, rawX, rawY]) => {
    const x = Number(rawX);
    const y = Number(rawY);
    return x >= 18 && x <= 82 && y >= 18 && y <= 82;
  }).length;
if (visibleMiddlePrompts < 14) {
  violations.push(`${storyPath}: expected many readable mid-scene prompt chips, found ${visibleMiddlePrompts}`);
}

const mobileStormIndex = css.indexOf("min-height: 170dvh;");
const mobileBlock = mobileStormIndex >= 0 ? css.slice(Math.max(0, mobileStormIndex - 160), mobileStormIndex + 220) : "";
if (!/min-height:\s*170dvh;[\s\S]*min-height:\s*170svh;/.test(mobileBlock)) {
  violations.push(`${cssPath}: mobile prompt storm scene is too short for the full-screen effect`);
}

if (violations.length > 0) {
  console.error("TARS prompt storm sanity check failed:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log("TARS prompt storm sanity check passed.");
