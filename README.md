# amp

AMP is a schema-driven framework for defining agents, apps, APIs, and management surfaces with one unified semantic model.

This repository is the **AMP spec**: JSON Schema, examples, and field documentation. It is not the [apim-app](https://github.com/dayour/apim-app) runtime and does not implement a gateway.

## AMP expansions

These names stay in the top-level `protocol` array. Version 1.1 **extends** them; it does not replace them.

- **Agent Manifest Protocol**: agent definition and runtime metadata
- **Adaptive Manifest Protocol**: supports apps, agents, and APIs
- **Adaptive Manifest Platform**: schema-driven viewports
- **Adaptive Management Plane**: schema-driven dashboards, live tiles, and data streams
- **Agent Model Protocol**: model provider, task, tools, and workflow specification

## Interop protocols (AMP 1.1)

A conforming 1.1 manifest MAY declare and version these wire protocols under `protocols`. Live specifications are authoritative for on-the-wire behavior; AMP only declares which revisions a peer speaks.

| Field | Protocol | Versions AMP can declare |
| --- | --- | --- |
| `protocols.agentClientProtocol` | [Agent Client Protocol](https://agentclientprotocol.com) | Stable **v1** (`protocolVersion` `1`) plus draft **v2** (`protocolVersion` `2`) |
| `protocols.activityProtocol` | [Activity Protocol](https://github.com/microsoft/Agents/blob/main/specs/activity/protocol-activity.md) | Provisional **3.4** baseline; optional **v5** envelope (`v: "5"`) |
| `protocols.mcp` | [Model Context Protocol](https://modelcontextprotocol.io) | **2026-07-28** (MCP 2.0: streamable + stateless) with **2025-06-18** backward-compat |
| `protocols.mcpApps` | [MCP Apps / SEP-1865](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx) | Stable extension `io.modelcontextprotocol/ui` (2026-01-26) |

## Spec versions

| `version` | Shape |
| --- | --- |
| omitted or `1.0.0` | Original manifest: AMP expansions, identities, connectors, agent, Adaptive Cards / flashcards |
| `1.1.0` | Same required core, plus optional `protocols`, agent `bindings`, MCP App object refs, and structured tools |

1.0 examples remain valid 1.1 documents. New fields are additive.

## Core requirements captured in schema

- Every agent has a required identifier
- Every user and company has approved connectors linked to their account
- Unified semantic schema across identities, connectors, agent spec, model, tools, workflow, and UI
- Adaptive Card support includes **2.1** and backward compatibility for **1.6**
- Agent flashcard model: UI on the front, schema on the back, with layered data in between
- Interop protocols are optional to declare and MUST be versioned when present

See:

- `schemas/amp.manifest.schema.json`
- `examples/amp.manifest.example.json` — original 1.0 shape
- `examples/amp.manifest.legacy-compat.example.json` — ACP v1, Activity 3.4, MCP 2025-06-18
- `examples/amp.manifest.mcp2.example.json` — stateless MCP 2026-07-28 + MCP Apps
- `examples/amp.manifest.interop.example.json` — all AMP expansions plus all four interop protocols

## Field reference

### Top-level

| Field | Required | Description |
| --- | --- | --- |
| `amp` | yes | Constant `"AMP"` |
| `version` | no | Semver of this manifest spec. Use `1.1.0` when declaring interop protocols |
| `protocol` | yes | Non-empty unique list of AMP expansions (enum above) |
| `supportedResources` | no | `apps`, `agents`, and/or `apis` |
| `protocols` | no | Versioned interop declarations. At least one child if present |
| `agent` | yes | Agent identity, model, task, tools, workflow; optional `bindings` |
| `identities` | yes | `users` and `companies`, each with `approvedConnectors` |
| `semantic` | no | Entity and relationship names for the unified semantic layer |
| `ui` | yes | Adaptive Card versions, tiles, `mcpUiApps`, flashcards |

Interop wire protocols are **not** added to `protocol`. That array remains the AMP expansion list.

### `protocols.agentClientProtocol`

Declares [ACP](https://agentclientprotocol.com) `initialize` negotiation.

| Field | Required | Description |
| --- | --- | --- |
| `supportedProtocolVersions` | yes | Integers: `1` (stable) and/or `2` (draft). Keep `1` when adding draft `2` |
| `preferredProtocolVersion` | no | Version the peer offers first |
| `role` | no | `agent`, `client`, or `both` |
| `info` | no | `{ name, title?, version }` sent as ACP implementation info |
| `authMethods` | no | Methods advertised at initialize. Non-empty implies authenticate / auth/login |
| `transports` | no | `stdio` (stable), `streamable-http` or `websocket` (draft / RFD), `custom` |
| `v1` | no | Stable v1 methods and AgentCapabilities / ClientCapabilities |
| `v2` | required if `2` is listed | Draft v2 methods, nested `session.prompt` / `session.mcp` capabilities, and RFD feature flags |

ACP v1 capabilities match the published v1 schema (`promptCapabilities`, `mcpCapabilities.http` / `sse`, `loadSession`, client `fs` / `terminal` / `elicitation`). ACP v2 capabilities match draft initialize (`session.prompt.{image,audio,embeddedContext}`, `session.mcp.{stdio,http}`). v2 changes session lifecycle and update semantics; it is not a drop-in for v1.

### `protocols.activityProtocol`

Declares [Microsoft Agents Activity Protocol](https://github.com/microsoft/Agents/blob/main/specs/activity/protocol-activity.md).

| Field | Required | Description |
| --- | --- | --- |
| `baseline` | yes | Constant `"3.4"` (provisional baseline) |
| `supportedVersions` | yes | MUST contain `"3.4"`. Add `"5"` to opt into the v5 envelope |
| `role` | no | `agent`, `client`, or `channel` |
| `endpoint` | no | Addressable receive URL for the Agent or channel |
| `activityTypes` | no | v3.4 `type` values (`message`, `invoke`, `typing`, …) |
| `customActivityTypes` | no | Application-layer type strings (A2012) |
| `channels` | no | `{ channelId, name? }` entries (for example `msteams`) |
| `v3` | no | 3.4 profile: JSON serializability, unknown-field acceptance, core fields |
| `v5` | required if `"5"` is listed | Optional extension: `v: "5"`, payload-first envelope, metadata-only `entities`, `relatesTo` graph |

Receivers treat activities without `v` or with a non-`"5"` value as 3.4. v5 is committee-review / draft and MUST coexist with 3.4 during transition.

### `protocols.mcp`

Declares [MCP](https://modelcontextprotocol.io) revisions and transports.

| Field | Required | Description |
| --- | --- | --- |
| `supportedProtocolVersions` | yes | Revision dates. `2026-07-28` is MCP 2.0; `2025-06-18` is the documented backward-compat revision |
| `preferredProtocolVersion` | no | Revision offered first |
| `era` | yes | `modern` (2026-07-28+), `legacy` (initialize-era), or `dual-era` (both on one endpoint) |
| `stateless` | no | `true` when there is no `initialize` handshake and no `Mcp-Session-Id` |
| `transports` | no | `stdio`, `streamableHttp`, deprecated `httpSse`, or `custom` |
| `requestMeta` | no | Modern `_meta` keys (`io.modelcontextprotocol/protocolVersion`, `clientCapabilities`, `clientInfo`, `serverInfo`, …) |
| `methods.modern` | no | Includes required `server/discover`, plus tools/resources/prompts and `subscriptions/listen` |
| `methods.legacy` | no | `initialize`, `notifications/initialized`, `ping`, `resources/subscribe`, … |
| `resultTypes` | no | `complete` and `input_required` (MRTR / SEP-2322) |
| `extensions` | no | Map of extension ids. `io.modelcontextprotocol/ui` and `io.modelcontextprotocol/tasks` are named |
| `capabilities` | no | Server feature flags (`tools`, `resources`, `prompts`) |
| `cacheableResults` | no | SEP-2549 `ttlMs` and `cacheScope` |

**MCP 2.0 (`2026-07-28`) Streamable HTTP:** single POST endpoint; `Accept: application/json, text/event-stream`; required headers `MCP-Protocol-Version`, `Mcp-Method`, and `Mcp-Name` (on `tools/call`, `resources/read`, `prompts/get`); request-scoped SSE; `subscriptions/listen` instead of GET streams; no protocol sessions; no `Last-Event-ID` resume.

**2025-06-18 backward-compat:** `initialize` / `notifications/initialized`; Streamable HTTP POST + optional GET SSE; optional `Mcp-Session-Id`; optional `Last-Event-ID`. Dual-era peers list both revisions. HTTP+SSE (`2024-11-05`) may be listed under `transports.httpSse` as deprecated only.

Era constraints in the schema:

- `modern` MUST include `2026-07-28` and `stateless: true`
- `legacy` MUST include `2025-06-18` and `stateless: false`
- `dual-era` MUST include both `2026-07-28` and `2025-06-18`

### `protocols.mcpApps`

Declares [SEP-1865 MCP Apps](https://modelcontextprotocol.io/seps/1865-mcp-apps-interactive-user-interfaces-for-mcp).

| Field | Required | Description |
| --- | --- | --- |
| `sep` | yes | Constant `"1865"` |
| `extensionId` | yes | Constant `io.modelcontextprotocol/ui` |
| `status` | no | `stable` |
| `specification` | no | `2026-01-26` |
| `mimeTypes` | no | MUST include `text/html;profile=mcp-app` when present |
| `uriScheme` | no | Constant `ui://` |
| `transport` | no | `postMessage` |
| `lifecycle` | no | `ui/initialize`, `ui/notifications/initialized`, sandbox and display-mode notifications |
| `displayModes` | no | `inline`, `fullscreen`, `pip` |
| `hostCapabilities` / `appCapabilities` | no | Host and view capability flags |
| `resources` | no | UI resource objects (`uri`, CSP, permissions, tool linkage) |

### Agent, tools, connectors, and UI extensions

| Field | 1.0 | 1.1 addition |
| --- | --- | --- |
| `agent.tools[]` | string names | or `{ name, description?, inputSchema?, outputSchema?, _meta.ui }` |
| `agent.bindings` | — | Per-agent ACP role/versions, Activity endpoint/`channelId`, MCP server bindings |
| `identities.*.approvedConnectors[].mcp` | — | Connector-linked MCP server (`name`, `transport`, `endpoint` / `command`, `era`) |
| `ui.mcpUiApps[]` | string names | or SEP-1865 resource objects (`uri` MUST be `ui://…`) |

Tool `_meta.ui` follows SEP-1865: `resourceUri` (ui://) and `visibility` (`model` and/or `app`). Hosts that do not speak MCP Apps treat the tool as text-only.

### Unchanged 1.0 surfaces

`identities`, Adaptive Card `2.1` + `1.6`, live `tiles`, and flashcards (front UI, back schema, `dataLayers`) keep their 1.0 shapes. Connector `id` / `name` / `scopes` are unchanged; `mcp` is optional.

## Validate

```bash
npm install
npm test
```

`scripts/validate.mjs` checks the schema against JSON Schema 2020-12, validates every file in `examples/`, and asserts that fixtures in `tests/invalid/` are rejected.

## Out of scope

This spec repo does not reimplement the PowerShell / APIM gateway, MCP session runtime, or ACP agent process. Consume the schema from [apim-app](https://github.com/dayour/apim-app) or any other conforming runtime.
