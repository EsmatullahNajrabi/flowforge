const WORKFLOW_TEMPLATES = {
  empty: { "drawflow": { "Home": { "data": {} } } },
  youtube: {
    "drawflow": {
      "Home": {
        "data": {
          "1": { "id": 1, "name": "trigger", "data": { "label": "New YT Comment" }, "class": "trigger", "html": "trigger", "typenode": false, "inputs": {}, "outputs": { "output_1": { "connections": [{ "node": "2", "output": "input_1" }] } }, "pos_x": 100, "pos_y": 150 },
          "2": { "id": 2, "name": "ai", "data": { "label": "Generate Reply" }, "class": "ai", "html": "ai", "typenode": false, "inputs": { "input_1": { "connections": [{ "node": "1", "input": "output_1" }] } }, "outputs": { "output_1": { "connections": [{ "node": "3", "output": "input_1" }] } }, "pos_x": 450, "pos_y": 150 },
          "3": { "id": 3, "name": "output", "data": { "label": "Post Reply via API" }, "class": "output", "html": "output", "typenode": false, "inputs": { "input_1": { "connections": [{ "node": "2", "input": "output_1" }] } }, "outputs": {}, "pos_x": 800, "pos_y": 150 }
        }
      }
    }
  }
};