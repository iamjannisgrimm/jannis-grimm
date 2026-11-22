import"./modulepreload-polyfill-B5Qt9EMX.js";const u=(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1","https://dashboard.iamjannisgrimm.com/api/content?key=privacy_policy"),d=`# Privacy Policy

This website is a personal portfolio for Jannis Grimm. It uses limited visit analytics to understand traffic, maintain the site, and review overall audience activity.

## Information Collected

- IP address
- Approximate location inferred from the request, such as country, region, or city
- Pages visited
- Referrer information
- Browser and device metadata such as user agent
- Timestamps of visits

## How This Information Is Used

- measure overall portfolio traffic
- understand where visitors are coming from
- identify repeat visits and general audience patterns
- support site operations, maintenance, and security review

## Sharing

Visit data is stored using Supabase and may be processed through hosting or infrastructure providers used to operate the site. It is not sold.

## Retention

Visit data may be retained for as long as reasonably useful for analytics, operational review, and record keeping, unless a shorter retention period is required.

## Contact

If you have privacy questions about this website, you can reach out through the contact methods listed on the portfolio.`;function h(i){return i.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function c(i){return h(i).replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')}function p(i){const a=i.split(/\r?\n/),n=[];let o=[],r=[];function t(){o.length&&(n.push(`<div class="markdown-card"><ul>${o.map(l=>`<li>${c(l)}</li>`).join("")}</ul></div>`),o=[])}function s(){r.length&&(n.push(`<div class="markdown-card"><p>${c(r.join(" "))}</p></div>`),r=[])}for(const l of a){const e=l.trim();if(!e){t(),s();continue}if(e.startsWith("## ")){t(),s(),n.push(`<div class="markdown-card"><h2>${c(e.slice(3))}</h2></div>`);continue}if(e.startsWith("### ")){t(),s(),n.push(`<div class="markdown-card"><h3>${c(e.slice(4))}</h3></div>`);continue}if(e.startsWith("- ")){s(),o.push(e.slice(2));continue}e.startsWith("# ")||r.push(e)}return t(),s(),n.join("")}async function f(){const i=document.getElementById("policy-title"),a=document.querySelector(".lede"),n=document.getElementById("policy-content"),o=document.getElementById("policy-updated");try{const r=await fetch(u);if(!r.ok)throw new Error("Failed to load policy.");const t=await r.json(),s=typeof(t==null?void 0:t.body)=="string"&&t.body?t.body:d;i.textContent=typeof(t==null?void 0:t.title)=="string"&&t.title?t.title:"Privacy Policy",a.textContent="This policy reflects the current privacy settings for this website.",n.innerHTML=p(s),o.textContent=t!=null&&t.updatedAt?`Last updated: ${new Date(t.updatedAt).toLocaleDateString()}`:"Last updated: April 8, 2026"}catch{i.textContent="Privacy Policy",a.textContent="This policy reflects the current privacy settings for this website.",n.innerHTML=p(d),o.textContent="Last updated: April 8, 2026"}}f();
