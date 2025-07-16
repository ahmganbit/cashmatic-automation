# src/users/models.py
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum
import uuid
from src.security.auth import AuthenticationManager
from src.security.encryption import EncryptionManager
import logging

logger = logging.getLogger(__name__)

class UserRole(Enum):
    """User roles with different permission levels"""
    VIEWER = "viewer"
    OPERATOR = "operator"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class UserStatus(Enum):
    """User account status"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"

@dataclass
class User:
    """User model"""
    user_id: str
    username: str
    email: str
    role: UserRole
    status: UserStatus
    created_at: datetime
    last_login: Optional[datetime] = None
    password_hash: str = ""
    api_key: str = ""
    permissions: List[str] = None
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.permissions is None:
            self.permissions = []
        if self.metadata is None:
            self.metadata = {}
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for storage"""
        data = asdict(self)
        data['role'] = self.role.value
        data['status'] = self.status.value
        data['created_at'] = self.created_at.isoformat()
        if self.last_login:
            data['last_login'] = self.last_login.isoformat()
        return data
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        """Create user from dictionary"""
        data['role'] = UserRole(data['role'])
        data['status'] = UserStatus(data['status'])
        data['created_at'] = datetime.fromisoformat(data['created_at'])
        if data.get('last_login'):
            data['last_login'] = datetime.fromisoformat(data['last_login'])
        return cls(**data)

class UserManager:
    """Manage users and their permissions"""
    
    def __init__(self, storage_file: str = "users.json"):
        self.storage_file = storage_file
        self.auth_manager = AuthenticationManager()
        self.encryption_manager = EncryptionManager()
        self.users = self._load_users()
    
    def _load_users(self) -> Dict[str, User]:
        """Load users from storage"""
        if not os.path.exists(self.storage_file):
            return {}
        
        try:
            with open(self.storage_file, 'r') as f:
                data = json.load(f)
            
            users = {}
            for user_id, user_data in data.items():
                users[user_id] = User.from_dict(user_data)
            
            return users
        except Exception as e:
            logger.error(f"Error loading users: {e}")
            return {}
    
    def _save_users(self):
        """Save users to storage"""
        try:
            data = {}
            for user_id, user in self.users.items():
                data[user_id] = user.to_dict()
            
            with open(self.storage_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving users: {e}")
            raise
    
    def create_user(self, username: str, email: str, password: str, 
                   role: UserRole = UserRole.VIEWER) -> User:
        """Create a new user"""
        # Check if user already exists
        if self.get_user_by_username(username) or self.get_user_by_email(email):
            raise ValueError("User already exists")
        
        # Create user
        user_id = str(uuid.uuid4())
        password_hash = self.auth_manager.hash_password(password)
        api_key = self.auth_manager.generate_api_key()
        
        user = User(
            user_id=user_id,
            username=username,
            email=self.encryption_manager.encrypt_email(email),  # Encrypt email
            role=role,
            status=UserStatus.ACTIVE,
            created_at=datetime.utcnow(),
            password_hash=password_hash,
            api_key=api_key,
            permissions=self._get_role_permissions(role)
        )
        
        self.users[user_id] = user
        self._save_users()
        
        logger.info(f"Created user {username} with role {role.value}")
        return user
    
    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """Authenticate user with username/password"""
        user = self.get_user_by_username(username)
        if not user:
            return None
        
        if user.status != UserStatus.ACTIVE:
            logger.warning(f"Authentication attempt for inactive user: {username}")
            return None
        
        if self.auth_manager.verify_password(password, user.password_hash):
            user.last_login = datetime.utcnow()
            self._save_users()
            logger.info(f"User {username} authenticated successfully")
            return user
        
        logger.warning(f"Failed authentication attempt for user: {username}")
        return None
    
    def authenticate_api_key(self, api_key: str) -> Optional[User]:
        """Authenticate user with API key"""
        for user in self.users.values():
            if user.api_key == api_key and user.status == UserStatus.ACTIVE:
                user.last_login = datetime.utcnow()
                self._save_users()
                return user
        return None
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        return self.users.get(user_id)
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        for user in self.users.values():
            if user.username == username:
                return user
        return None
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        encrypted_email = self.encryption_manager.encrypt_email(email)
        for user in self.users.values():
            if user.email == encrypted_email:
                return user
        return None
    
    def update_user_role(self, user_id: str, new_role: UserRole, 
                        admin_user_id: str) -> bool:
        """Update user role (admin only)"""
        admin_user = self.get_user_by_id(admin_user_id)
        if not admin_user or admin_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
            raise PermissionError("Only admins can update user roles")
        
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        old_role = user.role
        user.role = new_role
        user.permissions = self._get_role_permissions(new_role)
        self._save_users()
        
        logger.info(f"User {user.username} role updated from {old_role.value} to {new_role.value} by {admin_user.username}")
        return True
    
    def suspend_user(self, user_id: str, admin_user_id: str) -> bool:
        """Suspend user account"""
        admin_user = self.get_user_by_id(admin_user_id)
        if not admin_user or admin_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
            raise PermissionError("Only admins can suspend users")
        
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        user.status = UserStatus.SUSPENDED
        self._save_users()
        
        logger.warning(f"User {user.username} suspended by {admin_user.username}")
        return True
    
    def list_users(self, admin_user_id: str) -> List[Dict[str, Any]]:
        """List all users (admin only)"""
        admin_user = self.get_user_by_id(admin_user_id)
        if not admin_user or admin_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
            raise PermissionError("Only admins can list users")
        
        users_list = []
        for user in self.users.values():
            user_info = {
                'user_id': user.user_id,
                'username': user.username,
                'email': self.encryption_manager.decrypt_email(user.email),
                'role': user.role.value,
                'status': user.status.value,
                'created_at': user.created_at.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None
            }
            users_list.append(user_info)
        
        return users_list
    
    def _get_role_permissions(self, role: UserRole) -> List[str]:
        """Get permissions for a role"""
        role_permissions = {
            UserRole.VIEWER: ['read_trials', 'view_reports'],
            UserRole.OPERATOR: ['read_trials', 'send_emails', 'view_reports', 'run_compliance_checks'],
            UserRole.ADMIN: ['read_trials', 'send_emails', 'view_reports', 'run_compliance_checks', 'manage_users'],
            UserRole.SUPER_ADMIN: ['*']  # All permissions
        }
        
        return role_permissions.get(role, [])
    
    def has_permission(self, user_id: str, permission: str) -> bool:
        """Check if user has specific permission"""
        user = self.get_user_by_id(user_id)
        if not user or user.status != UserStatus.ACTIVE:
            return False
        
        return '*' in user.permissions or permission in user.permissions
