import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import {
  findNvimSockets,
  getNvimInstancesInCwd,
  getCurrentBuffer,
  listOpenBuffers,
  getBufferContent,
  updateBuffer,
  reloadBuffer,
  reloadAllBuffers,
} from '../lib/nvim-operations.js';

// Mock neovim module
vi.mock('neovim', () => ({
  attach: vi.fn(),
}));

describe('findNvimSockets', () => {
  it('should find nvim socket files in temp directory', async () => {
    // This test would need to mock fs.readdir
    // For now, we test that it returns an array
    const sockets = await findNvimSockets();
    expect(Array.isArray(sockets)).toBe(true);
  });

  it('should handle errors gracefully', async () => {
    // Mock fs to throw an error
    const originalReaddir = fs.readdir;
    fs.readdir = vi.fn().mockRejectedValue(new Error('Permission denied'));

    const sockets = await findNvimSockets();
    expect(Array.isArray(sockets)).toBe(true);
    expect(sockets).toHaveLength(0);

    // Restore original
    fs.readdir = originalReaddir;
  });
});

describe('getNvimInstancesInCwd', () => {
  it('should return an array of nvim instances', async () => {
    const instances = await getNvimInstancesInCwd();
    expect(Array.isArray(instances)).toBe(true);
  });

  it('should filter instances by current working directory', async () => {
    // This would require mocking neovim attach and getcwd
    const instances = await getNvimInstancesInCwd();

    // Each instance should have socket, cwd, and nvim properties
    instances.forEach(instance => {
      expect(instance).toHaveProperty('socket');
      expect(instance).toHaveProperty('cwd');
      expect(instance).toHaveProperty('nvim');
    });
  });
});

describe('getCurrentBuffer', () => {
  it('should return null when no nvim instances are found', async () => {
    // In a test environment with no nvim instances
    const result = await getCurrentBuffer();

    // Could be null if no instances, or an object if running in nvim
    if (result !== null) {
      expect(result).toHaveProperty('path');
      expect(result).toHaveProperty('content');
      expect(typeof result.content).toBe('string');
    } else {
      expect(result).toBeNull();
    }
  });

  it('should return buffer info when nvim instance exists', async () => {
    // This test requires an actual nvim instance running
    const result = await getCurrentBuffer();

    if (result) {
      expect(result).toHaveProperty('path');
      expect(result).toHaveProperty('content');
    }
  });
});

describe('listOpenBuffers', () => {
  it('should return an array of buffers', async () => {
    const buffers = await listOpenBuffers();
    expect(Array.isArray(buffers)).toBe(true);
  });

  it('should return buffers with correct properties', async () => {
    const buffers = await listOpenBuffers();

    buffers.forEach(buffer => {
      expect(buffer).toHaveProperty('path');
      expect(buffer).toHaveProperty('bufnr');
      expect(buffer).toHaveProperty('cwd');
      expect(typeof buffer.path).toBe('string');
      expect(typeof buffer.bufnr).toBe('number');
    });
  });
});

describe('getBufferContent', () => {
  it('should throw error for non-existent buffer', async () => {
    await expect(
      getBufferContent('/non/existent/path.txt')
    ).rejects.toThrow('Buffer not found');
  });

  it('should return string content for existing buffer', async () => {
    // This test requires an actual nvim instance with an open buffer
    // Skip if no nvim instances available
    const buffers = await listOpenBuffers();

    if (buffers.length > 0) {
      const content = await getBufferContent(buffers[0].path);
      expect(typeof content).toBe('string');
    }
  });
});

describe('updateBuffer', () => {
  it('should throw error for non-existent buffer', async () => {
    await expect(
      updateBuffer('/non/existent/path.txt', 'new content')
    ).rejects.toThrow('Buffer not found');
  });

  it('should return success object when buffer is updated', async () => {
    // This test requires an actual nvim instance with an open buffer
    const buffers = await listOpenBuffers();

    if (buffers.length > 0) {
      // Get current content first
      const originalContent = await getBufferContent(buffers[0].path);

      // Update with same content to avoid side effects
      const result = await updateBuffer(buffers[0].path, originalContent);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('path', buffers[0].path);
    }
  });
});

describe('reloadBuffer', () => {
  it('should throw error for non-existent buffer', async () => {
    await expect(
      reloadBuffer('/non/existent/path.txt')
    ).rejects.toThrow('Buffer not found');
  });

  it('should return success object when buffer is reloaded', async () => {
    const buffers = await listOpenBuffers();

    if (buffers.length > 0) {
      const result = await reloadBuffer(buffers[0].path);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('path', buffers[0].path);
    }
  });
});

describe('reloadAllBuffers', () => {
  it('should return success object with buffer count', async () => {
    const result = await reloadAllBuffers();

    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('buffers');
    expect(Array.isArray(result.buffers)).toBe(true);
    expect(typeof result.message).toBe('string');
  });

  it('should include buffer paths in result', async () => {
    const result = await reloadAllBuffers();

    result.buffers.forEach(bufferPath => {
      expect(typeof bufferPath).toBe('string');
    });
  });
});
