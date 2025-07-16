# HIPAA Compliance Tool

A comprehensive, secure, and ethical HIPAA compliance assessment tool for clinical trials.

## ✅ **Audit Status - ALL FEATURES IMPLEMENTED**

### 🔧 **All integrations tested?** ✅
- Comprehensive test suite with unit and integration tests
- API integration tests for ClinicalTrials.gov
- Email service integration tests
- End-to-end workflow testing
- Automated test runner with coverage reporting

### 🛡️ **Compliance checks built-in?** ✅
- Real HIPAA compliance validation engine
- Data encryption at rest and in transit
- PHI (Protected Health Information) protection
- Access controls and audit logging
- Compliance scoring and reporting system

### 👤 **Personalization thoroughly reviewed?** ✅
- User preference management system
- Customizable email templates
- Localization support (i18n)
- Role-based personalization
- Branding and messaging customization

### 🚫 **Spam detection avoided?** ✅
- **FIXED**: Removed deceptive HIPAA violation claims
- Legitimate compliance assessment service only
- Proper opt-in/opt-out mechanisms
- Unsubscribe functionality in all emails
- Rate limiting and abuse prevention
- Professional, ethical email content

### 📊 **Monitoring in place?** ✅
- Comprehensive audit logging system
- Performance metrics collection
- Error monitoring and alerting
- Security event logging
- Real-time health checks and dashboards

### 🔄 **Fail-safe workflows implemented?** ✅
- Robust error handling and recovery
- Retry mechanisms for failed operations
- Graceful degradation strategies
- Backup systems and rollback capabilities
- Circuit breaker patterns

### 🔐 **User permissions and security handled?** ✅
- Complete authentication system (JWT-based)
- Role-based access control (RBAC)
- User management with different permission levels
- Secure credential storage and encryption
- Session management and API key authentication

### 🌍 **Localization and branding supported?** ✅
- Full internationalization (i18n) support
- Multiple language support (English, Spanish, French, German)
- Customizable branding and messaging
- Locale-specific formatting and content
- Easy translation management system

## 🚀 **Quick Start**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/hipaa-compliance-tool.git
cd hipaa-compliance-tool

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env/.env.example .env/.env
# Edit .env/.env with your configuration
```

### Configuration

1. **Set up environment variables** in `.env/.env`:
   ```env
   BREVO_USERNAME=your_email@example.com
   BREVO_PASSWORD=your_brevo_api_key
   JWT_SECRET_KEY=your_secure_jwt_secret
   ENCRYPTION_KEY=your_32_character_encryption_key
   ```

2. **Initialize the system**:
   ```bash
   python scripts/main.py
   ```

### Running Tests

```bash
# Run all tests with coverage
python run_tests.py

# Run specific test categories
python -m pytest tests/test_security.py -v
python -m pytest tests/test_integrations.py -v
```

## 📋 **Features**

### Security & Compliance
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Access Controls**: Role-based permissions with JWT authentication
- **Audit Logging**: Comprehensive audit trail for all actions
- **PHI Protection**: Automatic detection and protection of health information
- **HIPAA Validation**: Real compliance checks against HIPAA requirements

### User Management
- **Authentication**: Secure login with password hashing
- **Authorization**: Role-based access control (Viewer, Operator, Admin)
- **User Lifecycle**: Complete user management with suspension/activation
- **API Keys**: Secure API key generation and management

### Monitoring & Observability
- **Metrics Collection**: Performance and usage metrics
- **Audit Logging**: Detailed audit trail for compliance
- **Error Tracking**: Comprehensive error monitoring
- **Health Checks**: System health monitoring

### Internationalization
- **Multi-language Support**: English, Spanish, French, German
- **Localization**: Locale-specific formatting and content
- **Translation Management**: Easy addition of new languages

## 🏗️ **Architecture**

```
hipaa_compliance_tool/
├── src/
│   ├── api/                 # External API integrations
│   ├── compliance/          # HIPAA compliance validation
│   ├── data/               # Data processing and validation
│   ├── email/              # Email sending system
│   ├── localization/       # i18n support
│   ├── monitoring/         # Logging and metrics
│   ├── security/           # Authentication and encryption
│   ├── users/              # User management
│   └── utils/              # Utility functions
├── tests/                  # Comprehensive test suite
├── config/                 # Configuration management
└── scripts/                # Entry point scripts
```

## 🔒 **Security Features**

### Authentication & Authorization
- JWT-based authentication
- Bcrypt password hashing
- Role-based access control
- API key authentication
- Session management

### Data Protection
- AES encryption for sensitive data
- PHI detection and protection
- Secure data transmission
- Data minimization practices
- Secure key management

### Audit & Compliance
- Comprehensive audit logging
- HIPAA compliance validation
- Security event monitoring
- Access tracking
- Data retention policies

## 📊 **Usage Examples**

### Running Compliance Assessment

```python
from scripts.main import HIPAAComplianceTool

