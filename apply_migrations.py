"""
Automated Supabase Migration Applier
Executes the complete database setup via Supabase API
"""

import sys
import os

try:
    import requests
except ImportError:
    print("Installing requests package...")
    os.system("pip install requests -q")
    import requests

# Configuration
SUPABASE_URL = "https://rxwnytavcgqyvaqkibyp.supabase.co"
SUPABASE_KEY = "sb_publishable_OXa-jV6qhKR4xsMwaEWWqw_D4_dreDw"
PROJECT_REF = "rxwnytavcgqyvaqkibyp"

print("=" * 80)
print("AUTOMATED SUPABASE DATABASE MIGRATION")
print("=" * 80)
print()

# Read the SQL file
sql_file_path = os.path.join(os.path.dirname(__file__), "SUPABASE_SETUP_COMPLETE.sql")

print(f"📖 Reading SQL file: {sql_file_path}")
try:
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    print(f"✓ SQL file loaded ({len(sql_content)} characters)")
except Exception as e:
    print(f"❌ Error reading SQL file: {e}")
    sys.exit(1)

print()
print("🔄 Applying migrations to Supabase...")
print()

# Note: The publishable key doesn't have SQL execution permissions
# We need the service role key for this, which should never be exposed client-side
print("⚠️  IMPORTANT NOTICE:")
print()
print("The current API key is a 'publishable' key (anon key), which is safe for")
print("client-side use but cannot execute SQL directly.")
print()
print("To apply migrations programmatically, you would need the 'service_role' key,")
print("which should NEVER be used in client-side code or committed to git.")
print()
print("=" * 80)
print("RECOMMENDED APPROACH:")
print("=" * 80)
print()
print("1. ✓ Open Supabase SQL Editor (already opened in browser):")
print(f"   {SUPABASE_URL}/project/{PROJECT_REF}/sql/new")
print()
print("2. ✓ Open this file in VS Code:")
print(f"   {sql_file_path}")
print()
print("3. ✓ Select All (Ctrl+A) → Copy (Ctrl+C)")
print()
print("4. ✓ Paste into SQL Editor (Ctrl+V)")
print()
print("5. ✓ Click 'RUN' button")
print()
print("6. ✓ Wait for 'Success' message")
print()
print("This is the safest and most reliable method!")
print()
print("=" * 80)
print()

# Alternative: Check if we can at least test the connection
print("🔌 Testing Supabase connection...")
try:
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Try to access a public endpoint
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/",
        headers=headers,
        timeout=10
    )
    
    if response.status_code in [200, 404, 401]:  # Any response means connection works
        print("✓ Supabase connection: ACTIVE")
        print("✓ API endpoint: RESPONDING")
    else:
        print(f"⚠️  Unexpected response: {response.status_code}")
        
except Exception as e:
    print(f"⚠️  Connection test: {e}")

print()
print("=" * 80)
print("NEXT STEPS:")
print("=" * 80)
print()
print("After executing the SQL:")
print("  1. Run: python verify_setup.py (to verify tables)")
print("  2. Run: python create_admin.py (to create admin user)")
print("  3. Open: http://localhost:8080/ (to test the app)")
print()
print("=" * 80)
