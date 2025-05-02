# Configuration Settings
# config/settings.py
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.parent
load_dotenv(BASE_DIR / ".env")

# Email Configuration
BREVO_SMTP_SERVER = "smtp-relay.brevo.com"
BREVO_SMTP_PORT = 587
BREVO_USERNAME = os.getenv("BREVO_USERNAME")
BREVO_PASSWORD = os.getenv("BREVO_PASSWORD")

# Payment Configuration
FLUTTERWAVE_LINK = "https://flutterwave.com/pay/v3hr7tv6uhkp"

# API Configuration
CLINICAL_TRIALS_API = {
    'endpoint': "https://classic.clinicaltrials.gov/api/query/study_fields",
    'default_params': {
        'expr': 'AI AND HIPAA',
        'fields': 'NCTId,BriefTitle,OverallStatus,CentralContactEMail,OverallOfficialAffiliation',
        'fmt': 'json'
    }
}

# Campaign Settings
MAX_RESULTS = 50
BATCH_SIZE = 5
DELAY_BETWEEN_BATCHES = 2  # FIXED SPELLING HERE
