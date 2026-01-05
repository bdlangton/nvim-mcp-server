#!/usr/bin/env bash

# Tmux Demo Launcher for Neovim MCP Server
# Creates a split-screen layout perfect for screencasts

set -e

SESSION_NAME="nvim-mcp-demo"

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "❌ tmux not found. Please install it first:"
    echo "   macOS: brew install tmux"
    echo "   Linux: sudo apt install tmux"
    exit 1
fi

# Check if we're in the demo directory
if [[ ! -f "package.json" ]] || [[ ! -d "src" ]]; then
    echo "⚠️  Please run this script from the demo directory"
    echo "   cd demo && ./start-demo-tmux.sh"
    exit 1
fi

# Kill existing session if it exists
tmux kill-session -t $SESSION_NAME 2>/dev/null || true

echo "🚀 Starting Neovim MCP Demo environment..."
echo

# Create new tmux session
tmux new-session -d -s $SESSION_NAME -x "$(tput cols)" -y "$(tput lines)"

# Set working directory for the session
tmux send-keys -t $SESSION_NAME "cd $(pwd)" C-m

# Split window vertically (Neovim on left, Claude on right)
tmux split-window -h -t $SESSION_NAME

# Resize panes (80/20 split)
# Left pane (Neovim) should be larger
tmux resize-pane -t $SESSION_NAME:0.0 -x 120

# Left pane: Start Neovim
tmux send-keys -t $SESSION_NAME:0.0 "nvim src/calculator.js" C-m

# Right pane: Show instructions first
tmux send-keys -t $SESSION_NAME:0.1 "cd $(pwd)" C-m
tmux send-keys -t $SESSION_NAME:0.1 "clear" C-m
tmux send-keys -t $SESSION_NAME:0.1 "echo ''" C-m
tmux send-keys -t $SESSION_NAME:0.1 "echo '╔════════════════════════════════╗'" C-m
tmux send-keys -t $SESSION_NAME:0.1 "echo '║  Neovim MCP Server Demo        ║'" C-m
tmux send-keys -t $SESSION_NAME:0.1 "echo '╚════════════════════════════════╝'" C-m
tmux send-keys -t $SESSION_NAME:0.1 "echo ''" C-m
tmux send-keys -t $SESSION_NAME:0.1 "echo 'Start Claude Code when ready:'" C-m
tmux send-keys -t $SESSION_NAME:0.1 "echo '  $ claude'" C-m
tmux send-keys -t $SESSION_NAME:0.1 "echo ''" C-m
tmux send-keys -t $SESSION_NAME:0.1 "echo 'Or press Enter to start now...'" C-m
tmux send-keys -t $SESSION_NAME:0.1 "read -p '' && claude"

# Focus on left pane (Neovim)
tmux select-pane -t $SESSION_NAME:0.0

# Attach to session
echo "✅ Demo environment ready!"
echo
echo "Layout:"
echo "  ┌─────────────────────────┬──────────────┐"
echo "  │                         │              │"
echo "  │   Neovim                │ Claude Code  │"
echo "  │   src/calculator.js     │              │"
echo "  │                         │              │"
echo "  └─────────────────────────┴──────────────┘"
echo
echo "Tmux commands:"
echo "  Switch panes: Ctrl-b + arrow keys"
echo "  Detach: Ctrl-b + d"
echo "  Reattach: tmux attach -t $SESSION_NAME"
echo "  Exit: Type 'exit' in both panes or Ctrl-b + :kill-session"
echo
echo "Attaching to session..."
sleep 2

tmux attach-session -t $SESSION_NAME
