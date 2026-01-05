#!/usr/bin/env bash

# Demo Setup Script for Neovim MCP Server
# This script helps you quickly set up the demo environment

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Neovim MCP Server Demo Setup         ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo

# Check if we're in the demo directory
if [[ ! -f "package.json" ]] || [[ ! -d "src" ]]; then
    echo -e "${YELLOW}⚠️  Please run this script from the demo directory${NC}"
    echo "   cd demo && ./setup-demo.sh"
    exit 1
fi

echo -e "${GREEN}✓${NC} In demo directory"

# Check if Neovim is installed
if ! command -v nvim &> /dev/null; then
    echo -e "${YELLOW}⚠️  Neovim not found. Please install Neovim first:${NC}"
    echo "   macOS: brew install neovim"
    echo "   Linux: sudo apt install neovim"
    exit 1
fi

echo -e "${GREEN}✓${NC} Neovim is installed"

# Check if Claude Code CLI is installed
if ! command -v claude &> /dev/null; then
    echo -e "${YELLOW}⚠️  Claude Code CLI not found. Please install it first:${NC}"
    echo "   npm install -g @anthropic-ai/claude-code"
    exit 1
fi

echo -e "${GREEN}✓${NC} Claude Code CLI is installed"

# Check if MCP server is configured
echo
echo -e "${BLUE}Checking MCP configuration...${NC}"

if claude mcp list | grep -q "nvim"; then
    echo -e "${GREEN}✓${NC} nvim MCP server is configured"
else
    echo -e "${YELLOW}⚠️  nvim MCP server not configured${NC}"
    echo
    read -p "Would you like to configure it now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Adding MCP server..."
        claude mcp add --transport stdio nvim -- npx nvim-mcp-server
        echo -e "${GREEN}✓${NC} MCP server configured"
    else
        echo "Please configure manually with:"
        echo "  claude mcp add --transport stdio nvim -- npx nvim-mcp-server"
        exit 1
    fi
fi

# Check if tmux is available (optional but recommended)
echo
if command -v tmux &> /dev/null; then
    echo -e "${GREEN}✓${NC} tmux is available (recommended for split-screen demo)"
    TMUX_AVAILABLE=true
else
    echo -e "${YELLOW}⚠️  tmux not found (optional, but recommended for demos)${NC}"
    echo "   Install with: brew install tmux (macOS) or sudo apt install tmux (Linux)"
    TMUX_AVAILABLE=false
fi

# Display setup summary
echo
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Setup Complete!                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo

# Provide launch instructions
echo -e "${GREEN}Ready to start the demo!${NC}"
echo
echo "Choose your setup:"
echo

if [[ "$TMUX_AVAILABLE" == true ]]; then
    echo -e "${BLUE}Option 1: tmux split-screen (Recommended)${NC}"
    echo "  ./start-demo-tmux.sh"
    echo
fi

echo -e "${BLUE}Option 2: Manual setup${NC}"
echo "  Terminal 1:"
echo "    cd demo"
echo "    nvim src/calculator.js"
echo
echo "  Terminal 2:"
echo "    cd demo"
echo "    claude"
echo

echo -e "${BLUE}Option 3: Simple start${NC}"
echo "  nvim src/calculator.js"
echo "  (Then start Claude Code in another terminal)"
echo

echo "📖 See README.md for demo scenarios and tips!"
echo "🎬 See SCREENCAST_SCRIPT.md for the full screencast script!"
