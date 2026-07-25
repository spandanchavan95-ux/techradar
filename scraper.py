import os
import requests
import asyncio
import xml.etree.ElementTree as ET
from datetime import datetime
from supabase import create_client, Client
from playwright.async_api import async_playwright

# 1. Initialize Supabase Connection
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("FATAL: Supabase credentials missing. Ensure GitHub Secrets are set.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ==========================================
# METHOD 1: HIDDEN API & RSS REVERSE-ENGINEERING
# ==========================================
def fetch_hacker_news():
    """Fetches 'Show HN' (Products) and 'Ask HN: Who is Hiring' (Jobs)"""
    print("Ingesting: Hacker News API...")
    items = []
    try:
        # Tech Products (Show HN)
        res_show = requests.get("https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&hitsPerPage=15").json()
        for hit in res_show.get("hits", []):
            title = hit.get("title", "")
            items.append({
                "source_platform": "hacker_news",
                "pillar": "tech_products",
                "headline": title[:250],
                "summary": f"New product launch on Hacker News: {title}",
                "raw_url": hit.get("url") or f"https://news.ycombinator.com/item?id={hit.get('objectID')}",
                "is_active": True
            })
            
        # Tech News (Front Page)
        res_news = requests.get("https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=15").json()
        for hit in res_news.get("hits", []):
            if hit.get("url"): 
                title = hit.get("title", "")
                items.append({
                    "source_platform": "hacker_news",
                    "pillar": "silicon_valley",
                    "headline": title[:250],
                    "summary": f"Trending industry news: {title}",
                    "raw_url": hit.get("url"),
                    "is_active": True
                })
    except Exception as e:
        print(f"HN API Error: {e}")
    return items

def fetch_lobsters():
    """Fetches pure engineering news from Lobsters JSON endpoint"""
    print("Ingesting: Lobsters API...")
    items = []
    try:
        res = requests.get("https://lobste.rs/hottest.json").json()
        for hit in res[:10]:
            title = hit.get("title", "")
            items.append({
                "source_platform": "corporate_blog", 
                "pillar": "silicon_valley",
                "headline": title[:250],
                "summary": f"Technical engineering discussion: {title}",
                "raw_url": hit.get("url"),
                "is_active": True
            })
    except Exception as e:
        print(f"Lobsters API Error: {e}")
    return items

def fetch_techmeme():
    """Fetches aggregated tech news using their official XML RSS feed"""
    print("Ingesting: Techmeme RSS...")
    items = []
    try:
        res = requests.get("https://www.techmeme.com/feed.xml")
        root = ET.fromstring(res.content)
        
        # Traverse the XML tree to find all items
        for item in root.findall('./channel/item')[:15]:
            title = item.find('title').text
            link = item.find('link').text
            
            if title and link:
                items.append({
                    "source_platform": "corporate_blog",
                    "pillar": "silicon_valley",
                    "headline": title[:250],
                    "summary": f"Top industry news from Techmeme: {title}",
                    "raw_url": link,
                    "is_active": True
                })
    except Exception as e:
        print(f"Techmeme RSS Error: {e}")
    return items

# ==========================================
# METHOD 2: PLAYWRIGHT HEADLESS AUTOMATION
# ==========================================
async def fetch_yc_startups():
    """Uses Playwright to parse YC Work at a Startup DOM"""
    print("Ingesting: YC Work at a Startup (Headless Playwright)...")
    items = []
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        try:
            await page.goto("https://www.ycombinator.com/companies", timeout=20000)
            await page.wait_for_selector("._company_86jzd_338", timeout=10000)
            
            cards = await page.query_selector_all("._company_86jzd_338")
            
            for card in cards[:10]:
                name_elem = await card.query_selector(".pt-2")
                link_elem = await card.query_selector("a.Wd9G4R2lOvkQ33c6L31n")
                
                if name_elem and link_elem:
                    company = (await name_elem.inner_text()).strip()
                    href = await link_elem.get_attribute("href")
                    
                    items.append({
                        "source_platform": "wellfound", 
                        "pillar": "careers",
                        "headline": f"Startup Roles at {company} (Y Combinator)",
                        "summary": f"Y Combinator backed startup {company} is actively hiring.",
                        "raw_url": f"https://www.ycombinator.com{href}",
                        "is_active": True
                    })
        except Exception as e:
            print(f"Playwright YC Error: {e}")
            
        await browser.close()
        
    return items

# ==========================================
# DATABASE INJECTION
# ==========================================
def push_to_supabase(data_payload):
    success_count = 0
    for item in data_payload:
        try:
            supabase.table("items").insert(item).execute()
            success_count += 1
            print(f"[+] Ingested: {item['headline']}")
        except Exception as e:
            if "duplicate key value" not in str(e).lower():
                print(f"[-] Insertion Error for {item['raw_url']}: {e}")
                
    print(f"\n--- Ingestion Complete: {success_count} new items added to database ---")

# ==========================================
# MAIN WORKFLOW EXECUTION
# ==========================================
async def run_data_pipeline():
    print(f"Starting TechRadar Pipeline: {datetime.now().isoformat()}")
    
    hn_data = fetch_hacker_news()
    lobsters_data = fetch_lobsters()
    techmeme_data = fetch_techmeme()
    yc_data = await fetch_yc_startups()
    
    master_payload = hn_data + lobsters_data + techmeme_data + yc_data
    
    if master_payload:
        push_to_supabase(master_payload)
    else:
        print("Pipeline failed to retrieve any data.")

if __name__ == "__main__":
    asyncio.run(run_data_pipeline())