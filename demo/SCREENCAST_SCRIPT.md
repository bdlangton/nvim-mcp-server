# Neovim MCP Server Screencast Script

## Overview
This screencast demonstrates how the Neovim MCP Server enables seamless integration between Claude Code and your Neovim editor, allowing AI-powered code assistance with real-time buffer updates.

**Duration:** ~5-7 minutes

---

## Setup (Before Recording)

### Terminal Setup:
1. Open tmux with two panes side-by-side
   - **Left pane:** Neovim (80% width)
   - **Right pane:** Claude Code CLI (20% width)

2. Navigate to demo directory in both panes:
   ```bash
   cd demo
   ```

3. Start Neovim in left pane:
   ```bash
   nvim src/calculator.js
   ```

4. Start Claude Code in right pane (make sure MCP is configured)

---

## Scene 1: Introduction (30 seconds)

### On Screen:
Split screen with Neovim on the left showing calculator.js

### Narration:
*"Hi! Today I'm going to show you the Neovim MCP Server - a tool that bridges Claude Code and Neovim, enabling AI-assisted coding with real-time buffer synchronization."*

*"With this integration, Claude can see what you're working on in Neovim and make changes that appear instantly in your editor."*

### Actions:
- Show Neovim with calculator.js open
- Briefly show the demo project structure

---

## Scene 2: Automatic Context Awareness (60 seconds)

### Narration:
*"One of the key features is automatic context awareness. Claude can see your current buffer without any explicit commands."*

### In Claude Code (right pane), type:
```
What file am I currently editing?
```

### Expected Response:
Claude will respond with the current buffer information from Neovim, showing it knows you're editing `calculator.js`

### Narration:
*"Notice how Claude automatically knows I'm working on calculator.js. This is powered by MCP resources that expose buffer information in real-time."*

### In Claude Code, type:
```
What files do I have open in nvim?
```

### Actions in Neovim (left pane):
- Open another file: `:e src/user.js`
- Switch back to calculator.js: `:b calculator.js`

### Narration:
*"The MCP server tracks all open buffers. Let me open another file... and Claude can see all of them."*

---

## Scene 3: AI-Powered Refactoring with Real-Time Updates (90 seconds)

### Narration:
*"Now let's see the real magic - AI-powered code changes that appear instantly in Neovim."*

### In Claude Code, type:
```
Add JSDoc comments to all functions in the current file and add input validation to the divide function to prevent division by zero.
```

### Expected Behavior:
- Claude reads the current buffer
- Adds JSDoc comments to each function
- Updates the divide function with error handling
- Changes appear IMMEDIATELY in Neovim (left pane)

### Narration (while changes appear):
*"Watch the left side - as Claude makes changes, they appear instantly in my Neovim buffer. No file writes, no manual reloading - it's updating the buffer in real-time through Neovim's RPC API."*

### Actions in Neovim:
- Show that you can undo with `u` - demonstrates normal Neovim undo works
- Redo with `Ctrl-R`

### Narration:
*"And because these are real buffer updates, Neovim's undo history works perfectly."*

---

## Scene 4: Creating New Files (60 seconds)

### Narration:
*"Claude can also create new files and automatically open them in your editor."*

### In Claude Code, type:
```
Create a new file src/validator.js with an email validation function and a phone number validation function. Open it in nvim after creating it.
```

### Expected Behavior:
- Claude creates the new file
- Uses `open_file` tool to open it in Neovim
- File appears in Neovim automatically

### Narration:
*"The file was created and automatically opened in my editor. I can start working on it immediately."*

### Actions in Neovim:
- Browse the created file
- Switch between buffers using `:ls` and `:b <number>`

---

## Scene 5: Multi-File Updates (60 seconds)

### Narration:
*"Let's see how Claude can work across multiple files."*

### In Claude Code, type:
```
Create a test file for the calculator module. Add tests for all four functions including edge cases.
```

### Expected Behavior:
- Claude creates `src/calculator.test.js`
- Adds comprehensive tests
- Opens the file in Neovim

### Actions in Neovim:
- Show both files open (`:ls`)
- Switch between calculator.js and calculator.test.js

### Narration:
*"Now I have both the implementation and tests open. I can review them side by side."*

---

## Scene 6: Interactive Debugging (45 seconds)

### Narration:
*"The integration works great for debugging too."*

### In Claude Code, type:
```
Add console.log statements to the calculator functions to help with debugging.
```

### Expected Behavior:
- Claude updates the current buffer with logging
- Changes appear in real-time in Neovim

