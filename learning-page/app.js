(function () {
  "use strict";

  const atlas = window.FOUNDATION_ATLAS;
  const STORAGE_KEY = "foundation-atlas-state-v1";
  const STATUS_LABELS = { mastered: "已掌握", learning: "学习中", available: "可学习", locked: "未解锁" };
  const nodeById = new Map(atlas.nodes.map((node) => [node.id, node]));
  const trackById = new Map(atlas.tracks.map((track) => [track.id, track]));
  const validNodeIds = new Set(nodeById.keys());

  const elements = Object.fromEntries([
    "trackList", "trackKicker", "trackTitle", "nodeLayer", "edgeLayer", "mapViewport", "mapStage",
    "zoomOut", "zoomIn", "resetView", "progressLabel", "progressPercent", "progressBar", "todayMinutes",
    "todaySummary", "lessonPanel", "emptyLesson", "lessonContent", "lessonStatus", "lessonMeta", "lessonTitle",
    "lessonSummary", "lessonWhy", "lessonPoints", "lessonFormula", "questionText", "answerList",
    "answerFeedback", "sandboxPrompt", "learnerNote", "completeButton", "mentorButton", "closeLesson",
    "importButton", "exportButton", "importInput", "toast", "sidebar", "openSidebar", "closeSidebar"
  ].map((id) => [id, document.getElementById(id)]));

  function emptyState() {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      selectedTrack: "llm",
      selectedNode: null,
      statuses: {},
      answers: {},
      notes: {},
      events: [],
      daily: {}
    };
  }

  function sanitizeState(candidate) {
    const clean = emptyState();
    if (!candidate || typeof candidate !== "object") return clean;
    if (trackById.has(candidate.selectedTrack)) clean.selectedTrack = candidate.selectedTrack;
    if (validNodeIds.has(candidate.selectedNode)) clean.selectedNode = candidate.selectedNode;
    for (const [id, status] of Object.entries(candidate.statuses || {})) {
      if (validNodeIds.has(id) && ["learning", "mastered"].includes(status)) clean.statuses[id] = status;
    }
    for (const [id, answer] of Object.entries(candidate.answers || {})) {
      if (validNodeIds.has(id) && typeof answer === "boolean") clean.answers[id] = answer;
    }
    for (const [id, note] of Object.entries(candidate.notes || {})) {
      if (validNodeIds.has(id) && typeof note === "string") clean.notes[id] = note.slice(0, 10000);
    }
    if (Array.isArray(candidate.events)) clean.events = candidate.events.slice(-500);
    if (candidate.daily && typeof candidate.daily === "object") clean.daily = candidate.daily;
    clean.updatedAt = typeof candidate.updatedAt === "string" ? candidate.updatedAt : clean.updatedAt;
    return clean;
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return sanitizeState(JSON.parse(stored));
    } catch (error) {
      console.warn("Could not read local learning state", error);
    }
    return sanitizeState(window.FOUNDATION_ATLAS_PRIVATE_STATE || null);
  }

  let state = loadState();
  let selectedNodeId = state.selectedNode;
  let view = { x: 0, y: 0, scale: 0.8 };
  let drag = null;
  let toastTimer = null;
  let sessionAnchor = null;

  function saveState() {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function todayKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function dailyEntry() {
    const key = todayKey();
    state.daily[key] ||= { milliseconds: 0, nodes: [], completed: [] };
    return state.daily[key];
  }

  function beginSession() {
    if (!sessionAnchor) sessionAnchor = Date.now();
  }

  function commitSession() {
    if (!sessionAnchor) return;
    dailyEntry().milliseconds += Date.now() - sessionAnchor;
    sessionAnchor = Date.now();
    saveState();
  }

  function addEvent(type, nodeId) {
    state.events.push({ type, nodeId, at: new Date().toISOString() });
    state.events = state.events.slice(-500);
    const day = dailyEntry();
    if (nodeId && !day.nodes.includes(nodeId)) day.nodes.push(nodeId);
    if (type === "mastered" && !day.completed.includes(nodeId)) day.completed.push(nodeId);
  }

  function statusOf(node) {
    if (state.statuses[node.id] === "mastered") return "mastered";
    if (state.statuses[node.id] === "learning") return "learning";
    return node.deps.every((id) => state.statuses[id] === "mastered") ? "available" : "locked";
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2400);
  }

  function renderTracks() {
    elements.trackList.replaceChildren();
    atlas.tracks.forEach((track) => {
      const trackNodes = atlas.nodes.filter((node) => node.track === track.id);
      const mastered = trackNodes.filter((node) => statusOf(node) === "mastered").length;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `track-button${state.selectedTrack === track.id ? " active" : ""}`;
      button.style.setProperty("--track", track.color);
      button.style.setProperty("--soft", track.soft);
      const icon = document.createElement("span");
      icon.className = "track-icon";
      icon.textContent = track.code;
      const copy = document.createElement("span");
      copy.className = "track-copy";
      const title = document.createElement("strong");
      title.textContent = track.name;
      const desc = document.createElement("span");
      desc.textContent = track.description;
      copy.append(title, desc);
      const count = document.createElement("span");
      count.className = "track-count";
      count.textContent = `${mastered}/${trackNodes.length}`;
      button.append(icon, copy, count);
      button.addEventListener("click", () => switchTrack(track.id));
      elements.trackList.append(button);
    });
  }

  function edgePath(from, to) {
    const startX = from.x + 172;
    const startY = from.y + 32;
    const endX = to.x;
    const endY = to.y + 32;
    const bend = Math.max(45, Math.abs(endX - startX) * 0.48);
    if (endX >= startX) return `M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`;
    const midY = (startY + endY) / 2;
    return `M ${startX} ${startY} C ${startX + 55} ${startY}, ${startX + 55} ${midY}, ${startX} ${midY} L ${endX - 45} ${midY} C ${endX - 15} ${midY}, ${endX - 15} ${endY}, ${endX} ${endY}`;
  }

  function renderMap() {
    const track = trackById.get(state.selectedTrack);
    const visibleNodes = atlas.nodes.filter((node) => node.track === track.id);
    elements.trackKicker.textContent = track.kicker;
    elements.trackTitle.textContent = track.title;
    elements.nodeLayer.replaceChildren();
    elements.edgeLayer.replaceChildren();

    visibleNodes.forEach((node) => {
      node.deps.forEach((depId) => {
        const dep = nodeById.get(depId);
        if (!dep || dep.track !== node.track) return;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const depStatus = statusOf(dep);
        const nodeStatus = statusOf(node);
        path.setAttribute("d", edgePath(dep, node));
        path.setAttribute("class", `edge ${nodeStatus === "mastered" ? "mastered" : depStatus === "mastered" ? "active" : ""}`);
        elements.edgeLayer.append(path);
      });
    });

    visibleNodes.forEach((node) => {
      const status = statusOf(node);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `skill-node ${status}${selectedNodeId === node.id ? " selected" : ""}`;
      button.style.left = `${node.x}px`;
      button.style.top = `${node.y}px`;
      button.style.setProperty("--node", track.color);
      button.setAttribute("aria-label", `${node.title}，${STATUS_LABELS[status]}`);
      const medallion = document.createElement("span");
      medallion.className = "node-medallion";
      medallion.textContent = status === "mastered" ? "✓" : status === "locked" ? "·" : node.code;
      const copy = document.createElement("span");
      copy.className = "node-copy";
      const title = document.createElement("strong");
      title.textContent = node.title;
      const subtitle = document.createElement("span");
      subtitle.textContent = node.subtitle;
      copy.append(title, subtitle);
      button.append(medallion, copy);
      if (state.statuses[node.id] === "learning") {
        const badge = document.createElement("span");
        badge.className = "node-badge";
        badge.textContent = "当前";
        button.append(badge);
      }
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        selectNode(node.id);
      });
      elements.nodeLayer.append(button);
    });
  }

  function renderProgress() {
    const mastered = atlas.nodes.filter((node) => statusOf(node) === "mastered").length;
    const percent = Math.round((mastered / atlas.nodes.length) * 100);
    elements.progressLabel.textContent = `${mastered} / ${atlas.nodes.length} 节点`;
    elements.progressPercent.textContent = `${percent}%`;
    elements.progressBar.style.width = `${percent}%`;
    const day = dailyEntry();
    const activeMs = sessionAnchor ? Date.now() - sessionAnchor : 0;
    const minutes = Math.ceil((day.milliseconds + activeMs) / 60000);
    elements.todayMinutes.textContent = `${minutes} 分钟`;
    if (day.completed.length) elements.todaySummary.textContent = `已掌握 ${day.completed.length} 个节点，继续保持这条认知主线。`;
    else if (day.nodes.length) elements.todaySummary.textContent = `正在推进 ${day.nodes.length} 个节点，理解比速度重要。`;
    else elements.todaySummary.textContent = "打开一个节点，开始今天的学习。";
  }

  function renderLesson() {
    const node = nodeById.get(selectedNodeId);
    if (!node) {
      elements.emptyLesson.hidden = false;
      elements.lessonContent.hidden = true;
      elements.lessonPanel.classList.remove("open");
      return;
    }
    const status = statusOf(node);
    elements.emptyLesson.hidden = true;
    elements.lessonContent.hidden = false;
    elements.lessonPanel.classList.add("open");
    elements.lessonStatus.className = `status-pill ${status}`;
    elements.lessonStatus.textContent = STATUS_LABELS[status];
    elements.lessonMeta.textContent = `${node.level} · 约 ${node.minutes} 分钟`;
    elements.lessonTitle.textContent = node.title;
    elements.lessonSummary.textContent = node.lesson.summary;
    elements.lessonWhy.textContent = node.lesson.why;
    elements.lessonPoints.replaceChildren(...node.lesson.points.map((point) => {
      const li = document.createElement("li"); li.textContent = point; return li;
    }));
    elements.lessonFormula.textContent = node.lesson.formula || "";
    elements.questionText.textContent = node.lesson.question;
    elements.answerList.replaceChildren();
    elements.answerFeedback.hidden = true;
    elements.answerFeedback.textContent = "";
    node.lesson.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
      button.addEventListener("click", () => answerQuestion(node, index));
      elements.answerList.append(button);
    });
    if (state.answers[node.id] !== undefined) revealAnswer(node, state.answers[node.id]);
    elements.sandboxPrompt.textContent = node.lesson.sandbox;
    elements.learnerNote.value = state.notes[node.id] || "";
    const mastered = status === "mastered";
    elements.completeButton.disabled = mastered || state.answers[node.id] !== true;
    elements.completeButton.textContent = mastered ? "已经掌握" : state.answers[node.id] ? "标记为已掌握" : "答对后可解锁";
  }

  function revealAnswer(node, wasCorrect, selectedIndex) {
    [...elements.answerList.children].forEach((button, index) => {
      button.classList.toggle("correct", index === node.lesson.answer);
      button.classList.toggle("incorrect", selectedIndex === index && index !== node.lesson.answer);
      button.disabled = wasCorrect;
    });
    elements.answerFeedback.hidden = false;
    elements.answerFeedback.textContent = `${wasCorrect ? "理解到位。" : "这里还差一个边界。"}${node.lesson.feedback}`;
  }

  function answerQuestion(node, index) {
    beginSession();
    const correct = index === node.lesson.answer;
    state.answers[node.id] = correct;
    addEvent(correct ? "answer-correct" : "answer-review", node.id);
    saveState();
    revealAnswer(node, correct, index);
    elements.completeButton.disabled = !correct || statusOf(node) === "mastered";
    elements.completeButton.textContent = correct ? "标记为已掌握" : "理解后再解锁";
    renderProgress();
  }

  function selectNode(nodeId) {
    const node = nodeById.get(nodeId);
    if (!node) return;
    const status = statusOf(node);
    if (status === "locked") {
      const missing = node.deps.filter((id) => state.statuses[id] !== "mastered").map((id) => nodeById.get(id).title);
      showToast(`先掌握：${missing.join("、")}`);
      return;
    }
    beginSession();
    selectedNodeId = nodeId;
    state.selectedNode = nodeId;
    if (status === "available") state.statuses[nodeId] = "learning";
    addEvent("opened", nodeId);
    saveState();
    renderAll();
  }

  function completeSelectedNode() {
    const node = nodeById.get(selectedNodeId);
    if (!node || state.answers[node.id] !== true) return;
    state.notes[node.id] = elements.learnerNote.value.trim();
    state.statuses[node.id] = "mastered";
    addEvent("mastered", node.id);
    saveState();
    renderAll();
    const unlocked = atlas.nodes.filter((candidate) => candidate.deps.includes(node.id) && statusOf(candidate) === "available");
    showToast(unlocked.length ? `已掌握，解锁：${unlocked.map((item) => item.title).join("、")}` : "已掌握，进度已保存在本机");
  }

  function switchTrack(trackId) {
    if (!trackById.has(trackId)) return;
    state.selectedTrack = trackId;
    const selected = nodeById.get(selectedNodeId);
    if (!selected || selected.track !== trackId) {
      selectedNodeId = null;
      state.selectedNode = null;
    }
    saveState();
    elements.sidebar.classList.remove("open");
    renderAll();
    requestAnimationFrame(fitView);
  }

  function applyView() {
    elements.mapStage.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
    elements.resetView.textContent = `${Math.round(view.scale * 100)}%`;
  }

  function fitView() {
    const width = elements.mapViewport.clientWidth;
    const height = elements.mapViewport.clientHeight;
    if (!width || !height) return;
    view.scale = Math.min(0.96, Math.max(0.48, Math.min(width / 1120, height / 760) * 0.94));
    view.x = (width - 1120 * view.scale) / 2;
    view.y = (height - 760 * view.scale) / 2;
    applyView();
  }

  function zoomBy(amount, centerX, centerY) {
    const rect = elements.mapViewport.getBoundingClientRect();
    const px = centerX ?? rect.width / 2;
    const py = centerY ?? rect.height / 2;
    const oldScale = view.scale;
    const nextScale = Math.min(1.35, Math.max(0.42, oldScale + amount));
    const stageX = (px - view.x) / oldScale;
    const stageY = (py - view.y) / oldScale;
    view.scale = nextScale;
    view.x = px - stageX * nextScale;
    view.y = py - stageY * nextScale;
    applyView();
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.append(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }
  }

  async function createMentorMessage() {
    const node = nodeById.get(selectedNodeId);
    if (!node) return;
    const note = elements.learnerNote.value.trim();
    state.notes[node.id] = note;
    addEvent("mentor-message", node.id);
    saveState();
    const answerState = state.answers[node.id] === true ? "页面诊断已答对" : state.answers[node.id] === false ? "页面诊断暂未答对" : "尚未做页面诊断";
    const message = [
      `我正在 Foundation Atlas 学习「${node.title}」节点。`,
      `当前认知主线：${trackById.get(node.track).title}。`,
      `节点状态：${STATUS_LABELS[statusOf(node)]}；${answerState}。`,
      `实战沙盘题：${node.lesson.sandbox}`,
      `我的回答或困惑：${note || "我还没有写，请先用一个具体例子带我进入这个节点。"}`,
      "请继续作为我的私人 AI 导师：先判断我的表达反映了什么理解，再补最少且必要的学习材料，最后只用一个小问题验证。不要一上来让我猜答案，也不要因为我提到旧概念就自动退回旧主线。"
    ].join("\n\n");
    await copyText(message);
    showToast("导师消息已复制，回到 Codex 发送即可");
  }

  function exportState() {
    commitSession();
    const payload = { ...state, exportedAt: new Date().toISOString(), app: "Foundation Atlas" };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `foundation-atlas-${todayKey()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("私人进度已导出");
  }

  async function importState(file) {
    try {
      const imported = sanitizeState(JSON.parse(await file.text()));
      state = imported;
      selectedNodeId = state.selectedNode;
      saveState();
      renderAll();
      requestAnimationFrame(fitView);
      showToast("进度导入成功");
    } catch (_) {
      showToast("这个文件不是有效的 Foundation Atlas 进度");
    }
  }

  function renderAll() {
    renderTracks();
    renderMap();
    renderLesson();
    renderProgress();
  }

  elements.completeButton.addEventListener("click", completeSelectedNode);
  elements.mentorButton.addEventListener("click", createMentorMessage);
  elements.learnerNote.addEventListener("input", () => {
    if (!selectedNodeId) return;
    state.notes[selectedNodeId] = elements.learnerNote.value;
    saveState();
  });
  elements.closeLesson.addEventListener("click", () => elements.lessonPanel.classList.remove("open"));
  elements.importButton.addEventListener("click", () => elements.importInput.click());
  elements.exportButton.addEventListener("click", exportState);
  elements.importInput.addEventListener("change", () => {
    if (elements.importInput.files[0]) importState(elements.importInput.files[0]);
    elements.importInput.value = "";
  });
  elements.openSidebar.addEventListener("click", () => elements.sidebar.classList.add("open"));
  elements.closeSidebar.addEventListener("click", () => elements.sidebar.classList.remove("open"));
  elements.zoomIn.addEventListener("click", () => zoomBy(0.1));
  elements.zoomOut.addEventListener("click", () => zoomBy(-0.1));
  elements.resetView.addEventListener("click", fitView);
  elements.mapViewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    const rect = elements.mapViewport.getBoundingClientRect();
    zoomBy(event.deltaY < 0 ? 0.08 : -0.08, event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });
  elements.mapViewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".skill-node")) return;
    drag = { x: event.clientX, y: event.clientY, viewX: view.x, viewY: view.y };
    elements.mapViewport.setPointerCapture(event.pointerId);
    elements.mapViewport.classList.add("dragging");
  });
  elements.mapViewport.addEventListener("pointermove", (event) => {
    if (!drag) return;
    view.x = drag.viewX + event.clientX - drag.x;
    view.y = drag.viewY + event.clientY - drag.y;
    applyView();
  });
  elements.mapViewport.addEventListener("pointerup", () => {
    drag = null;
    elements.mapViewport.classList.remove("dragging");
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) commitSession();
  });
  window.addEventListener("beforeunload", commitSession);
  window.addEventListener("resize", fitView);
  setInterval(renderProgress, 30000);

  renderAll();
  requestAnimationFrame(fitView);
})();