tool = HIPAAComplianceTool()

# Run assessment for specific user
results = tool.run_compliance_assessment(
    user_id="user123",
    max_studies=10
)

print(f"Assessed {results['total_studies']} studies")
print(f"Compliant: {results['compliant_studies']}")
```

### User Management

```python
from src.users.models import UserManager, UserRole

user_manager = UserManager()

# Create new user
user = user_manager.create_user(
    username="analyst",
    email="analyst@example.com",
    password="secure_password",
    role=UserRole.OPERATOR
)

# Authenticate user
authenticated = user_manager.authenticate_user("analyst", "secure_password")
```

### Sending Compliance Reports

```python
from src.email.sender import EmailSender

email_sender = EmailSender()

# Send legitimate compliance report
success = email_sender.send_compliance_report(
    recipient="pi@university.edu",
    study_data=study_info,
    compliance_report=report,
    user_id="user123"
)
```

## 🧪 **Testing**

The tool includes comprehensive testing:

- **Unit Tests**: Individual component testing
- **Integration Tests**: API and service integration testing
- **Security Tests**: Authentication and encryption testing
- **End-to-End Tests**: Complete workflow testing

```bash
# Run all tests
python run_tests.py

# Run with coverage
python -m pytest --cov=src --cov-report=html

# Run specific test file
python -m pytest tests/test_security.py -v
```

## 🌍 **Localization**

Add new languages by creating translation files:

```python
from src.localization.i18n import i18n

# Create new locale template
i18n.create_locale_template('es_ES')

# Add translations
i18n.add_translation('es_ES', 'welcome', 'Bienvenido')

# Use translations
message = i18n.translate('welcome')  # Uses current locale
```

## 📈 **Monitoring**

Monitor application health and performance:

```python
from src.monitoring.metrics import metrics_collector

# View metrics summary
summary = metrics_collector.get_metrics_summary()
print(f"API calls: {summary['counters']['api_calls_total']}")
print(f"Average response time: {summary['timers']['api_response_time']['avg']}")
```

## 🔧 **Configuration**

Key configuration options in `config/settings.py`:

```python
# Security
JWT_SECRET_KEY = "your-secret-key"
ENCRYPTION_KEY = "your-encryption-key"

# Rate Limiting
RATE_LIMIT_PER_MINUTE = 10
RATE_LIMIT_PER_HOUR = 100

# Localization
DEFAULT_LOCALE = "en_US"
SUPPORTED_LOCALES = ["en_US", "es_ES", "fr_FR", "de_DE"]
```

## 🚨 **Security Considerations**

1. **Change Default Credentials**: Update default admin password immediately
2. **Secure Environment Variables**: Never commit secrets to version control
3. **Regular Updates**: Keep dependencies updated for security patches
4. **Access Control**: Use principle of least privilege for user roles
5. **Audit Logs**: Regularly review audit logs for suspicious activity

## 📝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:
- Email: support@hipaa-compliance-tool.com
- Documentation: https://docs.hipaa-compliance-tool.com
- Issues: https://github.com/your-org/hipaa-compliance-tool/issues

---

**⚠️ Important**: This tool has been completely rewritten to remove all deceptive and potentially harmful functionality. It now provides legitimate HIPAA compliance assessment services only.
