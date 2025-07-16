# Configuration Settings
# config/settings.py
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.parent
load_dotenv(BASE_DIR / ".env" / ".env")

# Application Configuration
APP_ENV = os.getenv("APP_ENV", "development")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# Security Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "your-encryption-key-change-in-production")
SESSION_SECRET = os.getenv("SESSION_SECRET", "your-session-secret-change-in-production")

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///hipaa_compliance.db")
DATABASE_ENCRYPTION_KEY = os.getenv("DATABASE_ENCRYPTION_KEY")

# Email Configuration
BREVO_SMTP_SERVER = "smtp-relay.brevo.com"
BREVO_SMTP_PORT = 587
BREVO_USERNAME = os.getenv("BREVO_USERNAME")
BREVO_PASSWORD = os.getenv("BREVO_PASSWORD")

# Rate Limiting Configuration
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "10"))
RATE_LIMIT_PER_HOUR = int(os.getenv("RATE_LIMIT_PER_HOUR", "100"))

# API Configuration
CLINICAL_TRIALS_API = {
    'endpoint': "https://classic.clinicaltrials.gov/api/query/study_fields",
    'default_params': {
        'expr': 'clinical trial compliance',  # Removed deceptive HIPAA search
        'fields': 'NCTId,BriefTitle,OverallStatus,CentralContactEMail,OverallOfficialAffiliation,StudyFirstSubmitDate',
        'fmt': 'json'
    },
    'timeout': 15,
    'max_retries': 3
}

# Campaign Settings
MAX_RESULTS = 50
BATCH_SIZE = 5
DELAY_BETWEEN_BATCHES = 2

# Monitoring Configuration
SENTRY_DSN = os.getenv("SENTRY_DSN")
METRICS_ENABLED = os.getenv("METRICS_ENABLED", "true").lower() == "true"

# Localization
DEFAULT_LOCALE = "en_US"
SUPPORTED_LOCALES = ["en_US", "es_ES", "fr_FR", "de_DE"]
