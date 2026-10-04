let editor;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Drawflow
  const id = document.getElementById("drawflow");
  editor = new Drawflow(id);
  editor.reroute = true;
  
  // Register Node HTML structures
  const getHtml = (icon, title, desc) => `
    <div class="node-header"><i class="${icon}"></i> ${title}</div>
    <div class="node-content">${desc}</div>
  `;

  editor.registerNode('trigger', getHtml('fa-solid fa-bolt', 'Webhook Trigger', 'Listens for incoming payloads'), false);
  editor.registerNode('ai', getHtml('fa-solid fa-brain', 'AI Prompt', 'Sends context to LLM'), false);
  editor.registerNode('condition', getHtml('fa-solid fa-code-branch', 'Condition', 'If/Else logic gate'), false);
  editor.registerNode('transform', getHtml('fa-solid fa-filter', 'Data Transform', 'Format or map JSON data'), false);
  editor.registerNode('output', getHtml('fa-solid fa-paper-plane', 'Action Output', 'Sends data to external API'), false);

  editor.start();

  // Load default template
  editor.import(WORKFLOW_TEMPLATES.youtube);

  // 2. Setup Node Selection Panel
  editor.on('nodeSelected', function(id) {
    document.getElementById("noNodeSelected").style.display = "none";
    document.getElementById("nodeSettings").style.display = "block";
    const node = editor.getNodeFromId(id);
    document.getElementById("configTitle").innerText = `Configure ${node.name}`;
    document.getElementById("nodeNameInput").value = node.data.label || `${node.name}_${id}`;
  });

  editor.on('nodeUnselected', function() {
    document.getElementById("noNodeSelected").style.display = "block";
    document.getElementById("nodeSettings").style.display = "none";
  });

  // 3. UI Controls
  document.getElementById("templateSelector").addEventListener("change", (e) => {
    const val = e.target.value;
    if (WORKFLOW_TEMPLATES[val]) {
      editor.clearModuleSelected();
      editor.import(WORKFLOW_TEMPLATES[val]);
    } else {
      editor.clearModuleSelected();
    }
  });

  const exportModal = new bootstrap.Modal(document.getElementById('exportModal'));
  document.getElementById("exportBtn").addEventListener("click", () => {
    const exportData = editor.export();
    document.getElementById("jsonOutput").textContent = JSON.stringify(exportData, null, 2);
    exportModal.show();
  });

  // 4. Run Execution Simulation
  document.getElementById("runBtn").addEventListener("click", async () => {
    const runBtn = document.getElementById("runBtn");
    const logPanel = document.getElementById("logPanel");
    const logList = document.getElementById("logList");
    
    runBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-1"></i> Running...`;
    runBtn.disabled = true;
    logPanel.style.display = "block";
    logList.innerHTML = "";

    const addLog = (msg, type = "text-light") => {
      const li = document.createElement("li");
      li.className = `mb-1 ${type}`;
      li.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
      logList.appendChild(li);
      logPanel.scrollTop = logPanel.scrollHeight;
    };

    addLog("Initializing workflow execution...", "text-secondary");
    
    const data = editor.export().drawflow.Home.data;
    const nodes = Object.values(data);
    
    // Sort nodes to simulate flow (Trigger first)
    nodes.sort((a, b) => a.id - b.id);

    // Sequence Simulation with delay
    for (const node of nodes) {
      await new Promise(r => setTimeout(r, 1200)); // 1.2s delay between nodes
      
      const nodeEl = document.getElementById(`node-${node.id}`);
      if (nodeEl) {
        nodeEl.classList.remove('node-executing');
        void nodeEl.offsetWidth; // Trigger reflow
        nodeEl.classList.add('node-executing');
      }

      if (node.name === "trigger") addLog(`🟢 Trigger fired. Payload received.`);
      if (node.name === "ai") addLog(`🔵 AI Processing: Generating response from LLM...`);
      if (node.name === "output") addLog(`🟢 Action complete. Data pushed successfully.`, "text-success");
    }

    setTimeout(() => {
      runBtn.innerHTML = `<i class="fa-solid fa-play me-1"></i> Run Workflow`;
      runBtn.disabled = false;
      addLog("Workflow execution finished.", "text-info fw-bold");
    }, 1000);
  });

  document.getElementById("closeLogBtn").addEventListener("click", () => {
    document.getElementById("logPanel").style.display = "none";
  });
});

// Drag and Drop Logic for Canvas
let mobile_item_selec = '';
let mobile_last_move = null;

function drag(ev) {
  if (ev.type === "touchstart") {
    mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
  } else {
    ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  if (ev.type === "touchend") {
    var parentdrawflow = document.elementFromPoint(mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
    if (parentdrawflow != null) addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
    mobile_item_selec = '';
  } else {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("node");
    addNodeToDrawFlow(data, ev.clientX, ev.clientY);
  }
}

function addNodeToDrawFlow(name, pos_x, pos_y) {
  if(editor.editor_mode === 'fixed') return false;
  
  pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
  pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));
  
  let inputs = 1, outputs = 1;
  if(name === 'trigger') { inputs = 0; outputs = 1; }
  if(name === 'output') { inputs = 1; outputs = 0; }
  
  editor.addNode(name, inputs, outputs, pos_x, pos_y, name, { label: name }, name);
}