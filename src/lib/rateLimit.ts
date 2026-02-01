interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();

  constructor(
    private maxRequests: number,
    private windowMs: number,
    private keyPrefix: string = 'rate_limit'
  ) {}

  private getKey(identifier: string): string {
    return `${this.keyPrefix}:${identifier}`;
  }

  isAllowed(identifier: string): boolean {
    const key = this.getKey(identifier);
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.storage.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const key = this.getKey(identifier);
    const entry = this.storage.get(key);
    const now = Date.now();

    if (!entry || now > entry.resetTime) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - entry.count);
  }

  getResetTime(identifier: string): number | null {
    const key = this.getKey(identifier);
    const entry = this.storage.get(key);
    const now = Date.now();

    if (!entry || now > entry.resetTime) {
      return null;
    }

    return entry.resetTime;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetTime) {
        this.storage.delete(key);
      }
    }
  }
}

// Rate limiters for different actions
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000, 'auth'); // 5 attempts per 15 minutes
export const orderRateLimiter = new RateLimiter(10, 60 * 60 * 1000, 'order'); // 10 orders per hour
export const contactRateLimiter = new RateLimiter(3, 60 * 60 * 1000, 'contact'); // 3 contacts per hour

// Cleanup expired entries every 5 minutes
setInterval(() => {
  authRateLimiter.cleanup();
  orderRateLimiter.cleanup();
  contactRateLimiter.cleanup();
}, 5 * 60 * 1000);

// Helper functions
export const checkAuthRateLimit = (email: string): { allowed: boolean; remaining: number; resetTime: number | null } => {
  const allowed = authRateLimiter.isAllowed(email);
  const remaining = authRateLimiter.getRemainingRequests(email);
  const resetTime = authRateLimiter.getResetTime(email);
  
  return { allowed, remaining, resetTime };
};

export const checkOrderRateLimit = (identifier: string): { allowed: boolean; remaining: number; resetTime: number | null } => {
  const allowed = orderRateLimiter.isAllowed(identifier);
  const remaining = orderRateLimiter.getRemainingRequests(identifier);
  const resetTime = orderRateLimiter.getResetTime(identifier);
  
  return { allowed, remaining, resetTime };
};
