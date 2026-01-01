# Neovim MCP Server

MCP (Model Context Protocol) server that integrates Neovim buffers with Claude Code, enabling seamless buffer awareness and real-time updates.

## Features

### Resources (Auto-available Context)
- **`nvim://current-buffer`** - Currently active buffer with path and content
- **`nvim://open-buffers`** - List of all open buffers with metadata

### Tools (Claude Can Invoke)
- **`list_nvim_buffers()`** - List all open buffers in nvim instances running in current directory
- **`get_current_buffer()`** - Get the currently active buffer
- **`get_buffer_content(path)`** - Get content of a specific buffer by path
- **`update_buffer(path, content)`** - Update buffer content directly in nvim (changes appear immediately!)

## Installation

No installation required! Use `npx` to run the server directly.

## Setup with Claude Code

Add this MCP server to your Claude Code configuration:

**File:** `~/.claude/claude_desktop_config.json` (or your Claude Code config file)

```json
{
  "mcpServers": {
    "nvim": {
      "command": "npx",
      "args": ["nvim-mcp-server"]
    }
  }
}
```

## Usage

Once configured, the MCP server will automatically:

1. **Detect Neovim instances** running in the current directory
2. **Expose buffer context** to Claude via resources
3. **Enable buffer operations** via tools

### Example Workflows

#### 1. Refactor Current File
```
You: "Refactor the current file to use async/await"

Claude:
- Reads nvim://current-buffer resource automatically
- Sees you're working on src/api.js
- Refactors the code
- Calls update_buffer() to push changes to nvim
- Changes appear instantly in your editor!
```

#### 2. Check Open Buffers
```
You: "What files do I have open in nvim?"

Claude:
- Calls list_nvim_buffers() tool
- Shows you all open buffers
```

#### 3. Update Specific Buffer
```
You: "Add error handling to src/utils.js"

Claude:
- Calls get_buffer_content("src/utils.js")
- Adds error handling
- Calls update_buffer() to apply changes
- You see updates in nvim immediately
```

## How It Works

1. **Discovery:** Uses `$TMPDIR` to find nvim socket files
2. **Filtering:** Only connects to nvim instances running in the current directory
3. **RPC Communication:** Uses the `neovim` npm package to communicate via msgpack-rpc
4. **MCP Integration:** Exposes nvim buffers as MCP resources and tools

### Socket Discovery

The server finds nvim sockets using:
- **macOS:** `$TMPDIR/nvim*/0` (typically `/var/folders/.../T/nvim*/0`)
- **Linux:** `$TMPDIR/nvim*/0` or `/tmp/nvim*/0`
- Falls back to `/tmp` if `$TMPDIR` is not set

## Benefits

### Real-Time Updates
**Traditional:**
```
Claude writes to file → You reload in nvim
```

**With MCP:**
```
Claude updates buffer via RPC → Changes appear instantly
```

### Context Awareness
Claude automatically knows:
- Which file you're currently editing
- All files you have open
- Can make changes directly in your editor

### Seamless Integration
- No file writes needed (updates are in-memory)
- Works with unsaved buffers
- Normal nvim undo/redo works
- Triggers autocmds (LSP, linting, etc.)

## Troubleshooting

### No Neovim instances found
- Make sure you're running the command from the same directory as your nvim instance
- Check that nvim is running: `ps aux | grep nvim`
- Verify socket exists: `ls $TMPDIR/nvim*/0`

### Buffer updates not appearing
- Ensure the buffer path matches exactly (use absolute paths)
- Check that the buffer is listed: `:ls` in nvim
- Verify the MCP server has permissions to access the socket

### MCP server not connecting
- Restart Claude Code after adding the MCP configuration
- Check Claude Code logs for errors
- Verify the path in the config is absolute and correct

## Development

### Test the server manually:
```bash
node index.js
```

The server communicates via stdio, so you'll need an MCP client (like Claude Code) to interact with it properly.

### Debug mode:
The server logs errors to stderr, which you can see in Claude Code's MCP server logs.

## Requirements

- Node.js 16+
- Neovim with RPC support (any recent version)
- Running nvim instance in the directory where you invoke Claude

## License

MIT
