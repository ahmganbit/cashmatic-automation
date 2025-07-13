# src/security/auth.py
import jwt
import bcrypt
import secrets
from datetime import datetime, timedelta
from functools import wraps
from typing import Optional, Dict, Any
from config import settings
import logging

logger = logging.getLogger(__name__)

class AuthenticationManager:
    """Handle user authentication and authorization"""
    
    def __init__(self):
        self.jwt_secret = settings.JWT_SECRET_KEY
        self.token_expiry = timedelta(hours=24)
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def generate_token(self, user_id: str, permissions: list = None) -> str:
        """Generate JWT token for user"""
        payload = {
            'user_id': user_id,
            'permissions': permissions or [],
            'exp': datetime.utcnow() + self.token_expiry,
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, self.jwt_secret, algorithm='HS256')
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Token expired")
            return None
        except jwt.InvalidTokenError:
            logger.warning("Invalid token")
            return None
    
    def generate_api_key(self) -> str:
        """Generate secure API key"""
        return secrets.token_urlsafe(32)

def require_auth(permissions: list = None):
    """Decorator to require authentication"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # In a real implementation, this would check request headers
            # For now, we'll implement basic validation
            auth_manager = AuthenticationManager()
            # This is a placeholder - in real implementation, extract from request
            token = kwargs.get('auth_token')
            if not token:
                raise PermissionError("Authentication required")
            
            payload = auth_manager.verify_token(token)
            if not payload:
                raise PermissionError("Invalid or expired token")
            
            if permissions:
                user_permissions = payload.get('permissions', [])
                if not any(perm in user_permissions for perm in permissions):
                    raise PermissionError("Insufficient permissions")
            
            kwargs['user_id'] = payload['user_id']
            return func(*args, **kwargs)
        return wrapper
    return decorator

class PermissionManager:
    """Manage user permissions and roles"""
    
    PERMISSIONS = {
        'read_trials': 'Read clinical trials data',
        'send_emails': 'Send compliance emails',
        'manage_users': 'Manage user accounts',
        'view_reports': 'View compliance reports',
        'admin': 'Full administrative access'
    }
    
    ROLES = {
        'viewer': ['read_trials', 'view_reports'],
        'operator': ['read_trials', 'send_emails', 'view_reports'],
        'admin': list(PERMISSIONS.keys())
    }
    
    @classmethod
    def get_role_permissions(cls, role: str) -> list:
        """Get permissions for a role"""
        return cls.ROLES.get(role, [])
    
    @classmethod
    def validate_permission(cls, permission: str) -> bool:
        """Validate if permission exists"""
        return permission in cls.PERMISSIONS
