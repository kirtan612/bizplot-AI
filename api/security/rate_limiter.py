"""
BizPilot AI - Sliding Window Rate Limiter Engine.
Protects sensitive endpoints against brute force and API abuse.
"""

import time
from collections import defaultdict
from typing import Dict, List
from fastapi import HTTPException, status, Request


class RateLimiter:
    """Sliding window rate limiter per client IP / identifier."""
    
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.history: Dict[str, List[float]] = defaultdict(list)

    def is_allowed(self, identifier: str) -> bool:
        now = time.time()
        cutoff = now - self.window_seconds
        # Clean older requests
        self.history[identifier] = [t for t in self.history[identifier] if t > cutoff]
        
        if len(self.history[identifier]) >= self.max_requests:
            return False

        self.history[identifier].append(now)
        return True


# Global rate limiters
auth_rate_limiter = RateLimiter(max_requests=10, window_seconds=60)  # 10 login attempts per min
api_rate_limiter = RateLimiter(max_requests=300, window_seconds=60)  # 300 requests per min


def check_rate_limit(request: Request, limiter: RateLimiter = api_rate_limiter):
    """FastAPI dependency for endpoint rate limiting."""
    client_ip = request.client.host if request.client else "unknown"
    if not limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Rate limit exceeded. Please try again later."
        )
