import {vi} from "vitest";
// Mock for URL.createObjectURL
if (typeof window !== 'undefined' && !window.URL.createObjectURL) {
  window.URL.createObjectURL = (blob: Blob) => {
    return `blob:test-${Math.random().toString(36).substring(2, 15)}`;
  };
}

// Mock Worker implementation for tests
class MockWorker {
  private onmessageHandler: ((event: MessageEvent) => void) | null = null;
  private onerrorHandler: ((event: ErrorEvent) => void) | null = null;

  constructor() {
    // Process in next tick to simulate async behavior
    setTimeout(() => {
      this.simulateMessageFromWorker();
    }, 1);
  }

  set onmessage(handler: ((event: MessageEvent) => void) | null) {
    this.onmessageHandler = handler;
  }

  set onerror(handler: ((event: ErrorEvent) => void) | null) {
    this.onerrorHandler = handler;
  }

  postMessage(data: any) {
    // Store the message data for later use
    this.lastMessage = data;
  }

  // Test helper methods
  private lastMessage: any = null;

  private simulateMessageFromWorker() {
    if (this.onmessageHandler && this.lastMessage) {
      const { id, chunks, type } = this.lastMessage;
      const mockEvent = {
        data: {
          id,
          url: `blob:mock-${id}-${Date.now()}`
        }
      } as MessageEvent;
      this.onmessageHandler(mockEvent);
    }
  }

  terminate() {
    // Clean up
    this.onmessageHandler = null;
    this.onerrorHandler = null;
  }
}

// Replace the global Worker constructor for tests
if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
  // @ts-ignore - Replacing Worker with mock for tests
  window.Worker = MockWorker;
}

// Mock URL for import.meta.url in tests
if (typeof import.meta !== 'undefined' && !import.meta.url) {
  Object.defineProperty(import.meta, 'url', {
    value: 'file:///mock/path/file.js'
  });
}


// Mock the Worker constructor globally
vi.stubGlobal('Worker', MockWorker);
