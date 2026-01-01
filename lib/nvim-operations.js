import { attach } from "neovim";
import { promises as fs } from "fs";
import path from "path";

/**
 * Find all nvim socket files
 */
export async function findNvimSockets() {
  const tmpdir = process.env.TMPDIR || "/tmp";
  const sockets = [];

  try {
    const entries = await fs.readdir(tmpdir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith("nvim")) {
        const socketPath = path.join(tmpdir, entry.name, "0");
        try {
          await fs.access(socketPath);
          sockets.push(socketPath);
        } catch {
          // Socket doesn't exist, skip
        }
      }
    }
  } catch (error) {
    console.error("Error finding nvim sockets:", error.message);
  }

  return sockets;
}

/**
 * Get nvim instances running in the current directory
 */
export async function getNvimInstancesInCwd() {
  const cwd = process.cwd();
  const sockets = await findNvimSockets();
  const instances = [];

  for (const socketPath of sockets) {
    try {
      const nvim = attach({ socket: socketPath });
      const instanceCwd = await nvim.call("getcwd", []);

      // Check if this nvim instance is in our current directory
      if (instanceCwd === cwd || instanceCwd.startsWith(cwd + "/")) {
        instances.push({
          socket: socketPath,
          cwd: instanceCwd,
          nvim,
        });
      }
      // Note: We don't quit non-matching instances, just skip them
    } catch (error) {
      // Failed to connect to this socket, skip it
      continue;
    }
  }

  return instances;
}

/**
 * Get the current (active) buffer from nvim instances
 */
export async function getCurrentBuffer() {
  const instances = await getNvimInstancesInCwd();

  if (instances.length === 0) {
    return null;
  }

  // Use the first instance found
  const { nvim } = instances[0];

  try {
    const currentBuf = await nvim.buffer;
    const bufName = await currentBuf.name;
    const lines = await currentBuf.lines;
    const content = lines.join("\n");

    return {
      path: bufName,
      content,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * List all open buffers in nvim instances
 */
export async function listOpenBuffers() {
  const instances = await getNvimInstancesInCwd();
  const allBuffers = [];

  for (const { nvim, cwd } of instances) {
    try {
      const buffers = await nvim.buffers;

      for (const buf of buffers) {
        const listed = await nvim.call("buflisted", [buf.id]);
        if (listed) {
          const name = await buf.name;
          if (name) {
            allBuffers.push({
              path: name,
              bufnr: buf.id,
              cwd,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error listing buffers:", error.message);
    }
  }

  return allBuffers;
}

/**
 * Get content of a specific buffer by path
 */
export async function getBufferContent(bufferPath) {
  const instances = await getNvimInstancesInCwd();

  for (const { nvim } of instances) {
    try {
      const buffers = await nvim.buffers;

      for (const buf of buffers) {
        const name = await buf.name;
        if (name === bufferPath) {
          const lines = await buf.lines;
          const content = lines.join("\n");

          return content;
        }
      }
    } catch (error) {
      console.error("Error getting buffer content:", error.message);
    }
  }

  throw new Error(`Buffer not found: ${bufferPath}`);
}

/**
 * Update buffer content in nvim
 */
export async function updateBuffer(bufferPath, newContent) {
  const instances = await getNvimInstancesInCwd();

  for (const { nvim } of instances) {
    try {
      const buffers = await nvim.buffers;

      for (const buf of buffers) {
        const name = await buf.name;
        if (name === bufferPath) {
          const lines = newContent.split("\n");
          await buf.setLines(lines, { start: 0, end: -1 });

          return { success: true, path: bufferPath };
        }
      }
    } catch (error) {
      console.error("Error updating buffer:", error.message);
    }
  }

  throw new Error(`Buffer not found: ${bufferPath}`);
}

/**
 * Reload buffer from disk
 */
export async function reloadBuffer(bufferPath) {
  const instances = await getNvimInstancesInCwd();

  for (const { nvim } of instances) {
    try {
      const buffers = await nvim.buffers;

      for (const buf of buffers) {
        const name = await buf.name;
        if (name === bufferPath) {
          // Use nvim command to reload the buffer from disk
          const bufnr = buf.id;
          await nvim.command(`buffer ${bufnr} | edit!`);

          return { success: true, path: bufferPath };
        }
      }
    } catch (error) {
      console.error("Error reloading buffer:", error.message);
    }
  }

  throw new Error(`Buffer not found: ${bufferPath}`);
}

/**
 * Reload all buffers from disk
 */
export async function reloadAllBuffers() {
  const instances = await getNvimInstancesInCwd();
  const reloadedBuffers = [];

  for (const { nvim } of instances) {
    try {
      // Use checktime to reload all buffers that have changed on disk
      await nvim.command("checktime");

      const buffers = await nvim.buffers;
      for (const buf of buffers) {
        const listed = await nvim.call("buflisted", [buf.id]);
        if (listed) {
          const name = await buf.name;
          if (name) {
            reloadedBuffers.push(name);
          }
        }
      }
    } catch (error) {
      console.error("Error reloading buffers:", error.message);
    }
  }

  return {
    success: true,
    message: `Checked ${reloadedBuffers.length} buffer(s) for changes`,
    buffers: reloadedBuffers,
  };
}

/**
 * Open a file in nvim
 */
export async function openFile(filePath) {
  const instances = await getNvimInstancesInCwd();

  if (instances.length === 0) {
    throw new Error("No Neovim instance found in current directory");
  }

  // Use the first instance found
  const { nvim } = instances[0];

  try {
    // Convert to absolute path if relative
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    // Open the file in nvim
    await nvim.command(`edit ${absolutePath}`);

    return {
      success: true,
      path: absolutePath,
    };
  } catch (error) {
    throw new Error(`Failed to open file: ${error.message}`);
  }
}
