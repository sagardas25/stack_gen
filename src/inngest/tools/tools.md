# 🛠 Agent Tools – README

This document defines the **input schema** and **output schema** for the three core tools used by the coding agent:

1. `terminal_tool`
2. `create_or_update_files`
3. `read_files`

These tools enable the agent to **observe**, **modify**, and **execute** within the sandbox environment.

---

# 1️⃣ `terminal_tool`

## 📌 Purpose

Executes shell commands inside the sandbox environment.

Used for:

* Installing dependencies
* Running CLI commands
* Inspecting runtime errors
* Performing environment-level operations

---

## 🔹 Input Schema

```ts
z.object({
  command: z.string(),
})
```

### JSON Schema Representation

```json
{
  "type": "object",
  "properties": {
    "command": {
      "type": "string",
      "description": "Shell command to execute inside the sandbox"
    }
  },
  "required": ["command"]
}
```

### Example Input

```json
{
  "command": "npm install axios --yes"
}
```

---

## 🔹 Output Schema

### Success Output

```json
{
  "stdout": "string",
  "stderr": "string (optional)",
  "exitCode": "number (optional)"
}
```

### Example Success Output

```json
{
  "stdout": "added 23 packages in 2.1s",
  "stderr": "",
  "exitCode": 0
}
```

### Error Output

```json
{
  "error": "string",
  "stdout": "string (partial output if available)",
  "stderr": "string"
}
```

---

# 2️⃣ `create_or_update_files`

## 📌 Purpose

Creates new files or updates existing files inside the sandbox filesystem.

Used for:

* Writing new components
* Updating existing code
* Refactoring files
* Adding configuration files

---

## 🔹 Input Schema

```ts
z.object({
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
    })
  ),
})
```

### JSON Schema Representation

```json
{
  "type": "object",
  "properties": {
    "files": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "path": {
            "type": "string",
            "description": "Relative file path inside sandbox"
          },
          "content": {
            "type": "string",
            "description": "Full file content"
          }
        },
        "required": ["path", "content"]
      }
    }
  },
  "required": ["files"]
}
```

### Example Input

```json
{
  "files": [
    {
      "path": "app/page.tsx",
      "content": "export default function Home() { return <div>Hello</div>; }"
    }
  ]
}
```

---

## 🔹 Output Schema

### Recommended Structured Output

```json
{
  "updatedFiles": [
    {
      "path": "string"
    }
  ]
}
```

### Example Output

```json
{
  "updatedFiles": [
    { "path": "app/page.tsx" },
    { "path": "components/sidebar.tsx" }
  ]
}
```

Internally, the tool also updates:

```
network.state.data.files
```

Which maintains an in-memory representation of the current file state during execution.

---

# 3️⃣ `read_files`

## 📌 Purpose

Reads file contents from the sandbox filesystem.

Used for:

* Inspecting existing code
* Understanding component structure
* Debugging
* Verifying imports and props
* Preventing hallucinated modifications

---

## 🔹 Input Schema

```ts
z.object({
  files: z.array(z.string()),
})
```

### JSON Schema Representation

```json
{
  "type": "object",
  "properties": {
    "files": {
      "type": "array",
      "items": {
        "type": "string",
        "description": "Relative file path to read"
      }
    }
  },
  "required": ["files"]
}
```

### Example Input

```json
{
  "files": ["app/page.tsx", "lib/utils.ts"]
}
```

---

## 🔹 Output Schema

### Recommended Structured Output

```json
{
  "files": [
    {
      "path": "string",
      "content": "string"
    }
  ]
}
```

### Example Output

```json
{
  "files": [
    {
      "path": "app/page.tsx",
      "content": "export default function Home() { return <h1>Hello</h1>; }"
    },
    {
      "path": "lib/utils.ts",
      "content": "export function add(a, b) { return a + b; }"
    }
  ]
}
```

### Error Output

```json
{
  "error": "File not found or read failure"
}
```

---

# 🔄 Tool Interaction Model

These three tools together form the complete engineering loop:

```
1️⃣ read_files              → Observe current state
2️⃣ create_or_update_files  → Modify filesystem
3️⃣ terminal_tool           → Execute commands
```

This enables a full reasoning cycle:

```
Observe → Think → Modify → Execute → Observe Again
```

---



# 🧠 Architectural Summary

| Tool                   | Category            | Side Effects | Durable | Stateful |
| ---------------------- | ------------------- | ------------ | ------- | -------- |
| read_files             | Read-only           | ❌            | ✅       | ❌        |
| create_or_update_files | Filesystem mutation | ✅            | ✅       | ✅        |
| terminal_tool          | OS execution        | ✅            | ✅       | ❌        |

---



They transform the LLM from a simple code generator into a structured, stateful coding agent.

---

