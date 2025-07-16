# src/monitoring/logger.py
import logging
import logging.handlers
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional
from pathlib import Path
from config import settings

class HIPAALogger:
    """HIPAA-compliant logging system with audit trail"""
    
    def __init__(self, name: str = "hipaa_compliance"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(getattr(logging, settings.LOG_LEVEL, 'INFO'))
        
        # Create logs directory
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        
        # Setup handlers
        self._setup_handlers(log_dir)
        
    def _setup_handlers(self, log_dir: Path):
        """Setup logging handlers"""
        # File handler for general logs
        file_handler = logging.handlers.RotatingFileHandler(
            log_dir / "application.log",
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        
        # Separate handler for audit logs
        audit_handler = logging.handlers.RotatingFileHandler(
            log_dir / "audit.log",
            maxBytes=10*1024*1024,
            backupCount=10  # Keep more audit logs
        )
        
        # Security handler for security events
        security_handler = logging.handlers.RotatingFileHandler(
            log_dir / "security.log",
            maxBytes=10*1024*1024,
            backupCount=10
        )
        
        # Console handler for development
        console_handler = logging.StreamHandler()
        
        # Formatters
        detailed_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
        )
        
        audit_formatter = logging.Formatter(
            '%(asctime)s - AUDIT - %(message)s'
        )
        
        # Apply formatters
        file_handler.setFormatter(detailed_formatter)
        console_handler.setFormatter(detailed_formatter)
        audit_handler.setFormatter(audit_formatter)
        security_handler.setFormatter(detailed_formatter)
        
        # Add handlers
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
        
        # Create separate loggers for audit and security
        self.audit_logger = logging.getLogger(f"{self.logger.name}.audit")
        self.audit_logger.addHandler(audit_handler)
        self.audit_logger.setLevel(logging.INFO)
        
        self.security_logger = logging.getLogger(f"{self.logger.name}.security")
        self.security_logger.addHandler(security_handler)
        self.security_logger.setLevel(logging.WARNING)
    
    def log_audit_event(self, event_type: str, user_id: str = None, 
                       details: Dict[str, Any] = None):
        """Log audit event for compliance"""
        audit_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': event_type,
            'user_id': user_id,
            'details': details or {}
        }
        
        self.audit_logger.info(json.dumps(audit_entry))
    
    def log_security_event(self, event_type: str, severity: str = "WARNING",
                          user_id: str = None, details: Dict[str, Any] = None):
        """Log security event"""
        security_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': event_type,
            'severity': severity,
            'user_id': user_id,
            'details': details or {}
        }
        
        log_method = getattr(self.security_logger, severity.lower(), self.security_logger.warning)
        log_method(json.dumps(security_entry))
    
    def log_data_access(self, user_id: str, data_type: str, action: str, 
                       record_count: int = None):
        """Log data access for HIPAA compliance"""
        self.log_audit_event(
            'data_access',
            user_id=user_id,
            details={
                'data_type': data_type,
                'action': action,
                'record_count': record_count,
                'ip_address': self._get_client_ip()
            }
        )
    
    def log_email_sent(self, user_id: str, recipient_hash: str, 
                      email_type: str, success: bool):
        """Log email sending activity"""
        self.log_audit_event(
            'email_sent',
            user_id=user_id,
            details={
                'recipient_hash': recipient_hash,  # Don't log actual email
                'email_type': email_type,
                'success': success,
                'timestamp': datetime.utcnow().isoformat()
            }
        )
    
    def log_authentication(self, user_id: str, success: bool, 
                          failure_reason: str = None):
        """Log authentication attempts"""
        event_type = 'authentication_success' if success else 'authentication_failure'
        
        details = {
            'ip_address': self._get_client_ip(),
            'user_agent': self._get_user_agent()
        }
        
        if not success and failure_reason:
            details['failure_reason'] = failure_reason
        
        if success:
            self.log_audit_event(event_type, user_id=user_id, details=details)
        else:
            self.log_security_event(event_type, severity="WARNING", 
                                  user_id=user_id, details=details)
    
    def _get_client_ip(self) -> str:
        """Get client IP address (placeholder)"""
        # In a web application, this would extract from request
        return "127.0.0.1"
    
    def _get_user_agent(self) -> str:
        """Get user agent (placeholder)"""
        # In a web application, this would extract from request
        return "HIPAA Compliance Tool"

# Global logger instance
hipaa_logger = HIPAALogger()
