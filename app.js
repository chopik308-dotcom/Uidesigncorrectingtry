const screens = [
  { title: "ZERO ROOM: WAKE", tpl: "wakeTpl" },
  { title: "ZERO ROOM: SYSTEM STATUS", tpl: "statusTpl" },
  { title: "SESSION SHELL: ORIENTATION", tpl: "shellTpl" },
  { title: "SESSION ANCHOR: INPUT", tpl: "anchorTpl" },
];

let current = 0;
const state = {
  notes: 0,
  nodes: 0,
  deterministicLinks: 0,
  hypothesisLinks: 0,
  tensions: 0,
  revisions: 0,
  timeline: [],
};

const titleNode = document.getElementById("screenTitle");
const screenNode = document.getElementById("screen");

function render() {
  titleNode.textContent = screens[current].title;
  const dots = [...document.querySelectorAll(".dot")];
  dots.forEach((d, i) => d.classList.toggle("active", i === current));
  const tpl = document.getElementById(screens[current].tpl);
  screenNode.innerHTML = "";
  screenNode.appendChild(tpl.content.cloneNode(true));
  bindScreenHandlers();
}

function setStatusMetrics() {
  const map = {
    mNotes: state.notes,
    mNodes: state.nodes,
    mLinks: state.deterministicLinks,
    mHyp: state.hypothesisLinks,
    mTensions: state.tensions,
    mRev: state.revisions,
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value);
  });
  const timeline = document.getElementById("timeline");
  if (timeline) timeline.textContent = state.timeline.join("\n") || "No revisions yet.";
}

async function api(path, method = "GET", body) {
  const res = await fetch(`http://127.0.0.1:8000${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API ${path} failed`);
  return res.json();
}

async function pullStatus() {
  try {
    const status = await api("/zero-room/status");
    state.notes = status.imported_notes_count;
    state.nodes = status.node_count;
    state.deterministicLinks = status.deterministic_links_count;
    state.hypothesisLinks = status.hypothesis_links_count;
    state.tensions = status.tensions_count;
    state.revisions = status.revision_count;
    state.timeline = status.event_log;
  } catch {
    state.timeline = ["API unavailable: run services/api FastAPI app."];
  }
  setStatusMetrics();
}

function bindScreenHandlers() {
  const statusBtn = document.querySelector('[data-action="status"]');
  if (statusBtn) statusBtn.onclick = () => {
    current = 1;
    render();
    pullStatus();
  };

  const chatBtn = document.querySelector('[data-action="chat"]');
  if (chatBtn) chatBtn.onclick = () => {
    current = 3;
    render();
  };

  const importBtn = document.getElementById("importBtn");
  if (importBtn) {
    importBtn.onclick = async () => {
      try {
        await api("/ingestion/import-seed", "POST", {});
        await pullStatus();
      } catch {
        state.timeline = ["Import failed: API unavailable."];
        setStatusMetrics();
      }
    };
  }

  const mapBtn = document.getElementById("mapBtn");
  if (mapBtn) mapBtn.onclick = async () => {
    try {
      const map = await api("/map");
      state.timeline = [
        `Map snapshot: ${map.nodes.length} nodes, ${map.deterministic_links.length} deterministic links, ${map.hypothesis_links.length} hypothesis links`,
        ...map.timeline.slice(-5),
      ];
    } catch {
      state.timeline = ["Map unavailable: API offline."];
    }
    setStatusMetrics();
  };

  const timelineBtn = document.getElementById("timelineBtn");
  if (timelineBtn) timelineBtn.onclick = () => pullStatus();

  const submitAnchor = document.getElementById("submitAnchor");
  if (submitAnchor) {
    submitAnchor.onclick = () => {
      const v = document.getElementById("anchorInput").value.trim();
      const log = document.getElementById("chatLog");
      if (!v) return;
      log.textContent += `ANCHOR SET: ${v}\n`;
      document.getElementById("anchorInput").value = "";
    };
  }

  const send = document.getElementById("chatSend");
  if (send) {
    send.onclick = async () => {
      const input = document.getElementById("chatInput");
      const log = document.getElementById("chatLog");
      const text = input.value.trim();
      if (!text) return;
      log.textContent += `YOU: ${text}\n`;
      input.value = "";
      try {
        const reply = await api("/entourage/reply", "POST", { message: text });
        log.textContent += `ENTOURAGE (${reply.state}): ${reply.reply}\n`;
      } catch {
        log.textContent += "ENTOURAGE: API unavailable.\n";
      }
    };
  }

  if (current === 1) setStatusMetrics();
}

document.getElementById("prevBtn").onclick = () => {
  current = (current - 1 + screens.length) % screens.length;
  render();
};
document.getElementById("nextBtn").onclick = () => {
  current = (current + 1) % screens.length;
  render();
};

window.addEventListener("mousemove", (e) => {
  const nx = (e.clientX / window.innerWidth - 0.5) * 6;
  const ny = (e.clientY / window.innerHeight - 0.5) * 4;
  document.getElementById("app").style.transform = `translate(${-4 + nx * 0.1}vw, ${ny * 0.1}vh)`;
});

render();
