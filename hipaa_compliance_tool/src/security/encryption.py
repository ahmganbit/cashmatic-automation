# src/security/encryption.py
import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from typing import Union
import logging

logger = logging.getLogger(__name__)

class EncryptionManager:
    """Handle data encryption for HIPAA compliance"""
    
    def __init__(self, key: Union[str, bytes] = None):
        if key:
            if isinstance(key, str):
                key = key.encode()
            self.key = key
        else:
            self.key = self._generate_key()
        
        self.cipher = Fernet(self._derive_key(self.key))
    
    def _generate_key(self) -> bytes:
        """Generate a new encryption key"""
        return Fernet.generate_key()
    
    def _derive_key(self, password: bytes) -> bytes:
        """Derive encryption key from password"""
        salt = b'hipaa_compliance_salt'  # In production, use random salt per encryption
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password))
        return key
    
    def encrypt(self, data: str) -> str:
        """Encrypt sensitive data"""
        try:
            encrypted_data = self.cipher.encrypt(data.encode())
            return base64.urlsafe_b64encode(encrypted_data).decode()
        except Exception as e:
            logger.error(f"Encryption failed: {e}")
            raise
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        try:
            decoded_data = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted_data = self.cipher.decrypt(decoded_data)
            return decrypted_data.decode()
        except Exception as e:
            logger.error(f"Decryption failed: {e}")
            raise
    
    def encrypt_email(self, email: str) -> str:
        """Encrypt email address for storage"""
        return self.encrypt(email)
    
    def decrypt_email(self, encrypted_email: str) -> str:
        """Decrypt email address"""
        return self.decrypt(encrypted_email)
    
    def hash_data(self, data: str) -> str:
        """Create one-way hash of data for indexing"""
        digest = hashes.Hash(hashes.SHA256())
        digest.update(data.encode())
        return base64.urlsafe_b64encode(digest.finalize()).decode()

class PHIProtection:
    """Protect Personal Health Information (PHI)"""
    
    def __init__(self):
        self.encryption_manager = EncryptionManager()
    
    def sanitize_trial_data(self, trial_data: dict) -> dict:
        """Remove or encrypt PHI from trial data"""
        sanitized = trial_data.copy()
        
        # Encrypt email addresses
        if 'CentralContactEMail' in sanitized:
            sanitized['CentralContactEMail'] = [
                self.encryption_manager.encrypt_email(email)
                for email in sanitized['CentralContactEMail']
            ]
        
        # Remove potentially sensitive fields
        sensitive_fields = [
            'OverallOfficialName',
            'LocationContactName',
            'LocationContactPhone'
        ]
        
        for field in sensitive_fields:
            if field in sanitized:
                del sanitized[field]
        
        return sanitized
    
    def is_phi_data(self, data: str) -> bool:
        """Check if data contains PHI"""
        phi_patterns = [
            r'\b\d{3}-\d{2}-\d{4}\b',  # SSN pattern
            r'\b\d{3}-\d{3}-\d{4}\b',  # Phone pattern
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'  # Email pattern
        ]
        
        import re
        for pattern in phi_patterns:
            if re.search(pattern, data):
                return True
        return False
