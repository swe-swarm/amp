# amp

AMP is a schema-driven framework for defining agents, apps, APIs, and management surfaces with one unified semantic model.

## AMP expansions

- **Agent Manifest Protocol**: agent definition and runtime metadata
- **Adaptive Manifest Protocol**: supports apps, agents, and APIs
- **Adaptive Manifest Platform**: schema-driven viewports
- **Adaptive Management Plane**: schema-driven dashboards, live tiles, and data streams
- **Agent Model Protocol**: model provider, task, tools, and workflow specification

## Core requirements captured in schema

- Every agent has a required identifier
- Every user and company has approved connectors linked to their account
- Unified semantic schema across identities, connectors, agent spec, model, tools, workflow, and UI
- Adaptive Card support includes **2.1** and backward compatibility for **1.6**
- Agent flashcard model: UI on the front, schema on the back, with layered data in between

See:

- `schemas/amp.manifest.schema.json`
- `examples/amp.manifest.example.json`
