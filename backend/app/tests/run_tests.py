#!/usr/bin/env python3
"""
QuickPoll API Test Runner
Run all tests for the QuickPoll backend API
"""

import subprocess
import sys
import os

def run_tests():
    print("🧪 Running QuickPoll API Tests...")
    print("=" * 50)
    
    # Change to parent directory to run tests
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    try:
        # Run pytest with verbose output
        result = subprocess.run([
            "poetry", "run", "pytest", 
            "tests/", 
            "-v", 
            "--tb=short",
            "--color=yes"
        ], check=True)
        
        print("\n" + "=" * 50)
        print("✅ All tests passed successfully!")
        return True
        
    except subprocess.CalledProcessError as e:
        print("\n" + "=" * 50)
        print("❌ Some tests failed!")
        print(f"Exit code: {e.returncode}")
        return False

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
