# scripts/test_email.py
import sys
import os
from pathlib import Path

# Add project root to Python path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.append(str(PROJECT_ROOT))

# Import after setting the path
from src.email.sender import send_hipaa_alert  # Explicit import

if __name__ == "__main__":
    result = send_hipaa_alert(
        recipient="your-real-email@gmail.com",  # Replace with your email
        subject="Test",
        body="This is a test"
    )
    print("✅ Success!" if result else "❌ Failed!")
