# Jimmy Wu 个人简历网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** 构建并发布 Jimmy Wu 的一页式个人简历网站，突出金融研究、量化分析和投行经历。

**Architecture:** 以原生 HTML、CSS 和少量 JavaScript 构成无依赖静态单页。内容在语义化分区中固定呈现，样式处理浅色响应式排版，Node 内置测试检验内容、链接与隐私限制。

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner, OpenAI Sites.

## Global Constraints

- 白色与浅灰基底、深色文字、低饱和蓝色强调；不使用照片或高饱和装饰。
- 源文件与页面内容不得包含 \`19550128365\`。
- 仅展示 \`961360749@qq.com\`；GitHub 入口标签为“访问 GitHub”，链接为 \`https://github.com/wuhangyu766-blip\`，不得把网址作为可见文本。
- 只呈现两项代表项目和三段精选实习；不得虚构未被简历证实的数据。
- 窄屏无横向溢出，外部链接使用 \`target="_blank" rel="noreferrer"\`。

---

## File Structure

- \`index.html\` - 语义结构和已确认的中文简历内容。
- \`assets/styles.css\` - 视觉系统、响应式和交互状态。
- \`assets/site.js\` - 页脚年份。
- \`tests/portfolio.test.mjs\` - 内容、隐私、链接和适配测试。
- \`package.json\` - 无依赖测试脚本。
- \`.openai/hosting.json\` - Sites 项目 ID 与部署配置。

### Task 1: 建立可测试的内容骨架

**Files:**
- Create: \`package.json\`
- Create: \`tests/portfolio.test.mjs\`
- Create: \`index.html\`

**Interfaces:**
- Produces: 具备 \`#projects\`、\`#experience\`、\`#skills\`、\`#contact\` 分区的页面；以 \`node --test tests/portfolio.test.mjs\` 验证。

- [ ] **Step 1: Write the failing test**

\`\`\`js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('includes approved identity and contact links', () => {
  assert.match(page, /Jimmy Wu/);
  assert.match(page, /吴航宇/);
  assert.match(page, /mailto:961360749@qq\.com/);
  assert.match(page, /https:\/\/github\.com\/wuhangyu766-blip/);
});

test('includes required sections and excludes phone number', () => {
  for (const id of ['projects', 'experience', 'skills', 'contact']) assert.match(page, new RegExp(\`id="\${id}"\`));
  assert.doesNotMatch(page, /19550128365/);
});
\`\`\`

- [ ] **Step 2: Verify RED**

Run: \`node --test tests/portfolio.test.mjs\`  
Expected: FAIL with \`ENOENT\` because \`index.html\` is absent.

- [ ] **Step 3: Write minimal implementation**

Create \`index.html\` with a viewport meta tag, navigation, and the four exact section IDs. Include the confirmed identity, two project headings “浙江省证券投资大赛” / “国家级创新创业项目”, three experience headings “弈宸基金” / “东方证券承销保荐公司” / “华睿投资”, the approved skills, a \`mailto:961360749@qq.com\` link and the approved GitHub link. Create \`package.json\`:

\`\`\`json
{
  "private": true,
  "scripts": { "test": "node --test tests/portfolio.test.mjs" }
}
\`\`\`

- [ ] **Step 4: Verify GREEN**

Run: \`node --test tests/portfolio.test.mjs\`  
Expected: PASS with 2 passing tests.

- [ ] **Step 5: Commit**

\`\`\`bash
git add package.json tests/portfolio.test.mjs index.html
git commit -m "feat: add tested portfolio content skeleton"
\`\`\`

### Task 2: 实现响应式视觉与交互

**Files:**
- Create: \`assets/styles.css\`
- Create: \`assets/site.js\`
- Modify: \`index.html\`
- Modify: \`tests/portfolio.test.mjs\`

**Interfaces:**
- Consumes: Task 1 的四个分区 ID。
- Produces: 由 \`assets/styles.css\` 提供的窄屏布局，以及由 \`assets/site.js\` 更新的页脚年份。

- [ ] **Step 1: Write the failing test**

\`\`\`js
test('loads responsive styles and has a safe GitHub link', async () => {
  const styles = await readFile(new URL('../assets/styles.css', import.meta.url), 'utf8');
  assert.match(page, /assets\/styles\.css/);
  assert.match(styles, /@media \(max-width: 700px\)/);
  assert.match(page, /target="_blank" rel="noreferrer"/);
});
\`\`\`

- [ ] **Step 2: Verify RED**

Run: \`node --test tests/portfolio.test.mjs\`  
Expected: FAIL with \`ENOENT\` for \`assets/styles.css\`.

- [ ] **Step 3: Write minimal implementation**

Create \`assets/styles.css\` using \`--surface: #ffffff\`, \`--surface-muted: #f4f6f8\`, \`--ink: #172033\`, and \`--accent: #336b9a\`; add a centered \`max-width: 1120px\` content area, card grid, keyboard focus state, and \`@media (max-width: 700px)\` single-column layout. Create \`assets/site.js\` to put \`new Date().getFullYear()\` into \`[data-current-year]\`. Reference both files from \`index.html\`, include accessible anchor navigation and a footer year span.

- [ ] **Step 4: Verify GREEN**

Run: \`node --test tests/portfolio.test.mjs\`  
Expected: PASS with 3 passing tests.

- [ ] **Step 5: Commit**

\`\`\`bash
git add assets/styles.css assets/site.js index.html tests/portfolio.test.mjs
git commit -m "feat: style responsive resume portfolio"
\`\`\`

### Task 3: Visual QA and Sites deployment

**Files:**
- Create: \`.openai/hosting.json\`
- Modify: \`index.html\`, \`assets/styles.css\`, or tests only when QA finds an actual defect.

**Interfaces:**
- Consumes: tested static source from Tasks 1-2.
- Produces: pushed source commit, saved Sites version, and production URL.

- [ ] **Step 1: Write the failing deployment-readiness test**

\`\`\`js
test('has a responsive viewport and only HTTPS external URLs', () => {
  assert.match(page, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  for (const url of page.match(/https?:\/\/[^"']+/g) ?? []) assert.match(url, /^https:\/\//);
});
\`\`\`

- [ ] **Step 2: Verify RED**

Run: \`node --test tests/portfolio.test.mjs\`  
Expected: FAIL if the exact viewport tag is absent.

- [ ] **Step 3: Implement and verify GREEN**

Add the exact viewport tag. Run \`node --test tests/portfolio.test.mjs\`; expected: 4 passing tests. Serve the page locally and inspect desktop and 390 px wide browser renders. Correct only observed clipping, overlap, contrast, or horizontal-overflow defects and rerun the full test suite.

- [ ] **Step 4: Push and deploy**

Read \`.openai/hosting.json\`. If \`project_id\` is absent, create one Sites project and immediately persist the exact returned ID. Create a source-repository credential, commit the verified source state, and push it using that credential only for the push command. Save a version with the pushed commit SHA. Use private deployment only if owner-only access is verified; otherwise ask approval before shared/public deployment. Poll a non-terminal deployment to completion.

- [ ] **Step 5: Commit**

\`\`\`bash
git add .openai/hosting.json index.html assets/styles.css tests/portfolio.test.mjs
git commit -m "chore: configure portfolio site hosting"
\`\`\`
