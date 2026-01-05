# Screencast Cheat Sheet

Quick reference for demo prompts and commands during recording.

---

## Pre-Recording Checklist

- [ ] Increase terminal font size (14-18pt)
- [ ] Use high-contrast theme
- [ ] Close unnecessary applications
- [ ] Disable notifications
- [ ] Test microphone
- [ ] Clear terminal history
- [ ] Start screen recording software
- [ ] Navigate to demo directory
- [ ] Run `./start-demo-tmux.sh` or open split terminals

---

## Quick Prompts (Copy-Paste Ready)

### 1. Context Awareness
```
What file am I currently editing?
```

```
What files do I have open in nvim?
```

### 2. Code Improvements
```
Add JSDoc comments to all functions in the current file and add input validation to the divide function to prevent division by zero.
```

### 3. Create New File
```
Create a new file src/validator.js with an email validation function and a phone number validation function. Open it in nvim after creating it.
```

### 4. Generate Tests
```
Create a test file for the calculator module. Add tests for all four functions including edge cases.
```

### 5. Add Feature
```
Add a history feature to calculator.js that tracks the last 10 operations. Include methods to get history and clear history.
```

### 6. Debugging
```
Add console.log statements to the calculator functions to help with debugging.
```

```
Remove the debug logs.
```

### 7. Refactoring
```
Refactor the calculator to use a class-based approach with error handling for all methods.
```

### 8. Reload Buffers
```
Reload all buffers from disk.
```

---

## Neovim Commands

### Buffer Management
```vim
:ls                  " List all buffers
:b calculator.js     " Switch to calculator.js
:b 1                 " Switch to buffer 1
:e src/user.js       " Open user.js
:bn                  " Next buffer
:bp                  " Previous buffer
```

### Undo/Redo
```vim
u                    " Undo
Ctrl-R               " Redo
```

### Other
```vim
:q                   " Quit
:w                   " Save (not needed for demo)
G                    " Go to end of file
gg                   " Go to start of file
```

---

## Tmux Commands

```bash
Ctrl-b + →           # Switch to right pane
Ctrl-b + ←           # Switch to left pane
Ctrl-b + d           # Detach from session
Ctrl-b + :kill-session  # End session
```

---

## Terminal Commands (Third Pane for External Changes)

### Simulate External File Change
```bash
echo "\n// Updated externally" >> src/user.js
```

### Git Operations (if showing git workflow)
```bash
git status
git diff src/calculator.js
git stash
git stash pop
```

---

## Narration Templates

### Opening
*"Today I'm showing you the Neovim MCP Server, which bridges Claude Code and Neovim for AI-assisted coding with real-time updates."*

### Context Awareness
*"Claude automatically sees what I'm editing through MCP resources. No copy-paste needed."*

### Real-Time Updates
*"Watch the left side as Claude makes changes. They appear instantly through Neovim's RPC API."*

### File Creation
*"Claude creates the file and automatically opens it in my editor."*

### Complex Changes
*"In seconds, Claude added a complete feature with state management."*

### Benefits
*"Zero context switching. Real-time updates. Full Neovim compatibility."*

### Closing
*"Check the links in the description to try it yourself!"*

---

## Timing Guide (7-minute version)

| Scene | Duration | Cumulative |
|-------|----------|------------|
| 1. Intro | 30s | 0:30 |
| 2. Context Awareness | 60s | 1:30 |
| 3. Real-Time Refactoring | 90s | 3:00 |
| 4. Create New Files | 60s | 4:00 |
| 5. Multi-File Updates | 60s | 5:00 |
| 6. Interactive Debugging | 45s | 5:45 |
| 7. Complex Refactoring | 60s | 6:45 |
| 8. Getting Started | 30s | 7:15 |

---

## Common Mistakes to Avoid

- ❌ Speaking too fast - slow down!
- ❌ Not pausing after changes - let viewers read code
- ❌ Forgetting to explain "why" - show the benefit
- ❌ Too small font - viewers need to see code clearly
- ❌ Not testing beforehand - always do a dry run
- ❌ Messy desktop - clean up before recording

---

## Post-Recording

- [ ] Review footage for errors
- [ ] Add title cards
- [ ] Add captions/subtitles
- [ ] Add background music (optional, low volume)
- [ ] Highlight important moments with zoom/circles
- [ ] Add links in description
- [ ] Create thumbnail

---

## Links to Include in Description

- GitHub: https://github.com/laktek/nvim-mcp-server
- npm: https://www.npmjs.com/package/nvim-mcp-server
- MCP Docs: https://modelcontextprotocol.io
- Installation guide: (link to README)

---

## Emergency Recovery

### If MCP disconnects:
1. Check status: `/mcp` in Claude Code
2. Restart Claude Code
3. Verify connection again

### If Neovim freezes:
1. Use second terminal
2. `ps aux | grep nvim`
3. `kill -9 <pid>` if needed
4. Restart from checkpoint

### If recording glitches:
- Pause and breathe
- Can edit out in post-production
- Have save points throughout demo

---

## Quick 30-Second Social Media Version

1. Show Neovim with calculator.js
2. Ask: "What file am I editing?"
3. Request: "Add JSDoc to all functions"
4. Show changes appearing in real-time
5. End screen: "Try nvim-mcp-server!"

**Narration:**
*"AI-powered coding in Neovim. Ask Claude to refactor code, watch it update in real-time. No file saves. No context switching. Just seamless AI integration. Try nvim-mcp-server!"*

---

## Testing Before Recording

Run through this quick test:

1. ✅ `What file am I editing?` - Should see calculator.js
2. ✅ `Add a comment to line 1` - Should see update in Neovim
3. ✅ `What files are open?` - Should list buffers
4. ✅ `Create a file test.js` - Should create file
5. ✅ `/mcp` - Should show nvim connected

If all pass → Ready to record! 🎬
