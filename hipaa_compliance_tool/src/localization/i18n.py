# src/localization/i18n.py
import json
import os
from typing import Dict, Any, Optional
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class LocalizationManager:
    """Handle internationalization and localization"""
    
    def __init__(self, default_locale: str = "en_US"):
        self.default_locale = default_locale
        self.current_locale = default_locale
        self.translations = {}
        self.locales_dir = Path(__file__).parent / "locales"
        self.locales_dir.mkdir(exist_ok=True)
        
        # Load default translations
        self._load_translations()
    
    def _load_translations(self):
        """Load translation files"""
        try:
            # Load all available locale files
            for locale_file in self.locales_dir.glob("*.json"):
                locale_code = locale_file.stem
                with open(locale_file, 'r', encoding='utf-8') as f:
                    self.translations[locale_code] = json.load(f)
            
            # Create default English translations if not exists
            if 'en_US' not in self.translations:
                self._create_default_translations()
                
        except Exception as e:
            logger.error(f"Error loading translations: {e}")
            self._create_default_translations()
    
    def _create_default_translations(self):
        """Create default English translations"""
        default_translations = {
            # General
            "app_name": "HIPAA Compliance Tool",
            "welcome": "Welcome to HIPAA Compliance Tool",
            "error": "Error",
            "success": "Success",
            "warning": "Warning",
            "info": "Information",
            
            # Authentication
            "login": "Login",
            "logout": "Logout",
            "username": "Username",
            "password": "Password",
            "email": "Email",
            "login_success": "Login successful",
            "login_failed": "Login failed",
            "invalid_credentials": "Invalid username or password",
            "access_denied": "Access denied",
            "session_expired": "Session expired",
            
            # User Management
            "user_created": "User created successfully",
            "user_updated": "User updated successfully",
            "user_deleted": "User deleted successfully",
            "user_suspended": "User suspended",
            "role_updated": "User role updated",
            "insufficient_permissions": "Insufficient permissions",
            
            # Compliance
            "compliance_check": "Compliance Check",
            "compliance_report": "Compliance Report",
            "compliant": "Compliant",
            "non_compliant": "Non-Compliant",
            "warning_level": "Warning",
            "unknown_status": "Unknown",
            "compliance_score": "Compliance Score",
            "recommendations": "Recommendations",
            
            # Email
            "email_sent": "Email sent successfully",
            "email_failed": "Failed to send email",
            "email_subject_compliance": "HIPAA Compliance Assessment - {study_id}",
            "email_body_compliance": """Dear Principal Investigator,

We have completed a HIPAA compliance assessment for your clinical study:

Study ID: {study_id}
Study Title: {study_title}
Compliance Status: {compliance_status}
Compliance Score: {compliance_score}/100

{recommendations}

Please review the attached compliance report and address any identified issues.

Best regards,
HIPAA Compliance Team""",
            
            # API Messages
            "api_error": "API request failed",
            "api_timeout": "API request timed out",
            "api_rate_limit": "API rate limit exceeded",
            "data_processing_error": "Error processing data",
            
            # Validation Messages
            "required_field": "This field is required",
            "invalid_email": "Invalid email address",
            "invalid_format": "Invalid format",
            "data_encrypted": "Data encrypted successfully",
            "data_decrypted": "Data decrypted successfully",
            
            # Reports
            "report_generated": "Report generated successfully",
            "report_error": "Error generating report",
            "export_csv": "Export to CSV",
            "export_pdf": "Export to PDF",
            
            # Settings
            "settings": "Settings",
            "language": "Language",
            "timezone": "Timezone",
            "notifications": "Notifications",
            "security": "Security",
            
            # Audit
            "audit_log": "Audit Log",
            "user_action": "User Action",
            "timestamp": "Timestamp",
            "ip_address": "IP Address",
            "data_access": "Data Access",
            "authentication_attempt": "Authentication Attempt",
            
            # Errors
            "file_not_found": "File not found",
            "permission_denied": "Permission denied",
            "invalid_request": "Invalid request",
            "server_error": "Internal server error",
            "network_error": "Network error",
            "timeout_error": "Request timeout"
        }
        
        self.translations['en_US'] = default_translations
        self._save_translations('en_US')
    
    def _save_translations(self, locale: str):
        """Save translations to file"""
        try:
            locale_file = self.locales_dir / f"{locale}.json"
            with open(locale_file, 'w', encoding='utf-8') as f:
                json.dump(self.translations[locale], f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Error saving translations for {locale}: {e}")
    
    def set_locale(self, locale: str) -> bool:
        """Set current locale"""
        if locale in self.translations:
            self.current_locale = locale
            logger.info(f"Locale set to {locale}")
            return True
        else:
            logger.warning(f"Locale {locale} not available")
            return False
    
    def get_available_locales(self) -> Dict[str, str]:
        """Get available locales with their display names"""
        locale_names = {
            'en_US': 'English (US)',
            'es_ES': 'Español (España)',
            'fr_FR': 'Français (France)',
            'de_DE': 'Deutsch (Deutschland)',
            'it_IT': 'Italiano (Italia)',
            'pt_BR': 'Português (Brasil)',
            'ja_JP': '日本語 (日本)',
            'ko_KR': '한국어 (대한민국)',
            'zh_CN': '中文 (中国)',
            'ru_RU': 'Русский (Россия)'
        }
        
        available = {}
        for locale in self.translations.keys():
            available[locale] = locale_names.get(locale, locale)
        
        return available
    
    def translate(self, key: str, locale: str = None, **kwargs) -> str:
        """Translate a key to the specified locale"""
        if locale is None:
            locale = self.current_locale
        
        # Try current locale first
        if locale in self.translations and key in self.translations[locale]:
            translation = self.translations[locale][key]
        # Fall back to default locale
        elif self.default_locale in self.translations and key in self.translations[self.default_locale]:
            translation = self.translations[self.default_locale][key]
        # Return key if no translation found
        else:
            logger.warning(f"Translation not found for key '{key}' in locale '{locale}'")
            translation = key
        
        # Format with provided kwargs
        try:
            return translation.format(**kwargs)
        except KeyError as e:
            logger.warning(f"Missing format parameter {e} for key '{key}'")
            return translation
    
    def add_translation(self, locale: str, key: str, value: str):
        """Add or update a translation"""
        if locale not in self.translations:
            self.translations[locale] = {}
        
        self.translations[locale][key] = value
        self._save_translations(locale)
    
    def create_locale_template(self, locale: str) -> bool:
        """Create a new locale template based on default locale"""
        if locale in self.translations:
            logger.warning(f"Locale {locale} already exists")
            return False
        
        # Copy structure from default locale
        if self.default_locale in self.translations:
            self.translations[locale] = {}
            for key in self.translations[self.default_locale]:
                self.translations[locale][key] = f"[{locale}] {key}"  # Placeholder
            
            self._save_translations(locale)
            logger.info(f"Created locale template for {locale}")
            return True
        
        return False

# Global localization manager
i18n = LocalizationManager()

# Convenience function
def _(key: str, **kwargs) -> str:
    """Shorthand translation function"""
    return i18n.translate(key, **kwargs)
