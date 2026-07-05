// Copyright 2019-2026 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

const MAX_REQUESTS_PER_SECOND = 2;

interface QueueTask<T> {
  url: string;
  options?: RequestInit;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

class SubscanRequestQueue {
  private queue: QueueTask<unknown>[] = [];
  private isRunning = false;
  private readonly intervalMs: number;

  constructor(requestsPerSecond: number) {
    this.intervalMs = Math.floor(1000 / requestsPerSecond);
  }

  public enqueue<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        url,
        options,
        resolve: resolve as (value: unknown) => void,
        reject
      });

      void this.run();
    });
  }

  private async run(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();

      if (!task) {
        continue;
      }

      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", "6cba978cd0604cf6bc444693d5a50179");

        const response = await fetch(task.url, { ...task.options, headers: myHeaders });

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        task.resolve(data);
      } catch (error) {
        task.reject(error);
      }

      await this.sleep(this.intervalMs);
    }

    this.isRunning = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const subscanQueue = new SubscanRequestQueue(MAX_REQUESTS_PER_SECOND);
