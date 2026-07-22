import os
import json
import urllib.request
import ssl

SUPABASE_URL = ''
SUPABASE_KEY = ''

if os.path.exists('.env.local'):
    with open('.env.local', 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith('NEXT_PUBLIC_SUPABASE_URL='):
                SUPABASE_URL = line.strip().split('=', 1)[1].strip('"\'')
            elif line.startswith('SUPABASE_SERVICE_ROLE_KEY='):
                SUPABASE_KEY = line.strip().split('=', 1)[1].strip('"\'')

url = f'{SUPABASE_URL}/rest/v1/rpc/exec_sql'
headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

sql = """
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hz_points INTEGER DEFAULT 0;
CREATE OR REPLACE FUNCTION award_hz_points(user_id_param UUID, amount INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET hz_points = COALESCE(hz_points, 0) + amount
  WHERE id = user_id_param;
END;
$$;
"""

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

data = json.dumps({'query': sql}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers=headers, method='POST')
try:
    with urllib.request.urlopen(req, context=ctx) as res:
        print('Success:', res.read().decode())
except urllib.error.HTTPError as e:
    print('Error:', e.read().decode())
