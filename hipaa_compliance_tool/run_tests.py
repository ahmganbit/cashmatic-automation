#!/usr/bin/env python3
"""
Test runner for HIPAA Compliance Tool
Runs all tests and generates coverage reports
"""

import sys
import subprocess
import os
from pathlib import Path

def run_tests():
    """Run all tests with coverage"""
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    print("🧪 Running HIPAA Compliance Tool Tests")
    print("=" * 50)
    
    # Install dependencies
    print("📦 Installing dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True)
        print("✅ Dependencies installed")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False
    
    # Run tests with coverage
    print("\n🔍 Running tests with coverage...")
    try:
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "tests/", 
            "-v", 
            "--cov=src", 
            "--cov-report=html", 
            "--cov-report=term-missing"
        ], check=True)
        
        print("✅ All tests passed!")
        print("📊 Coverage report generated in htmlcov/")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Tests failed with exit code {e.returncode}")
        return False
    
    except FileNotFoundError:
        print("❌ pytest not found. Installing...")
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "pytest", "pytest-cov"], 
                          check=True)
            print("✅ pytest installed, rerunning tests...")
            return run_tests()
        except subprocess.CalledProcessError:
            print("❌ Failed to install pytest")
            return False

def run_security_checks():
    """Run security checks"""
    print("\n🔒 Running security checks...")
    
    # Check for common security issues
    security_checks = [
        "grep -r 'password.*=' src/ || true",
        "grep -r 'secret.*=' src/ || true", 
        "grep -r 'api_key.*=' src/ || true"
    ]
    
    for check in security_checks:
        print(f"Running: {check}")
        os.system(check)

def run_linting():
    """Run code linting"""
    print("\n📝 Running code linting...")
    
    try:
        # Run flake8
        subprocess.run([sys.executable, "-m", "flake8", "src/", "tests/"], check=True)
        print("✅ Linting passed")
        return True
    except subprocess.CalledProcessError:
        print("❌ Linting failed")
        return False
    except FileNotFoundError:
        print("⚠️  flake8 not found, skipping linting")
        return True

if __name__ == "__main__":
    success = True
    
    # Run tests
    if not run_tests():
        success = False
    
    # Run linting
    if not run_linting():
        success = False
    
    # Run security checks
    run_security_checks()
    
    if success:
        print("\n🎉 All checks passed!")
        sys.exit(0)
    else:
        print("\n💥 Some checks failed!")
        sys.exit(1)
