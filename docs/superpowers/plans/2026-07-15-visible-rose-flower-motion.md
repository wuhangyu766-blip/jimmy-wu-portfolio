# 更清晰的玫瑰色花朵动画实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 提高白色主题下花朵的颜色对比度，把绽放延长到约 2.8 秒，并将鼠标交互改为“移动时暂停、静止 1.5 秒后继续”的 10 秒循环动画。

**架构：** `assets/styles.css` 负责新玫瑰色视觉、10 秒关键帧和暂停状态；`assets/site.js` 只负责在首轮 2.8 秒后维护 `data-flower-paused` 与 1.5 秒恢复计时；`tests/portfolio.test.mjs` 对颜色、时序、暂停和低动态模式建立回归约束。HTML 结构和 16 片花瓣保持不变。

**技术栈：** 原生 CSS 动画、原生 JavaScript、Node.js `node:test`、Playwright 浏览器验收、GitHub Pages。

## 全局约束

- 继续保留两圈共 16 片花瓣，不修改首页文字和信息布局。
- 每轮动画为 10 秒，所有花瓣在首次加载后约 2.8 秒内完成展开。
- 白色主题舞台透明度约 `.78`，外圈花瓣约 `.62`，内圈约 `.72`；手机舞台约 `.50`。
- 鼠标移动只暂时暂停动画，连续静止 1.5 秒后从原位置继续。
- 首轮 2.8 秒完整播放，期间不注册鼠标移动监听器。
- 触屏设备和低动态模式不注册鼠标监听器；低动态模式保持静态盛开。
- 花朵继续禁止 `backdrop-filter`、`filter: blur()`、持续 `will-change`、`translateZ()` 和连续漂浮动画。
- 不新增依赖，不改变中英文、深浅色、GitHub 链接和构建流程。

---

### 任务 1：用失败测试定义新颜色、时序和暂停行为

**文件：**
- 修改：`tests/portfolio.test.mjs`
- 测试：`tests/portfolio.test.mjs`

**接口：**
- 输入：测试文件已加载的 `styles` 与 `script` 字符串。
- 输出：对 10 秒周期、2.8 秒启用延迟、1.5 秒恢复、新透明度和 `data-flower-paused` 的回归测试。

- [ ] **步骤 1：替换旧的永久静止交互测试并加入颜色测试**

```js
test('uses a visible rose palette and a ten-second bloom cycle', () => {
  const flowerCss = styles.slice(styles.indexOf('/* Lightweight repeating background flower */'));
  assert.match(flowerCss, /hero-flower-stage[^}]+opacity:\.78/);
  assert.match(flowerCss, /petal-ring-outer[^}]+--petal-opacity:\.62/);
  assert.match(flowerCss, /petal-ring-inner[^}]+--petal-opacity:\.72/);
  assert.match(flowerCss, /169 67 111/);
  assert.match(flowerCss, /petal-bloom-cycle 10s/);
  assert.match(flowerCss, /@keyframes petal-bloom-cycle[^}]+0%,100%/);
  assert.match(flowerCss, /23%,70%/);
  assert.match(flowerCss, /max-width:700px[^}]+[\s\S]*hero-flower-stage[^}]+opacity:\.50/);
});

test('temporarily pauses after the first bloom and resumes after pointer idle', () => {
  assert.match(script, /setTimeout\([\s\S]*2800/);
  assert.match(script, /pointermove/);
  assert.match(script, /flowerPaused\s*=\s*'true'/);
  assert.match(script, /clearTimeout\(/);
  assert.match(script, /delete root\.dataset\.flowerPaused/);
  assert.match(script, /1500/);
  assert.doesNotMatch(script, /once:\s*true/);
  assert.match(styles, /data-flower-paused="true"[^}]+animation-play-state:paused/);
});
```

- [ ] **步骤 2：运行测试确认 RED**

运行：`node --test tests/portfolio.test.mjs`

预期：新增测试因现有 8 秒周期、浅色透明度、1600 毫秒延迟、永久静态状态和缺少暂停选择器而失败。

- [ ] **步骤 3：提交测试约束**

```powershell
git add tests/portfolio.test.mjs
git commit -m "test: define visible resumable flower motion"
```

---

### 任务 2：提高白色主题花朵对比度并延长循环

**文件：**
- 修改：`assets/styles.css`
- 测试：`tests/portfolio.test.mjs`

**接口：**
- 消费：任务 1 的颜色和动画时长断言。
- 产出：10 秒 `petal-bloom-cycle`、10 秒 `heart-bloom-cycle`、灰调玫瑰色花瓣和 `[data-flower-paused="true"]` 暂停状态。

- [ ] **步骤 1：更新舞台、花瓣变量与白色主题渐变**

