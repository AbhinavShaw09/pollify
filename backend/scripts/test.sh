#!/bin/bash
cd "$(dirname "$0")/.."
python -m pytest app/tests/ -v --tb=short
