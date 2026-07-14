# 轻量循环绽放背景花朵实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 将主页现有卡顿且方向不自然的三层 24 片 3D 花朵，替换为居中、半透明、16 片、循环绽放的轻量背景花，并在首轮绽放后通过鼠标移动停止循环、保持盛开。

**架构：** `index.html` 只负责两圈 16 片花瓣和左右错位的信息岛；`assets/styles.css` 仅以 `transform` 与 `opacity` 驱动 8 秒循环动画；`assets/site.js` 在首轮 1.6 秒结束后注册一次性鼠标监听，并通过根节点 `data-flower-static` 状态让 CSS 固定在盛开状态。现有语言、深浅色主题和静态站点构建方式保持不变。

**技术栈：** 原生 HTML、CSS 动画、原生 JavaScript、Node.js `node:test`、GitHub Pages。

## 全局约束

- DOM 中必须恰好有 16 个 `.flower-petal`，分为外圈 8 片和内圈 8 片。
- 花朵居中并覆盖约 80% 首屏，以近正面的约 8° 倾角呈现。
- 动画周期固定为 8 秒，首轮约 1.6 秒完成绽放，随后保持、收拢并循环。
- 首轮绽放结束后，精细指针设备的第一次 `pointermove` 必须停止循环并保持完全盛开。
- 花朵不得使用 `backdrop-filter`、CSS `filter: blur()`、持续 `will-change`、连续漂浮或 `translateZ()` 动画。
- `prefers-reduced-motion: reduce` 下直接显示静态盛开状态，不注册鼠标监听。
- 主页重点工具只显示 `Python · Codex · Claude Code`；Stata 仍保留在详细能力区。
- 保留中英文切换、深浅色切换、GitHub 超链接及手机端单列布局。

---

### 任务 1：用测试锁定轻量花朵、信息布局和性能边界

**文件：**
- 修改：`tests/portfolio.test.mjs`
- 测试：`tests/portfolio.test.mjs`

**接口：**
- 输入：从 `index.html`、`assets/styles.css`、`assets/site.js` 读取的字符串。
- 输出：对 16 片花瓣、两圈结构、主页工具、动画和静态状态选择器的自动化约束。

- [ ] **步骤 1：删除旧三圈重型花朵断言，并写入新的失败测试**

```js
test('renders exactly sixteen lightweight petals in two rings', () => {
  assert.equal((page.match(/class="flower-petal"/g) ?? []).length, 16);
  assert.match(page, /class="petal-ring petal-ring-outer"/);
  assert.match(page, /class="petal-ring petal-ring-inner"/);
  assert.doesNotMatch(page, /petal-ring-middle/);
  assert.match(page, /Python · Codex · Claude Code/);
  assert.doesNotMatch(page, /Python · Stata/);
  assert.match(styles, /@keyframes petal-bloom-cycle/);
  assert.match(styles, /rotateX\(8deg\)/);
});

test('keeps the flower compositor-friendly and supports a static open state', () => {
  const flowerCss = styles.slice(styles.indexOf('/* Lightweight repeating background flower */'));
  assert.doesNotMatch(flowerCss, /backdrop-filter|filter:\s*blur|will-change|flower-float|translateZ\(/);
  assert.match(flowerCss, /data-flower-static="true"/);
  assert.match(flowerCss, /prefers-reduced-motion: reduce/);
});

test('arms one passive pointer stop after the first bloom', () => {
  assert.match(script, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
  assert.match(script, /matchMedia\('\(pointer: fine\)'\)/);
  assert.match(script, /setTimeout\([\s\S]*1600/);
  assert.match(script, /pointermove/);
  assert.match(script, /once:\s*true/);
  assert.match(script, /passive:\s*true/);
  assert.match(script, /flowerStatic\s*=\s*'true'/);
});
```

- [ ] **步骤 2：运行测试，确认它因现有 24 片、三圈和旧动画而失败**

运行：`npm test`

预期：新增的三个测试失败，错误包含花瓣数量不等于 16、存在 `petal-ring-middle` 或找不到 `petal-bloom-cycle`。

- [ ] **步骤 3：提交测试约束**

```powershell
git add tests/portfolio.test.mjs
git commit -m "test: define lightweight background flower behavior"
```

---

### 任务 2：重构主页信息与 16 片背景花朵

**文件：**
- 修改：`index.html`
- 修改：`assets/styles.css`
- 测试：`tests/portfolio.test.mjs`

**接口：**
- 消费：任务 1 对 DOM 数量、类名、性能属性和主页工具文案的断言。
- 产出：`.hero-copy` 左上信息岛、`.hero-summary` 右下信息岛、两圈 16 片 `.flower-petal`、8 秒 `petal-bloom-cycle`。

- [ ] **步骤 1：将主页内容拆成两个信息岛并精简重点工具**

`index.html` 的首屏保留姓名、方向和简介在 `.hero-copy`，将教育、CFA、工具和 GitHub 链接移入 `.hero-summary`；工具文案写成：

```html
<span>Python · Codex · Claude Code</span>
```

- [ ] **步骤 2：将花朵 DOM 替换为两圈各 8 片**