```css
.hero-flower-stage { opacity:.78; }
.petal-ring-outer { --petal-opacity:.62; }
.petal-ring-inner { --petal-opacity:.72; }
.flower-petal {
  border-color:rgb(173 74 116 / .55);
  background:linear-gradient(118deg,rgb(255 244 247 / .14) 4%,rgb(229 144 174 / .62) 43%,rgb(169 67 111 / .38) 78%,rgb(255 255 255 / .07));
  box-shadow:inset 14px 8px 24px rgb(255 255 255 / .22),inset -12px -14px 24px rgb(104 39 73 / .16);
}
```

- [ ] **步骤 2：将花瓣与花芯动画改成 10 秒并调整关键帧**

```css
.flower-petal { animation:petal-bloom-cycle 10s var(--delay) cubic-bezier(.2,.78,.24,1) infinite; }
.flower-heart { animation:heart-bloom-cycle 10s 440ms cubic-bezier(.2,.78,.24,1) infinite; }
@keyframes petal-bloom-cycle { 0%,100% { opacity:.08; transform:rotate(var(--angle)) scale(.12,.32); } 23%,70% { opacity:var(--petal-opacity); transform:rotate(var(--angle)) scale(1); } 90% { opacity:.16; transform:rotate(var(--angle)) scale(.32,.52); } }
@keyframes heart-bloom-cycle { 0%,100% { opacity:.08; transform:translate(-50%,-50%) scale(.28); } 18%,70% { opacity:.92; transform:translate(-50%,-50%) scale(1); } 90% { opacity:.16; transform:translate(-50%,-50%) scale(.42); } }
```

- [ ] **步骤 3：加入暂停选择器并更新手机透明度**

```css
html[data-flower-paused="true"] .flower-petal,
html[data-flower-paused="true"] .flower-heart { animation-play-state:paused; }

@media (max-width:700px) {
  .hero-flower-stage { opacity:.50; }
}
```

- [ ] **步骤 4：运行测试确认颜色与时序测试通过**

运行：`node --test tests/portfolio.test.mjs`

预期：颜色和 10 秒动画测试通过；临时暂停 JavaScript 测试仍失败。

- [ ] **步骤 5：提交视觉调整**

```powershell
git add assets/styles.css
git commit -m "feat: deepen rose flower palette and bloom"
```

---

### 任务 3：将永久停止改为鼠标空闲后恢复

**文件：**
- 修改：`assets/site.js`
- 测试：`tests/portfolio.test.mjs`

**接口：**
- 消费：CSS 的 `html[data-flower-paused="true"]` 选择器。
- 产出：`initFlowerMotion()` 在 2800 毫秒后注册被动 `pointermove`；移动时设置暂停，1500 毫秒无移动后移除暂停。

- [ ] **步骤 1：替换一次性永久静止逻辑**

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

  let resumeTimer;
  const pauseFlower = () => {
    root.dataset.flowerPaused = 'true';
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      delete root.dataset.flowerPaused;
    }, 1500);
  };

  window.setTimeout(() => {
    window.addEventListener('pointermove', pauseFlower, { passive: true });
  }, 2800);
}
```

- [ ] **步骤 2：运行完整测试确认 GREEN**

运行：`node --test tests/portfolio.test.mjs`

预期：全部测试通过，0 项失败。

- [ ] **步骤 3：提交临时暂停逻辑**

```powershell
git add assets/site.js
git commit -m "fix: resume flower animation after pointer idle"
```

---

### 任务 4：浏览器验收并发布

**文件：**
- 验证：`assets/styles.css`
- 验证：`assets/site.js`
- 验证：`tests/portfolio.test.mjs`
- 生成：`dist/client/**`

**接口：**
- 消费：任务 1 至任务 3 的源文件与测试。
- 产出：经桌面、390px 手机和真实 HTTP 交互验证的 GitHub Pages 版本。

- [ ] **步骤 1：运行完整测试、构建和空白检查**

运行：`node --test tests/portfolio.test.mjs`

预期：全部测试通过。

运行：`node scripts/build.mjs`

预期：输出 `Static portfolio build complete`。

运行：`git diff --check`

预期：无输出。

- [ ] **步骤 2：通过本地 HTTP 与 Playwright 验证交互时间线**

验证：加载后 2.8 秒内 `data-flower-paused` 为空；2.8 秒后移动鼠标，值变为 `true` 且 `animationPlayState` 为 `paused`；静止 1.5 秒后属性被移除且动画恢复为 `running`。

- [ ] **步骤 3：目视检查桌面白色、桌面深色和 390px 手机截图**

确认：玫瑰色明显但不压住文字；花瓣展开过程可辨认；手机无横向溢出；深色主题保持协调；英文切换正常。

- [ ] **步骤 4：推送并验证公开部署**

运行：`git push github main`

预期：推送成功，GitHub Pages 工作流结论为 `success`；公开 CSS 包含 `petal-bloom-cycle 10s` 和 `data-flower-paused="true"`。
