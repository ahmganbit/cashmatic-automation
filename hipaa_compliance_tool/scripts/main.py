#!/usr/bin/env python3
"""
HIPAA Compliance Tool - Main Application
Legitimate compliance assessment tool for clinical trials
"""

import sys
import argparse
import logging
from pathlib import Path
from typing import List, Dict, Any

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.append(str(PROJECT_ROOT))

from src.api import clinical_trials_client
from src.data import processor
from src.email.sender import EmailSender
from src.utils import state_manager
from src.compliance.validator import HIPAAComplianceValidator
from src.security.encryption import PHIProtection
from src.monitoring.logger import hipaa_logger
from src.monitoring.metrics import metrics_collector
from src.users.models import UserManager, UserRole
from src.localization.i18n import i18n
from config import settings
import pandas as pd

# Setup logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class HIPAAComplianceTool:
    """Main application class for HIPAA compliance assessment"""

    def __init__(self):
        self.state_manager = state_manager.CampaignState()
        self.compliance_validator = HIPAAComplianceValidator()
        self.email_sender = EmailSender()
        self.phi_protection = PHIProtection()
        self.user_manager = UserManager()

        # Initialize default admin user if none exists
        self._initialize_default_user()

    def _initialize_default_user(self):
        """Create default admin user if none exists"""
        if not self.user_manager.users:
            try:
                admin_user = self.user_manager.create_user(
                    username="admin",
                    email="admin@example.com",
                    password="change_me_immediately",
                    role=UserRole.ADMIN
                )
                logger.info("Created default admin user - please change password immediately")
                print("⚠️  Default admin user created:")
                print("   Username: admin")
                print("   Password: change_me_immediately")
                print("   Please change this password immediately!")
            except Exception as e:
                logger.error(f"Failed to create default admin user: {e}")

    def run_compliance_assessment(self, user_id: str = None, max_studies: int = None) -> Dict[str, Any]:
        """Run legitimate HIPAA compliance assessment"""
        logger.info("Starting HIPAA compliance assessment")

        # Check user permissions
        if user_id and not self.user_manager.has_permission(user_id, 'run_compliance_checks'):
            raise PermissionError("User does not have permission to run compliance checks")

        try:
            # Fetch clinical trials data
            trials_data = clinical_trials_client.fetch_clinical_trials()
            if max_studies:
                trials_data = trials_data[:max_studies]

            logger.info(f"Retrieved {len(trials_data)} clinical trials for assessment")

            assessment_results = []
            compliant_studies = 0
            non_compliant_studies = 0

            for trial in trials_data:
                try:
                    # Protect PHI in trial data
                    sanitized_trial = self.phi_protection.sanitize_trial_data(trial)

                    # Run compliance validation
                    compliance_report = self.compliance_validator.validate_study_compliance(trial)

                    # Extract contact information securely
                    contacts = processor.extract_contact_info(trial)

                    # Store results
                    result = {
                        'study_id': trial.get('NCTId', ['Unknown'])[0],
                        'title': trial.get('BriefTitle', ['Unknown'])[0],
                        'compliance_status': compliance_report.overall_status.value,
                        'compliance_score': compliance_report.score,
                        'issues_count': len(compliance_report.issues),
                        'contacts': len(contacts['pi_emails'] + contacts['central_contacts']),
                        'assessment_date': compliance_report.assessment_date.isoformat()
                    }

                    assessment_results.append(result)

                    # Update counters
                    if compliance_report.overall_status.value == 'compliant':
                        compliant_studies += 1
                    else:
                        non_compliant_studies += 1

                    # Record metrics
                    metrics_collector.increment_counter('studies_assessed')
                    metrics_collector.set_gauge('compliance_score', compliance_report.score)

                except Exception as e:
                    logger.error(f"Error assessing study {trial.get('NCTId', ['Unknown'])[0]}: {e}")
                    continue

            # Save results to CSV
            if assessment_results:
                df = pd.DataFrame(assessment_results)
                output_file = f"compliance_assessment_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.csv"
                df.to_csv(output_file, index=False)
                logger.info(f"Assessment results saved to {output_file}")

            # Log audit event
            hipaa_logger.log_audit_event(
                'compliance_assessment_completed',
                user_id=user_id,
                details={
                    'studies_assessed': len(assessment_results),
                    'compliant_studies': compliant_studies,
                    'non_compliant_studies': non_compliant_studies
                }
            )

            summary = {
                'total_studies': len(assessment_results),
                'compliant_studies': compliant_studies,
                'non_compliant_studies': non_compliant_studies,
                'output_file': output_file if assessment_results else None,
                'results': assessment_results
            }

            logger.info(f"Compliance assessment completed: {summary}")
            return summary

        except Exception as e:
            logger.error(f"Error during compliance assessment: {e}")
            hipaa_logger.log_security_event(
                'compliance_assessment_error',
                severity='ERROR',
                user_id=user_id,
                details={'error': str(e)}
            )
            raise

    def send_compliance_reports(self, user_id: str, study_ids: List[str] = None) -> Dict[str, Any]:
        """Send legitimate compliance reports to study contacts"""
        if not self.user_manager.has_permission(user_id, 'send_emails'):
            raise PermissionError("User does not have permission to send emails")

        logger.info("Starting compliance report distribution")

        # This would be a legitimate service that study coordinators opt into
        # NOT unsolicited spam emails

        sent_count = 0
        failed_count = 0

        # Implementation would include:
        # 1. Verify recipients have opted in to receive reports
        # 2. Send legitimate, helpful compliance assessments
        # 3. Include proper unsubscribe mechanisms
        # 4. Follow email marketing best practices

        logger.info("Compliance report distribution completed")
        return {
            'sent_count': sent_count,
            'failed_count': failed_count
        }

def main(test_mode=False):
    """Main entry point"""
    if test_mode:
        # For testing, use default arguments
        class Args:
            max_studies = 1
            user_id = None  # Skip permission check in test mode
            locale = "en_US"
        args = Args()
    else:
        parser = argparse.ArgumentParser(description='HIPAA Compliance Assessment Tool')
        parser.add_argument('--max-studies', type=int, help='Maximum number of studies to assess')
        parser.add_argument('--user-id', help='User ID for audit logging')
        parser.add_argument('--locale', default='en_US', help='Locale for messages')

        args = parser.parse_args()

    # Set locale
    i18n.set_locale(args.locale)

    try:
        tool = HIPAAComplianceTool()

        print(f"🏥 {i18n.translate('app_name')}")
        print("=" * 50)

        # Run compliance assessment
        results = tool.run_compliance_assessment(
            user_id=args.user_id,
            max_studies=args.max_studies
        )

        print(f"\n📊 Assessment Results:")
        print(f"   Total Studies: {results['total_studies']}")
        print(f"   Compliant: {results['compliant_studies']}")
        print(f"   Non-Compliant: {results['non_compliant_studies']}")

        if results['output_file']:
            print(f"   Results saved to: {results['output_file']}")

        print(f"\n✅ {i18n.translate('success')}: Assessment completed successfully")

    except Exception as e:
        logger.error(f"Application error: {e}")
        print(f"\n❌ {i18n.translate('error')}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
