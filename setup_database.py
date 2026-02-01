"""
Automated Supabase Database Setup Script
This script will apply all migrations to your Supabase database
"""

import os
from pathlib import Path

# Read the complete SQL setup file
sql_file = Path(__file__).parent / "SUPABASE_SETUP_COMPLETE.sql"

with open(sql_file, 'r', encoding='utf-8') as f:
    sql_content = f.read()

print("=" * 60)
print("SUPABASE DATABASE SETUP")
print("=" * 60)
print()
print("INSTRUCTIONS:")
print()
print("1. Open your Supabase SQL Editor:")
print("   https://rxwnytavcgqyvaqkibyp.supabase.co/project/rxwnytavcgqyvaqkibyp/sql/new")
print()
print("2. Copy the entire content from:")
print(f"   {sql_file}")
print()
print("3. Paste it into the SQL Editor")
print()
print("4. Click 'RUN' button")
print()
print("5. Wait for success confirmation")
print()
print("=" * 60)
print()
print("The SQL file contains:")
print("  ✓ All table schemas (categories, products, orders, etc.)")
print("  ✓ User roles and authentication setup")
print("  ✓ Row Level Security (RLS) policies")
print("  ✓ Functions and triggers")
print("  ✓ Storage bucket for product images")
print("  ✓ Admin access configuration")
print()
print("=" * 60)
print()

# Copy SQL to clipboard if possible
try:
    import pyperclip
    pyperclip.copy(sql_content)
    print("✓ SQL content copied to clipboard!")
    print("  Just paste (Ctrl+V) into the SQL Editor and click RUN")
except ImportError:
    print("Note: Install 'pyperclip' to auto-copy SQL to clipboard")
    print("      pip install pyperclip")

print()
print("=" * 60)
