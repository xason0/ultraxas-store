#!/usr/bin/env python3
import json
import requests
from urllib.parse import urljoin
import sys

def fetch_fdroid_data():
    print("Fetching F-Droid app data...")
    
    # F-Droid index URL
    index_url = "https://f-droid.org/repo/index-v1.json"
    base_url = "https://f-droid.org/repo/"
    icon_base_url = urljoin(base_url, "icons/")
    
    try:
        # Fetch the index file
        response = requests.get(index_url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        data = response.json()
        apps = data.get("apps", [])
        packages = data.get("packages", {})
        
        print(f"Found {len(apps)} apps in the F-Droid repository")
        
        # Process apps and extract required information
        processed_apps = []
        
        for app in apps:
            package_name = app.get("packageName")
            
            # Skip apps without package name
            if not package_name:
                continue
                
            # Get versions for this package
            package_versions = packages.get(package_name, [])
            
            # Skip apps with no versions
            if not package_versions:
                continue
                
            # Find the latest version with a valid APK
            latest_version = None
            for version in package_versions:
                if "apkName" in version:
                    if latest_version is None or version.get("versionCode", 0) > latest_version.get("versionCode", 0):
                        latest_version = version
            
            # Skip if no valid version with APK found
            if not latest_version or "apkName" not in latest_version:
                continue
                
            # Extract required information
            icon_path = app.get("icon")
            icon_url = urljoin(icon_base_url, icon_path) if icon_path else None
            apk_url = urljoin(base_url, latest_version.get("apkName"))
            
            app_info = {
                "name": app.get("name", "Unknown"),
                "packageName": package_name,
                "latestVersion": latest_version.get("versionName", "Unknown"),
                "description": app.get("summary", ""),
                "iconUrl": icon_url,
                "apkUrl": apk_url
            }
            
            processed_apps.append(app_info)
        
        print(f"Successfully processed {len(processed_apps)} valid apps")
        return processed_apps
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching F-Droid data: {e}", file=sys.stderr)
        return []
    except json.JSONDecodeError as e:
        print(f"Error parsing F-Droid JSON data: {e}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        return []

def save_to_json(apps, filename="fdroid-apps.json"):
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(apps, f, indent=2, ensure_ascii=False)
        print(f"Successfully saved {len(apps)} apps to {filename}")
        return True
    except Exception as e:
        print(f"Error saving to JSON file: {e}", file=sys.stderr)
        return False

def main():
    print("F-Droid App Data Extractor")
    print("==========================")
    
    # Fetch and process F-Droid data
    apps = fetch_fdroid_data()
    
    if not apps:
        print("No valid apps found or error occurred.")
        return
    
    # Save processed data to JSON file
    save_to_json(apps)
    
    # Print sample of the data
    if apps:
        print("\nSample app data:")
        print(json.dumps(apps[0], indent=2))
        print(f"\nTotal apps saved: {len(apps)}")

if __name__ == "__main__":
    main()
