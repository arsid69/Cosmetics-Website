"""
Automated Admin User Setup Script
Creates admin user and assigns admin role
"""

import os
import sys
import getpass

try:
    from supabase import create_client, Client
except ImportError:
    print("Installing supabase package...")
    os.system("pip install supabase -q")
    from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = "https://rxwnytavcgqyvaqkibyp.supabase.co"
SUPABASE_KEY = "sb_publishable_OXa-jV6qhKR4xsMwaEWWqw_D4_dreDw"

print("=" * 70)
print("ADMIN USER SETUP")
print("=" * 70)
print()

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def create_admin_user():
    print("Let's create your admin account!")
    print()
    
    email = input("Enter admin email (default: asifcalm53@gmail.com): ").strip()
    if not email:
        email = "asifcalm53@gmail.com"
    
    password = getpass.getpass("Enter password (min 8 chars): ").strip()
    if len(password) < 8:
        print("❌ Password must be at least 8 characters")
        return False
    
    full_name = input("Enter your full name: ").strip()
    if not full_name:
        full_name = "Admin"
    
    print()
    print(f"Creating admin user: {email}")
    
    try:
        # Sign up the user
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "full_name": full_name
                }
            }
        })
        
        if response.user:
            user_id = response.user.id
            print(f"✓ User created successfully!")
            print(f"  User ID: {user_id}")
            
            # Assign admin role
            print()
            print("Assigning admin role...")
            
            try:
                # Insert admin role
                supabase.table('user_roles').upsert({
                    "user_id": user_id,
                    "role": "admin"
                }).execute()
                
                print("✓ Admin role assigned successfully!")
                print()
                print("=" * 70)
                print("✅ ADMIN ACCOUNT CREATED!")
                print("=" * 70)
                print()
                print(f"Email: {email}")
                print(f"Name: {full_name}")
                print("Role: Admin")
                print()
                print("You can now log in with these credentials!")
                print()
                return True
                
            except Exception as e:
                print(f"⚠ Note: User created but role assignment needs manual step")
                print(f"   Error: {e}")
                print()
                print("Manual fix:")
                print(f"   Run this SQL in Supabase:")
                print(f"   INSERT INTO public.user_roles (user_id, role)")
                print(f"   VALUES ('{user_id}', 'admin')")
                print(f"   ON CONFLICT (user_id, role) DO NOTHING;")
                return True
        else:
            print("❌ Failed to create user")
            return False
            
    except Exception as e:
        error_msg = str(e)
        if "already registered" in error_msg.lower() or "already exists" in error_msg.lower():
            print(f"✓ User {email} already exists!")
            print()
            print("To assign admin role, run this SQL in Supabase:")
            print(f"INSERT INTO public.user_roles (user_id, role)")
            print(f"SELECT id, 'admin' FROM auth.users WHERE email = '{email}'")
            print(f"ON CONFLICT (user_id, role) DO NOTHING;")
            return True
        else:
            print(f"❌ Error: {e}")
            return False

def check_existing_admin(email=None):
    """Check if admin user already exists"""
    if not email:
        email = "asifcalm53@gmail.com"
    
    try:
        # This is a simplified check - in production you'd query the database
        print(f"Checking for existing admin: {email}")
        print("If user exists, you can reset password via Supabase dashboard")
        return False
    except:
        return False

# Main execution
if __name__ == "__main__":
    print("Choose an option:")
    print("  1. Create new admin user")
    print("  2. Assign admin role to existing user")
    print()
    
    choice = input("Enter choice (1 or 2): ").strip()
    
    if choice == "1":
        create_admin_user()
    elif choice == "2":
        email = input("Enter email address: ").strip()
        if email:
            print()
            print("Run this SQL in Supabase SQL Editor:")
            print()
            print(f"INSERT INTO public.user_roles (user_id, role)")
            print(f"SELECT id, 'admin' FROM auth.users WHERE email = '{email}'")
            print(f"ON CONFLICT (user_id, role) DO NOTHING;")
            print()
    else:
        print("Creating default admin...")
        create_admin_user()
