# src/monitoring/metrics.py
import time
import json
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from collections import defaultdict, deque
from threading import Lock
import logging

logger = logging.getLogger(__name__)

class MetricsCollector:
    """Collect and track application metrics"""
    
    def __init__(self):
        self.metrics = defaultdict(list)
        self.counters = defaultdict(int)
        self.gauges = defaultdict(float)
        self.timers = defaultdict(deque)
        self.lock = Lock()
        
        # Rate limiting tracking
        self.rate_limits = defaultdict(lambda: defaultdict(deque))
    
    def increment_counter(self, name: str, value: int = 1, tags: Dict[str, str] = None):
        """Increment a counter metric"""
        with self.lock:
            key = self._make_key(name, tags)
            self.counters[key] += value
            
            # Store with timestamp for time-series analysis
            self.metrics[key].append({
                'timestamp': datetime.utcnow().isoformat(),
                'value': value,
                'type': 'counter'
            })
    
    def set_gauge(self, name: str, value: float, tags: Dict[str, str] = None):
        """Set a gauge metric"""
        with self.lock:
            key = self._make_key(name, tags)
            self.gauges[key] = value
            
            self.metrics[key].append({
                'timestamp': datetime.utcnow().isoformat(),
                'value': value,
                'type': 'gauge'
            })
    
    def record_timer(self, name: str, duration: float, tags: Dict[str, str] = None):
        """Record a timing metric"""
        with self.lock:
            key = self._make_key(name, tags)
            self.timers[key].append(duration)
            
            # Keep only last 1000 measurements
            if len(self.timers[key]) > 1000:
                self.timers[key].popleft()
            
            self.metrics[key].append({
                'timestamp': datetime.utcnow().isoformat(),
                'value': duration,
                'type': 'timer'
            })
    
    def check_rate_limit(self, identifier: str, limit_type: str, 
                        limit_per_minute: int = 10) -> bool:
        """Check if rate limit is exceeded"""
        with self.lock:
            now = datetime.utcnow()
            minute_ago = now - timedelta(minutes=1)
            
            # Clean old entries
            requests = self.rate_limits[identifier][limit_type]
            while requests and datetime.fromisoformat(requests[0]) < minute_ago:
                requests.popleft()
            
            # Check limit
            if len(requests) >= limit_per_minute:
                self.increment_counter('rate_limit_exceeded', tags={
                    'identifier': identifier,
                    'limit_type': limit_type
                })
                return False
            
            # Add current request
            requests.append(now.isoformat())
            return True
    
    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get summary of all metrics"""
        with self.lock:
            summary = {
                'counters': dict(self.counters),
                'gauges': dict(self.gauges),
                'timers': {}
            }
            
            # Calculate timer statistics
            for key, times in self.timers.items():
                if times:
                    times_list = list(times)
                    summary['timers'][key] = {
                        'count': len(times_list),
                        'avg': sum(times_list) / len(times_list),
                        'min': min(times_list),
                        'max': max(times_list)
                    }
            
            return summary
    
    def _make_key(self, name: str, tags: Dict[str, str] = None) -> str:
        """Create metric key with tags"""
        if not tags:
            return name
        
        tag_str = ','.join(f"{k}={v}" for k, v in sorted(tags.items()))
        return f"{name}[{tag_str}]"

class PerformanceMonitor:
    """Monitor application performance"""
    
    def __init__(self, metrics_collector: MetricsCollector):
        self.metrics = metrics_collector
    
    def time_function(self, func_name: str):
        """Decorator to time function execution"""
        def decorator(func):
            def wrapper(*args, **kwargs):
                start_time = time.time()
                try:
                    result = func(*args, **kwargs)
                    self.metrics.increment_counter('function_success', tags={'function': func_name})
                    return result
                except Exception as e:
                    self.metrics.increment_counter('function_error', tags={
                        'function': func_name,
                        'error_type': type(e).__name__
                    })
                    raise
                finally:
                    duration = time.time() - start_time
                    self.metrics.record_timer('function_duration', duration, 
                                            tags={'function': func_name})
            return wrapper
        return decorator
    
    def monitor_api_call(self, api_name: str, success: bool, 
                        response_time: float, status_code: int = None):
        """Monitor API call metrics"""
        tags = {'api': api_name}
        
        if status_code:
            tags['status_code'] = str(status_code)
        
        self.metrics.increment_counter('api_calls_total', tags=tags)
        
        if success:
            self.metrics.increment_counter('api_calls_success', tags=tags)
        else:
            self.metrics.increment_counter('api_calls_error', tags=tags)
        
        self.metrics.record_timer('api_response_time', response_time, tags=tags)
    
    def monitor_email_sending(self, success: bool, provider: str):
        """Monitor email sending metrics"""
        tags = {'provider': provider}
        
        self.metrics.increment_counter('emails_sent_total', tags=tags)
        
        if success:
            self.metrics.increment_counter('emails_sent_success', tags=tags)
        else:
            self.metrics.increment_counter('emails_sent_error', tags=tags)

# Global metrics collector
metrics_collector = MetricsCollector()
performance_monitor = PerformanceMonitor(metrics_collector)