```html
<div class="petal-ring petal-ring-outer">
  <span class="flower-petal" style="--angle:0deg;--delay:0ms"></span>
  <span class="flower-petal" style="--angle:45deg;--delay:55ms"></span>
  <span class="flower-petal" style="--angle:90deg;--delay:110ms"></span>
  <span class="flower-petal" style="--angle:135deg;--delay:165ms"></span>
  <span class="flower-petal" style="--angle:180deg;--delay:220ms"></span>
  <span class="flower-petal" style="--angle:225deg;--delay:275ms"></span>
  <span class="flower-petal" style="--angle:270deg;--delay:330ms"></span>
  <span class="flower-petal" style="--angle:315deg;--delay:385ms"></span>
</div>
<div class="petal-ring petal-ring-inner">
  <span class="flower-petal" style="--angle:22.5deg;--delay:180ms"></span>
  <span class="flower-petal" style="--angle:67.5deg;--delay:225ms"></span>
  <span class="flower-petal" style="--angle:112.5deg;--delay:270ms"></span>
  <span class="flower-petal" style="--angle:157.5deg;--delay:315ms"></span>
  <span class="flower-petal" style="--angle:202.5deg;--delay:360ms"></span>
  <span class="flower-petal" style="--angle:247.5deg;--delay:405ms"></span>
  <span class="flower-petal" style="--angle:292.5deg;--delay:450ms"></span>
  <span class="flower-petal" style="--angle:337.5deg;--delay:495ms"></span>
</div>
```

- [ ] **步骤 3：删除旧重型花朵规则并写入轻量动画**

新规则以 `.hero-flower-stage` 居中，`.flower-orbit` 使用 `rotateX(8deg) rotateZ(-4deg)`；两圈花瓣只使用半透明渐变、细边框和轻量内阴影。动画使用以下状态，不加入模糊、3D 位移或持续漂浮：

```css
@keyframes petal-bloom-cycle {
  0%, 100% { opacity:.08; transform:rotate(var(--angle)) translateY(-24%) scale(.32,.58); }
  20%, 76% { opacity:.58; transform:rotate(var(--angle)) translateY(-46%) scale(1); }
  92% { opacity:.12; transform:rotate(var(--angle)) translateY(-28%) scale(.4,.62); }
}

html[data-flower-static="true"] .flower-petal,
html[data-flower-static="true"] .flower-heart {
  animation:none;
}

html[data-flower-static="true"] .flower-petal {
  opacity:.58;
  transform:rotate(var(--angle)) translateY(-46%) scale(1);
}
```

- [ ] **步骤 4：补齐桌面和手机布局**

桌面端 `.hero-copy` 固定在左上视觉区域，`.hero-summary` 固定在右下空白区域；手机端恢复单列文档流、花朵降低透明度并保持居中，不遮挡按钮或导航。

- [ ] **步骤 5：运行测试并确认主页结构与动画通过**

运行：`npm test`

预期：花瓣数量、两圈结构、主页工具文案和性能边界测试通过；鼠标停止逻辑测试仍失败。

- [ ] **步骤 6：提交主页与花朵视觉改造**

```powershell
git add index.html assets/styles.css
git commit -m "feat: add lightweight repeating background flower"
```

---

### 任务 3：实现首轮后鼠标停止与无障碍降级

**文件：**
- 修改：`assets/site.js`
- 测试：`tests/portfolio.test.mjs`

**接口：**
- 消费：`.hero-flower-stage`、根节点和 CSS 的 `data-flower-static="true"` 选择器。
- 产出：`initFlowerMotion()`；无返回值，在符合条件时设置 `document.documentElement.dataset.flowerStatic = 'true'`。

- [ ] **步骤 1：在现有语言和主题初始化之后加入花朵交互函数**

```js
function initFlowerMotion() {
  const flower = document.querySelector('.hero-flower-stage');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  if (!flower || reducedMotion) {
    if (flower) root.dataset.flowerStatic = 'true';
    return;
  }

  if (!finePointer) return;

  window.setTimeout(() => {
    window.addEventListener('pointermove', () => {
      root.dataset.flowerStatic = 'true';
    }, { once: true, passive: true });
  }, 1600);
}

initFlowerMotion();
```

- [ ] **步骤 2：运行完整测试，确认全部通过**

运行：`npm test`

预期：所有测试通过，无失败和跳过。

- [ ] **步骤 3：提交交互逻辑**

```powershell
git add assets/site.js tests/portfolio.test.mjs
git commit -m "feat: pause flower cycle after pointer movement"
```

---

### 任务 4：构建、目视验证并发布

**文件：**
- 验证：`index.html`
- 验证：`assets/styles.css`
- 验证：`assets/site.js`
- 生成：`dist/client/index.html`
- 生成：`dist/client/assets/styles.css`
- 生成：`dist/client/assets/site.js`

**接口：**
- 消费：前三项任务的静态站点源文件。
- 产出：可由 GitHub Pages 部署的构建结果和推送到 `main` 的发布提交。

- [ ] **步骤 1：执行完整测试与静态构建**

运行：`npm test`

预期：全部测试通过，`dist/client` 成功生成。

运行：`npm run build`

预期：命令退出码为 0。

- [ ] **步骤 2：检查变更范围和空白错误**

运行：`git diff --check`

预期：无输出。

运行：`git status --short`

预期：只出现本次任务涉及的源文件或构建过程中已被忽略的 `dist` 文件。

- [ ] **步骤 3：在本地浏览器目视检查桌面和手机宽度**

确认：花朵位于正中、方向近正面、透明度不妨碍文字；姓名和简介在左上，资质与 GitHub 在右下；首轮自然绽放，首轮后鼠标移动会固定盛开；深浅色和中英文按钮正常；手机端不横向溢出。

- [ ] **步骤 4：推送 `main` 到 GitHub 并验证公开页面**

运行：`git push origin main`

预期：远端 `main` 更新成功，GitHub Pages 部署完成后公开页面返回新版 16 片花朵结构。