### Actions in Neovim:
- Review the changes
- If needed, ask Claude to remove them: "Remove the debug logs"

### Narration:
*"Quick iterations like this are seamless - no context switching needed."*

---

## Scene 7: Working with External File Changes (45 seconds)

### Narration:
*"Sometimes files change outside of Claude - maybe from git, a linter, or another tool. The MCP server can reload buffers too."*

### Actions:
1. In a third terminal pane (bottom), edit a file externally:
   ```bash
   echo "\n// Updated externally" >> src/user.js
   ```

2. In Claude Code, type:
   ```
   Reload all buffers from disk
   ```

### Expected Behavior:
- Claude uses `reload_all_buffers` tool
- Neovim buffers refresh

### Narration:
*"The buffers are reloaded automatically, keeping everything in sync."*

---

## Scene 8: Complex Refactoring (60 seconds)

### Narration:
*"Let's try something more complex - adding a complete feature."*

### In Claude Code, type:
```
Add a history feature to calculator.js that tracks the last 10 operations. Include methods to get history and clear history.
```

### Expected Behavior:
- Claude updates calculator.js with:
  - History array
  - Updated functions to record operations
  - getHistory() method
  - clearHistory() method
- Changes appear in real-time

### Actions in Neovim:
- Scroll through the updated code
- Show the new functionality

### Narration:
*"In seconds, Claude added a complete feature with proper state management."*

---

## Scene 9: Benefits Summary (30 seconds)

### On Screen:
Show split screen with final code

### Narration:
*"So what makes this powerful?"*

**List on screen:**
- ✅ **Zero Context Switching** - Stay in your editor
- ✅ **Real-Time Updates** - See changes instantly
- ✅ **Buffer-Level Integration** - No file writes needed
- ✅ **Full Neovim Compatibility** - Undo, LSP, plugins all work
- ✅ **Multi-File Awareness** - Claude knows your workspace

---

## Scene 10: Getting Started (30 seconds)

### On Screen:
Show terminal with installation command

### Narration:
*"Want to try it yourself? It's easy to set up."*

### Show commands:
```bash
# Install the MCP server
claude mcp add --transport stdio nvim -- npx nvim-mcp-server

# Verify installation
claude mcp list

# Start using it!
```

### On Screen:
Show GitHub repo and npm package links:
- GitHub: github.com/laktek/nvim-mcp-server
- npm: npmjs.com/package/nvim-mcp-server

### Narration:
*"Check out the links in the description for documentation and examples. Happy coding!"*

---

## Recording Tips

### Video Settings:
- **Resolution:** 1920x1080 minimum
- **Frame Rate:** 30 fps
- **Font Size:** Increase for readability
  - Neovim: Set to 16-18pt
  - Terminal: Set to 14-16pt

### Terminal Colors:
- Use a high-contrast theme
- Recommended: One Dark, Dracula, or Nord

### Timing:
- Pause 2-3 seconds after each major action
- Let viewers read code changes
- Keep narration conversational

### Recording Software:
- macOS: QuickTime, OBS, or Screen Studio
- Linux: OBS or SimpleScreenRecorder
- Add zoom effects for important changes

### Audio:
- Use a good microphone
- Record in a quiet environment
- Consider background music (low volume)

### Post-Production:
- Add title cards between scenes
- Highlight important UI elements with circles/arrows
- Speed up slow operations (file creation, etc.)
- Add captions for accessibility

---

## Alternative Quick Demo (2 minutes)

If you want a shorter version, focus on:

1. **Introduction** (15s)
2. **Context Awareness** (30s) - Show Claude knowing current file
3. **Real-Time Updates** (45s) - Make one significant change
4. **Creating New Files** (30s) - Create and auto-open a file
5. **Getting Started** (20s) - Installation instructions

---

## Common Issues & Solutions

### Issue: Changes not appearing in Neovim
**Solution:** Ensure Neovim is running in the same directory as Claude Code

### Issue: MCP server not found
**Solution:** Run `claude mcp list` to verify installation

### Issue: Buffer mismatch
**Solution:** Ensure file paths are absolute or relative to the same working directory

---

## B-Roll Ideas

- Close-up of code changes appearing in real-time
- Side-by-side comparison: with vs without MCP
- Diagram showing the architecture (Neovim ↔ MCP Server ↔ Claude Code)
- Quick cuts of different use cases

---

## Call to Action

*"If you found this useful, give the project a star on GitHub and let me know what features you'd like to see next in the comments below!"*
