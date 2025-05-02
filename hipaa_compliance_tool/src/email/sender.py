# src/email/sender.py
import smtplib
from email.message import EmailMessage
from config import settings

def send_hipaa_alert(recipient, subject, body):
    msg = EmailMessage()
    
    # Brevo requires strict RFC-5322 formatting
    msg["From"] = settings.BREVO_USERNAME  # Remove display name temporarily
    msg["To"] = recipient
    msg["Subject"] = subject
    
    # Force ASCII encoding explicitly
    msg.set_content(body, cte="7bit", charset="us-ascii")  # ASCII-only content
    
    try:
        with smtplib.SMTP(settings.BREVO_SMTP_SERVER, settings.BREVO_SMTP_PORT) as server:
            server.set_debuglevel(1)  # Enable debug logs
            server.starttls()
            server.login(settings.BREVO_USERNAME, settings.BREVO_PASSWORD)
            server.send_message(msg)
            return True
    except Exception as e:
        print(f"Brevo Error ({recipient}): {str(e)}")
        return False
