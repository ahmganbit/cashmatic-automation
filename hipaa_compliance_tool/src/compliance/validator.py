# src/compliance/validator.py
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class ComplianceLevel(Enum):
    """HIPAA compliance levels"""
    COMPLIANT = "compliant"
    WARNING = "warning"
    NON_COMPLIANT = "non_compliant"
    UNKNOWN = "unknown"

@dataclass
class ComplianceIssue:
    """Represents a compliance issue"""
    rule_id: str
    severity: ComplianceLevel
    description: str
    recommendation: str
    affected_field: str = None
    details: Dict[str, Any] = None

@dataclass
class ComplianceReport:
    """Compliance assessment report"""
    study_id: str
    overall_status: ComplianceLevel
    issues: List[ComplianceIssue]
    assessment_date: datetime
    recommendations: List[str]
    score: float  # 0-100 compliance score

class HIPAAComplianceValidator:
    """Validate HIPAA compliance for clinical trials"""
    
    def __init__(self):
        self.rules = self._load_compliance_rules()
    
    def _load_compliance_rules(self) -> Dict[str, Dict]:
        """Load HIPAA compliance rules"""
        return {
            'data_encryption': {
                'description': 'PHI must be encrypted at rest and in transit',
                'severity': ComplianceLevel.NON_COMPLIANT,
                'check_function': self._check_data_encryption
            },
            'access_controls': {
                'description': 'Proper access controls must be in place',
                'severity': ComplianceLevel.NON_COMPLIANT,
                'check_function': self._check_access_controls
            },
            'audit_logging': {
                'description': 'All PHI access must be logged',
                'severity': ComplianceLevel.NON_COMPLIANT,
                'check_function': self._check_audit_logging
            },
            'data_minimization': {
                'description': 'Only necessary PHI should be collected',
                'severity': ComplianceLevel.WARNING,
                'check_function': self._check_data_minimization
            },
            'consent_management': {
                'description': 'Patient consent must be properly managed',
                'severity': ComplianceLevel.NON_COMPLIANT,
                'check_function': self._check_consent_management
            },
            'data_retention': {
                'description': 'PHI retention policies must be enforced',
                'severity': ComplianceLevel.WARNING,
                'check_function': self._check_data_retention
            },
            'breach_notification': {
                'description': 'Breach notification procedures must be in place',
                'severity': ComplianceLevel.WARNING,
                'check_function': self._check_breach_notification
            }
        }
    
    def validate_study_compliance(self, study_data: Dict[str, Any]) -> ComplianceReport:
        """Validate HIPAA compliance for a clinical study"""
        study_id = study_data.get('NCTId', ['Unknown'])[0]
        issues = []
        
        logger.info(f"Starting compliance validation for study {study_id}")
        
        # Run all compliance checks
        for rule_id, rule_config in self.rules.items():
            try:
                rule_issues = rule_config['check_function'](study_data)
                issues.extend(rule_issues)
            except Exception as e:
                logger.error(f"Error checking rule {rule_id}: {e}")
                issues.append(ComplianceIssue(
                    rule_id=rule_id,
                    severity=ComplianceLevel.UNKNOWN,
                    description=f"Unable to validate {rule_config['description']}",
                    recommendation="Manual review required",
                    details={'error': str(e)}
                ))
        
        # Calculate overall status and score
        overall_status, score = self._calculate_overall_status(issues)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(issues)
        
        report = ComplianceReport(
            study_id=study_id,
            overall_status=overall_status,
            issues=issues,
            assessment_date=datetime.utcnow(),
            recommendations=recommendations,
            score=score
        )
        
        logger.info(f"Compliance validation completed for {study_id}: {overall_status.value} (score: {score})")
        return report
    
    def _check_data_encryption(self, study_data: Dict[str, Any]) -> List[ComplianceIssue]:
        """Check if data encryption is properly implemented"""
        issues = []
        
        # Check if emails are encrypted
        if 'CentralContactEMail' in study_data:
            emails = study_data['CentralContactEMail']
            for email in emails:
                if self._is_plaintext_email(email):
                    issues.append(ComplianceIssue(
                        rule_id='data_encryption',
                        severity=ComplianceLevel.NON_COMPLIANT,
                        description='Email addresses stored in plaintext',
                        recommendation='Encrypt all email addresses before storage',
                        affected_field='CentralContactEMail',
                        details={'email_count': len(emails)}
                    ))
                    break
        
        return issues
    
    def _check_access_controls(self, study_data: Dict[str, Any]) -> List[ComplianceIssue]:
        """Check access control implementation"""
        issues = []
        
        # This would check if proper access controls are in place
        # For now, we'll assume they need to be implemented
        issues.append(ComplianceIssue(
            rule_id='access_controls',
            severity=ComplianceLevel.WARNING,
            description='Access controls need verification',
            recommendation='Implement role-based access controls with authentication',
            details={'requires_implementation': True}
        ))
        
        return issues
    
    def _check_audit_logging(self, study_data: Dict[str, Any]) -> List[ComplianceIssue]:
        """Check audit logging implementation"""
        issues = []
        
        # Check if audit logging is properly configured
        issues.append(ComplianceIssue(
            rule_id='audit_logging',
            severity=ComplianceLevel.WARNING,
            description='Audit logging needs verification',
            recommendation='Ensure all PHI access is logged with timestamps and user identification',
            details={'requires_verification': True}
        ))
        
        return issues
    
    def _check_data_minimization(self, study_data: Dict[str, Any]) -> List[ComplianceIssue]:
        """Check data minimization practices"""
        issues = []
        
        # Check for potentially unnecessary PHI fields
        sensitive_fields = [
            'OverallOfficialName',
            'LocationContactName',
            'LocationContactPhone',
            'LocationContactEMail'
        ]
        
        present_sensitive_fields = [field for field in sensitive_fields if field in study_data]
        
        if present_sensitive_fields:
            issues.append(ComplianceIssue(
                rule_id='data_minimization',
                severity=ComplianceLevel.WARNING,
                description='Potentially unnecessary PHI fields present',
                recommendation='Review if all collected PHI is necessary for the study purpose',
                details={'sensitive_fields': present_sensitive_fields}
            ))
        
        return issues
    
    def _check_consent_management(self, study_data: Dict[str, Any]) -> List[ComplianceIssue]:
        """Check consent management"""
        issues = []
        
        # Check if consent information is available
        if 'ConsentRequired' not in study_data and 'ConsentDocument' not in study_data:
            issues.append(ComplianceIssue(
                rule_id='consent_management',
                severity=ComplianceLevel.WARNING,
                description='Consent management information not found',
                recommendation='Ensure proper consent procedures are documented and followed',
                details={'missing_consent_info': True}
            ))
        
        return issues
    
    def _check_data_retention(self, study_data: Dict[str, Any]) -> List[ComplianceIssue]:
        """Check data retention policies"""
        issues = []
        
        # Check study completion date for retention policy
        if 'StudyFirstSubmitDate' in study_data:
            try:
                submit_date = datetime.strptime(study_data['StudyFirstSubmitDate'][0], '%B %d, %Y')
                years_old = (datetime.now() - submit_date).days / 365.25
                
                if years_old > 6:  # HIPAA generally requires 6 years retention
                    issues.append(ComplianceIssue(
                        rule_id='data_retention',
                        severity=ComplianceLevel.WARNING,
                        description='Study data may exceed retention period',
                        recommendation='Review data retention policy and consider secure disposal',
                        details={'years_old': years_old}
                    ))
            except (ValueError, KeyError, IndexError):
                pass
        
        return issues
    
    def _check_breach_notification(self, study_data: Dict[str, Any]) -> List[ComplianceIssue]:
        """Check breach notification procedures"""
        issues = []
        
        # This would check if breach notification procedures are in place
        issues.append(ComplianceIssue(
            rule_id='breach_notification',
            severity=ComplianceLevel.WARNING,
            description='Breach notification procedures need verification',
            recommendation='Ensure breach notification procedures are documented and tested',
            details={'requires_documentation': True}
        ))
        
        return issues
    
    def _is_plaintext_email(self, email: str) -> bool:
        """Check if email appears to be in plaintext"""
        # Simple check - if it looks like a normal email, it's probably plaintext
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(email_pattern, email))
    
    def _calculate_overall_status(self, issues: List[ComplianceIssue]) -> Tuple[ComplianceLevel, float]:
        """Calculate overall compliance status and score"""
        if not issues:
            return ComplianceLevel.COMPLIANT, 100.0
        
        # Count issues by severity
        non_compliant = sum(1 for issue in issues if issue.severity == ComplianceLevel.NON_COMPLIANT)
        warnings = sum(1 for issue in issues if issue.severity == ComplianceLevel.WARNING)
        unknown = sum(1 for issue in issues if issue.severity == ComplianceLevel.UNKNOWN)
        
        # Calculate score (100 - penalties)
        score = 100.0
        score -= non_compliant * 30  # Major penalty for non-compliance
        score -= warnings * 10       # Minor penalty for warnings
        score -= unknown * 5         # Small penalty for unknown status
        
        score = max(0.0, score)  # Don't go below 0
        
        # Determine overall status
        if non_compliant > 0:
            overall_status = ComplianceLevel.NON_COMPLIANT
        elif warnings > 0 or unknown > 0:
            overall_status = ComplianceLevel.WARNING
        else:
            overall_status = ComplianceLevel.COMPLIANT
        
        return overall_status, score
    
    def _generate_recommendations(self, issues: List[ComplianceIssue]) -> List[str]:
        """Generate prioritized recommendations"""
        recommendations = []
        
        # Group by severity
        critical_issues = [i for i in issues if i.severity == ComplianceLevel.NON_COMPLIANT]
        warning_issues = [i for i in issues if i.severity == ComplianceLevel.WARNING]
        
        if critical_issues:
            recommendations.append("CRITICAL: Address non-compliant issues immediately")
            for issue in critical_issues[:3]:  # Top 3 critical issues
                recommendations.append(f"- {issue.recommendation}")
        
        if warning_issues:
            recommendations.append("Review and address warning-level issues")
            for issue in warning_issues[:2]:  # Top 2 warnings
                recommendations.append(f"- {issue.recommendation}")
        
        if not issues:
            recommendations.append("Study appears to be HIPAA compliant")
        
        return recommendations
