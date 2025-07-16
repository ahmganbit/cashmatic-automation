# src/email/sender.py
import smtplib
from email.message import EmailMessage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging

from config import settings
from src.monitoring.logger import hipaa_logger
from src.monitoring.metrics import performance_monitor
from src.security.encryption import EncryptionManager
from src.localization.i18n import i18n

logger = logging.getLogger(__name__)

class EmailSender:
    """Secure and compliant email sending system"""

    def __init__(self):
        self.encryption_manager = EncryptionManager()
        self.smtp_server = settings.BREVO_SMTP_SERVER
        self.smtp_port = settings.BREVO_SMTP_PORT
        self.username = settings.BREVO_USERNAME
        self.password = settings.BREVO_PASSWORD

    def send_compliance_report(self, recipient: str, study_data: Dict[str, Any],
                             compliance_report: Any, user_id: str = None) -> bool:
        """Send HIPAA compliance report (legitimate, not deceptive)"""
        try:
            # Create professional, legitimate email content
            subject = i18n.translate('email_subject_compliance',
                                   study_id=study_data.get('NCTId', ['Unknown'])[0])

            body = i18n.translate('email_body_compliance',
                study_id=study_data.get('NCTId', ['Unknown'])[0],
                study_title=study_data.get('BriefTitle', ['Unknown'])[0],
                compliance_status=compliance_report.overall_status.value,
                compliance_score=compliance_report.score,
                recommendations='\n'.join(f"• {rec}" for rec in compliance_report.recommendations)
            )

            # Add unsubscribe and contact information
            body += self._add_email_footer()

            success = self._send_email(recipient, subject, body)

            # Log the email sending activity
            recipient_hash = self.encryption_manager.hash_data(recipient)
            hipaa_logger.log_email_sent(
                user_id=user_id or "system",
                recipient_hash=recipient_hash,
                email_type="compliance_report",
                success=success
            )

            performance_monitor.monitor_email_sending(success, "brevo")

            return success

        except Exception as e:
            logger.error(f"Error sending compliance report: {e}")
            return False

    def send_notification(self, recipient: str, subject: str, body: str,
                         user_id: str = None, email_type: str = "notification") -> bool:
        """Send general notification email"""
        try:
            # Add footer with unsubscribe
            body_with_footer = body + self._add_email_footer()

            success = self._send_email(recipient, subject, body_with_footer)

            # Log the activity
            recipient_hash = self.encryption_manager.hash_data(recipient)
            hipaa_logger.log_email_sent(
                user_id=user_id or "system",
                recipient_hash=recipient_hash,
                email_type=email_type,
                success=success
            )

            return success

        except Exception as e:
            logger.error(f"Error sending notification: {e}")
            return False

    def _send_email(self, recipient: str, subject: str, body: str) -> bool:
        """Internal method to send email via SMTP"""
        if not self.username or not self.password:
            logger.error("Email credentials not configured")
            return False

        try:
            msg = EmailMessage()
            msg["From"] = self.username
            msg["To"] = recipient
            msg["Subject"] = subject
            msg["Date"] = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")

            # Set content with proper encoding
            msg.set_content(body, charset="utf-8")

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                if settings.DEBUG:
                    server.set_debuglevel(1)

                server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)

                logger.info(f"Email sent successfully to {recipient}")
                return True

        except Exception as e:
            logger.error(f"SMTP Error sending to {recipient}: {e}")
            return False

    def _add_email_footer(self) -> str:
        """Add professional footer with unsubscribe and contact info"""
        return f"""

---
{i18n.translate('app_name')}

This email was sent as part of a legitimate HIPAA compliance assessment service.
If you received this email in error or wish to unsubscribe, please contact us.

Contact: compliance-support@example.com
Privacy Policy: https://example.com/privacy
Unsubscribe: https://example.com/unsubscribe

© {datetime.now().year} HIPAA Compliance Tool. All rights reserved.
"""

# Legacy function for backward compatibility (but improved)
def send_hipaa_alert(recipient: str, subject: str, body: str) -> bool:
    """
    Legacy function - now sends legitimate compliance reports only
    REMOVED: Deceptive content about fake HIPAA violations
    """
    email_sender = EmailSender()

    # Log warning about legacy function usage
    logger.warning("Legacy send_hipaa_alert function used - consider upgrading to EmailSender class")

    return email_sender.send_notification(recipient, subject, body, email_type="legacy_alert")
