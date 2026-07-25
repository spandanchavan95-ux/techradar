import os
import json
import asyncio
from supabase import create_client, Client
from playwright.async_api import async_playwright
from groq import AsyncGroq

# 1. Initialize Environment Variables (These will be injected by GitHub Actions)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY, GROQ_API_KEY]):
    print("Missing environment variables. Exiting.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
groq_client = AsyncGroq(api_key=GROQ_API_KEY)

async def analyze_status_with_groq(page_text):
    """
    Blueprint Implementation: Passes text to Groq API (Llama 3.1) to check for closed status.
    """
    prompt = """Analyze this page text. Does it explicitly state the job is closed, expired, or no longer accepting applications? Reply JSON { "is_closed": boolean }."""
    
    try:
        chat_completion = await groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a JSON-only output parser."},
                {"role": "user", "content": f"{prompt}\n\nPAGE TEXT:\n{page_text[:4000]}"} # Limit tokens
            ],
            model="llama-3.1-8b-instant",
            temperature=0.0, # 0.0 for strict analytical accuracy
            response_format={"type": "json_object"}
        )
        result = json.loads(chat_completion.choices[0].message.content)
        return result.get("is_closed", False)
    except Exception as e:
        print(f"Groq API Error: {e}")
        return False

async def process_premium_tracking():
    # 2. Fetch Premium Users
    print("Fetching Premium Users...")
    profiles = supabase.table('profiles').select('id').eq('is_premium', True).execute()
    premium_user_ids = [p['id'] for p in profiles.data]

    if not premium_user_ids:
        print("No premium users found.")
        return

    # 3. Fetch active user_tracked_items (only 'saved' or 'applied') for those premium users
    print(f"Found {len(premium_user_ids)} premium users. Fetching tracked items...")
    tracked_query = supabase.table('user_tracked_items').select('id, item_id, status').in_('user_id', premium_user_ids).in_('status', ['saved', 'applied']).execute()
    
    if not tracked_query.data:
        print("No active tracked items to check.")
        return

    # Extract item IDs to fetch the raw URLs from the main items table
    item_ids = [t['item_id'] for t in tracked_query.data]
    items_query = supabase.table('items').select('id, raw_url').in_('id', item_ids).execute()
    
    url_map = {item['id']: item['raw_url'] for item in items_query.data}

    # 4. Status Tracking Module (Playwright + Groq)
    print("Launching Playwright Headless Browser...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        for tracked_item in tracked_query.data:
            raw_url = url_map.get(tracked_item['item_id'])
            if not raw_url:
                continue
            
            print(f"Inspecting URL: {raw_url}")
            try:
                # Silently load the raw_url
                await page.goto(raw_url, timeout=15000)
                
                # Extract the visible body text
                page_text = await page.evaluate("document.body.innerText")
                
                # Analyze with Llama 3.1
                is_closed = await analyze_status_with_groq(page_text)
                
                if is_closed:
                    print(f"-> Status: CLOSED. Archiving item {tracked_item['id']}...")
                    # Mutate the Supabase user_tracked_items row status to 'archived'
                    supabase.table('user_tracked_items').update({'status': 'archived'}).eq('id', tracked_item['id']).execute()
                else:
                    print("-> Status: ACTIVE.")
            
            except Exception as e:
                print(f"-> Failed to process {raw_url}: {e}")
        
        await browser.close()
    print("Premium Automation Run Complete.")

if __name__ == "__main__":
    asyncio.run(process_premium_tracking())