# tests/test_security.py
import unittest
import pytest
from unittest.mock import patch, MagicMock
import sys
import os
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.append(str(PROJECT_ROOT))

from src.security.auth import AuthenticationManager, PermissionManager, require_auth
from src.security.encryption import EncryptionManager, PHIProtection

class TestAuthenticationManager(unittest.TestCase):
    """Test authentication functionality"""
    
    def setUp(self):
        self.auth_manager = AuthenticationManager()
    
    def test_password_hashing(self):
        """Test password hashing and verification"""
        password = "test_password_123"
        hashed = self.auth_manager.hash_password(password)
        
        # Hash should be different from original
        self.assertNotEqual(password, hashed)
        
        # Should verify correctly
        self.assertTrue(self.auth_manager.verify_password(password, hashed))
        
        # Should fail with wrong password
        self.assertFalse(self.auth_manager.verify_password("wrong_password", hashed))
    
    def test_token_generation_and_verification(self):
        """Test JWT token generation and verification"""
        user_id = "test_user_123"
        permissions = ["read_trials", "send_emails"]
        
        # Generate token
        token = self.auth_manager.generate_token(user_id, permissions)
        self.assertIsInstance(token, str)
        
        # Verify token
        payload = self.auth_manager.verify_token(token)
        self.assertIsNotNone(payload)
        self.assertEqual(payload['user_id'], user_id)
        self.assertEqual(payload['permissions'], permissions)
    
    def test_invalid_token(self):
        """Test invalid token handling"""
        invalid_token = "invalid.token.here"
        payload = self.auth_manager.verify_token(invalid_token)
        self.assertIsNone(payload)
    
    def test_api_key_generation(self):
        """Test API key generation"""
        api_key = self.auth_manager.generate_api_key()
        self.assertIsInstance(api_key, str)
        self.assertGreater(len(api_key), 20)  # Should be reasonably long

class TestPermissionManager(unittest.TestCase):
    """Test permission management"""
    
    def test_role_permissions(self):
        """Test role permission mapping"""
        viewer_perms = PermissionManager.get_role_permissions('viewer')
        self.assertIn('read_trials', viewer_perms)
        self.assertNotIn('manage_users', viewer_perms)
        
        admin_perms = PermissionManager.get_role_permissions('admin')
        self.assertIn('manage_users', admin_perms)
        self.assertIn('read_trials', admin_perms)
    
    def test_permission_validation(self):
        """Test permission validation"""
        self.assertTrue(PermissionManager.validate_permission('read_trials'))
        self.assertFalse(PermissionManager.validate_permission('invalid_permission'))

class TestEncryptionManager(unittest.TestCase):
    """Test encryption functionality"""
    
    def setUp(self):
        self.encryption_manager = EncryptionManager()
    
    def test_data_encryption_decryption(self):
        """Test basic encryption and decryption"""
        original_data = "sensitive_data_123"
        
        # Encrypt data
        encrypted = self.encryption_manager.encrypt(original_data)
        self.assertNotEqual(original_data, encrypted)
        
        # Decrypt data
        decrypted = self.encryption_manager.decrypt(encrypted)
        self.assertEqual(original_data, decrypted)
    
    def test_email_encryption(self):
        """Test email encryption"""
        email = "test@example.com"
        
        encrypted_email = self.encryption_manager.encrypt_email(email)
        self.assertNotEqual(email, encrypted_email)
        
        decrypted_email = self.encryption_manager.decrypt_email(encrypted_email)
        self.assertEqual(email, decrypted_email)
    
    def test_data_hashing(self):
        """Test one-way data hashing"""
        data = "test_data"
        hash1 = self.encryption_manager.hash_data(data)
        hash2 = self.encryption_manager.hash_data(data)
        
        # Same data should produce same hash
        self.assertEqual(hash1, hash2)
        
        # Different data should produce different hash
        hash3 = self.encryption_manager.hash_data("different_data")
        self.assertNotEqual(hash1, hash3)

class TestPHIProtection(unittest.TestCase):
    """Test PHI protection functionality"""
    
    def setUp(self):
        self.phi_protection = PHIProtection()
    
    def test_trial_data_sanitization(self):
        """Test trial data sanitization"""
        trial_data = {
            'NCTId': ['NCT12345'],
            'BriefTitle': ['Test Study'],
            'CentralContactEMail': ['test@example.com'],
            'OverallOfficialName': ['Dr. Test'],
            'LocationContactPhone': ['555-1234']
        }
        
        sanitized = self.phi_protection.sanitize_trial_data(trial_data)
        
        # Should keep non-sensitive data
        self.assertEqual(sanitized['NCTId'], trial_data['NCTId'])
        self.assertEqual(sanitized['BriefTitle'], trial_data['BriefTitle'])
        
        # Should encrypt emails
        self.assertNotEqual(sanitized['CentralContactEMail'], trial_data['CentralContactEMail'])
        
        # Should remove sensitive fields
        self.assertNotIn('OverallOfficialName', sanitized)
        self.assertNotIn('LocationContactPhone', sanitized)
    
    def test_phi_detection(self):
        """Test PHI detection"""
        # Should detect email
        self.assertTrue(self.phi_protection.is_phi_data("Contact: test@example.com"))
        
        # Should detect phone
        self.assertTrue(self.phi_protection.is_phi_data("Call 555-123-4567"))
        
        # Should detect SSN
        self.assertTrue(self.phi_protection.is_phi_data("SSN: 123-45-6789"))
        
        # Should not detect non-PHI
        self.assertFalse(self.phi_protection.is_phi_data("Study NCT12345"))

if __name__ == '__main__':
    unittest.main()
