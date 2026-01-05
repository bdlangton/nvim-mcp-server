# Neovim MCP Server Demo

This directory contains a demo project for showcasing the Neovim MCP Server capabilities in screencasts and presentations.

## Demo Files

- **src/calculator.js** - Simple calculator module (starting point for refactoring demos)
- **src/user.js** - User management module (for multi-file demos)
- **package.json** - Basic project configuration

## Using This Demo

### Quick Setup

1. **Navigate to the demo directory:**
   ```bash
   cd demo
   ```

2. **Open Neovim:**
   ```bash
   nvim src/calculator.js
   ```

3. **Start Claude Code in another terminal/pane:**
   ```bash
   claude
   ```

4. **Verify MCP connection:**
   ```
   /mcp
   ```

   You should see `nvim` in the list of connected servers.

### Recommended Terminal Layout

For the best demo experience, use tmux or split terminals:

```
┌─────────────────────────────────┬──────────────┐
│                                 │              │
│         Neovim                  │  Claude Code │
│      (80% width)                │  (20% width) │
│                                 │              │
│   src/calculator.js             │              │
│                                 │              │
└─────────────────────────────────┴──────────────┘
```

**Setup with tmux:**
```bash
# Start tmux
tmux

# Split vertically
Ctrl-b %

# Resize panes (in left pane)
Ctrl-b :resize-pane -R 30

# Left pane: Start Neovim
nvim src/calculator.js

# Switch to right pane
Ctrl-b →

# Right pane: Start Claude Code
claude
```

## Demo Scenarios

### 1. Context Awareness
**Show:** Claude automatically knows what file you're editing

```
You: "What file am I currently editing?"
```

Claude will see `nvim://current-buffer` and respond with calculator.js info.

### 2. Real-Time Code Updates
**Show:** Changes appear instantly in Neovim

```
You: "Add JSDoc comments to all functions in the current file"
```

Watch as Claude updates the buffer in real-time - no file saves needed!

### 3. Multi-File Awareness
**Show:** Claude tracks all open buffers

Open multiple files in Neovim:
```vim
:e src/user.js
:e src/calculator.js
```

Then ask Claude:
```
You: "What files do I have open?"
```

### 4. Create and Open Files
**Show:** Claude creates files and opens them in Neovim

```
You: "Create a new file src/validator.js with email and phone validation functions. Open it in nvim."
```

The file will be created AND automatically opened in your Neovim instance!

### 5. Refactoring
**Show:** Complex code changes

```
You: "Refactor the calculator to use a class-based approach and add error handling to all methods"
```

### 6. Test Generation
**Show:** Creating complementary files

```
You: "Create comprehensive tests for the calculator module"
```

Claude will create a test file and can open it for you.

### 7. Buffer Reload
**Show:** Syncing external changes

Make changes outside Neovim (e.g., via git):
```bash
git stash
git stash pop
```

Then ask Claude:
```
You: "Reload all buffers from disk"
```

## Features to Highlight

### Resources (Automatic Context)
- ✅ Current buffer content automatically available to Claude
- ✅ List of all open buffers visible to Claude
- ✅ No manual copy-paste needed

### Tools (Claude Can Use)
- ✅ `list_nvim_buffers()` - See all open files
- ✅ `get_current_buffer()` - Get active file
- ✅ `get_buffer_content(path)` - Read specific buffer
- ✅ `update_buffer(path, content)` - Update in real-time
- ✅ `open_file(path)` - Create and open files
- ✅ `reload_buffer(path)` - Sync from disk
- ✅ `reload_all_buffers()` - Sync all buffers

### Benefits
- 🚀 **Zero Context Switching** - Stay in your editor
- ⚡ **Instant Updates** - See AI changes in real-time
- 🔄 **Full Undo Support** - Normal Vim undo works
- 🎯 **Buffer-Level** - No file writes needed
- 🔌 **LSP Compatible** - Works with your existing setup

## Tips for Better Demos

### Terminal Settings
1. **Increase font size:**
   - Neovim: `:set guifont=Monaco:h16` (for GUI)
   - Terminal: Use 14-18pt fonts

2. **Use high-contrast theme:**
   - Recommended: One Dark, Dracula, Nord, Gruvbox

3. **Disable distracting plugins:**
   - Temporarily disable status bars with too much info
   - Keep it clean and focused

### Neovim Settings
```vim
" Clean setup for demos
set number          " Show line numbers
set relativenumber  " Relative line numbers
set cursorline      " Highlight current line
syntax on           " Syntax highlighting
colorscheme nord    " High-contrast theme
```

### Recording Settings
- **Resolution:** 1920x1080 or higher
- **Frame rate:** 30 fps minimum
- **Screen recording:** OBS, QuickTime, or Screen Studio
- **Zoom in** on important code changes

### Narration Tips
1. Explain what you're about to do
2. Let viewers see the change happen
3. Pause briefly to let it sink in
4. Move to the next feature

### Common Mistakes to Avoid
- ❌ Going too fast - pause between actions
- ❌ Too small font - viewers can't read code
- ❌ Not explaining what's happening
- ❌ Skipping the "why it's useful" part
- ❌ Too much jargon - keep it accessible

## Quick Demo Script (30 seconds)

For social media or quick intros:

1. **Show Neovim with code** (5s)
2. **Ask Claude about current file** (5s)
3. **Request a code change** (5s)
4. **Show real-time update in Neovim** (10s)
5. **End with "Try it yourself!"** (5s)

Example narration:
*"Here's Neovim with my code. I ask Claude to refactor it. Watch the left side - the changes appear instantly! No file saves, no reloading. Just real-time AI-powered coding. Try it yourself with nvim-mcp-server!"*

## Extended Demo Script

See `SCREENCAST_SCRIPT.md` for a comprehensive 5-7 minute screencast script with detailed scenes, narration, and timing.

## Testing Your Setup

Before recording, test the following:

1. ✅ MCP server is connected: `/mcp` in Claude Code
2. ✅ Claude can see current buffer: "What file am I editing?"
3. ✅ Updates appear in real-time: "Add a comment to this file"
4. ✅ File creation works: "Create a new file test.js"
5. ✅ Multiple buffers tracked: Open 2-3 files, ask "What's open?"

## Troubleshooting

### Issue: Claude doesn't see my Neovim buffers
**Solution:** Make sure both Neovim and Claude Code are running in the same directory

### Issue: Changes don't appear in Neovim
**Solution:**
- Check that MCP is connected: `/mcp`
- Verify Neovim is running: `ps aux | grep nvim`
- Ensure paths match: Use absolute paths or same working directory

### Issue: "No Neovim instance found"
**Solution:** Start Neovim in the same directory where you're running Claude Code

### Issue: File won't open after creation
**Solution:** The file path must be relative to the current working directory

## Resources

- **Full Documentation:** ../README.md
- **GitHub:** https://github.com/laktek/nvim-mcp-server
- **npm Package:** https://www.npmjs.com/package/nvim-mcp-server
- **MCP Docs:** https://modelcontextprotocol.io

## Questions?

Open an issue on GitHub or reach out on Twitter/X!

Happy demoing! 🎬
