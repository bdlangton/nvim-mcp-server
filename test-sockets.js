#!/usr/bin/env node

// Enable console logging - required because neovim library monkey-patches console
process.env.ALLOW_CONSOLE = "1";

import {
  findNvimSockets,
  getNvimInstancesInCwd,
  listOpenBuffers,
  getCurrentBuffer,
} from "./lib/nvim-operations.js";

async function main() {
  console.log("=== Neovim Socket Detection Test ===\n");

  console.log(`Current working directory: ${process.cwd()}`);
  console.log(`TMPDIR: ${process.env.TMPDIR || "/tmp"}\n`);

  // Test 1: Find all sockets
  console.log("1. Finding Neovim sockets...");
  const sockets = await findNvimSockets();
  console.log(`   Found ${sockets.length} socket(s):`);
  sockets.forEach((socket) => console.log(`   - ${socket}`));
  console.log();

  // Test 2: Get instances in current directory
  console.log("2. Getting Neovim instances in current directory...");
  console.log(`   Checking if any instances match CWD: ${process.cwd()}`);
  const instances = await getNvimInstancesInCwd();
  console.log(`   Found ${instances.length} instance(s):`);
  instances.forEach(({ socket, cwd }) => {
    console.log(`   - Socket: ${socket}`);
    console.log(`     CWD: ${cwd}`);
  });
  console.log();

  // Test 3: List open buffers
  console.log("3. Listing open buffers...");
  try {
    const buffers = await listOpenBuffers();
    console.log(`   Found ${buffers.length} buffer(s):`);
    buffers.forEach(({ path, bufnr, cwd }) => {
      console.log(`   - [${bufnr}] ${path}`);
      console.log(`     Instance CWD: ${cwd}`);
    });
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  console.log();

  // Test 4: Get current buffer
  console.log("4. Getting current buffer...");
  try {
    const current = await getCurrentBuffer();
    if (current) {
      console.log(`   Path: ${current.path}`);
      console.log(`   Content length: ${current.content.length} bytes`);
      console.log(
        `   First 100 chars: ${current.content.substring(0, 100)}...`,
      );
    } else {
      console.log("   No Neovim instance found in current directory");
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log("\n=== Test Complete ===");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
