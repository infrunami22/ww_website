#!/usr/bin/env python3
"""
Weekly reset script for WW website.
Archives current picks and updates week configuration.
"""

import json
import sys
from datetime import datetime, timedelta
from pathlib import Path


def get_next_wednesday(from_date=None):
    """Get the next Wednesday from the given date."""
    if from_date is None:
        from_date = datetime.now()
    
    # Calculate days until next Wednesday (weekday 2)
    days_ahead = 2 - from_date.weekday()  # Wednesday is 2
    if days_ahead <= 0:  # Target day already happened this week
        days_ahead += 7
    
    next_wednesday = from_date + timedelta(days=days_ahead)
    # Set time to 09:00:00 in the Budapest timezone
    next_wednesday = next_wednesday.replace(hour=12, minute=0, second=0, microsecond=0)
    
    return next_wednesday


def archive_week():
    """Main function to archive current week and update configuration."""
    
    try:
        data_dir = Path("data")
        
        # Verify all required files exist
        required_files = ["current-a.json", "current-b.json", "week-config.json", "archive.json"]
        for filename in required_files:
            if not (data_dir / filename).exists():
                print(f"✗ Error: {filename} not found in data directory")
                sys.exit(1)
        
        # Read current files
        with open(data_dir / "current-a.json", "r", encoding="utf-8") as f:
            current_a = json.load(f)
        
        with open(data_dir / "current-b.json", "r", encoding="utf-8") as f:
            current_b = json.load(f)
        
        with open(data_dir / "week-config.json", "r", encoding="utf-8") as f:
            week_config = json.load(f)
        
        with open(data_dir / "archive.json", "r", encoding="utf-8") as f:
            archive = json.load(f)
        
        # Validate data structure
        if "nominee" not in current_a:
            print("✗ Error: current-a.json missing 'nominee' field")
            sys.exit(1)
        if "nominee" not in current_b:
            print("✗ Error: current-b.json missing 'nominee' field")
            sys.exit(1)
        if "entries" not in archive:
            print("✗ Error: archive.json missing 'entries' field")
            sys.exit(1)
        
        # Create new archive entry from current week
        new_entry = {
            "weekId": week_config["weekId"],
            "season": week_config["season"],
            "revealAt": week_config["revealAt"],
            "timezone": week_config["timezone"],
            "contestantA": week_config["contestantA"],
            "contestantB": week_config["contestantB"],
            "nomineeA": current_a["nominee"],
            "nomineeB": current_b["nominee"]
        }
        
        # Add to archive at the beginning (most recent first)
        archive["entries"].insert(0, new_entry)
        
        # Write updated archive
        with open(data_dir / "archive.json", "w", encoding="utf-8") as f:
            json.dump(archive, f, indent=2, ensure_ascii=False)
        
        # Update week config
        current_week_id = int(week_config["weekId"])
        new_week_id = str(current_week_id + 1)
        
        # Calculate next Wednesday
        current_reveal = datetime.fromisoformat(week_config["revealAt"].replace("+02:00", ""))
        next_wednesday = get_next_wednesday(current_reveal)
        
        # Format the date with timezone
        next_reveal = next_wednesday.strftime("%Y-%m-%dT%H:%M:%S+02:00")
        
        # Update week config
        week_config["weekId"] = new_week_id
        week_config["revealAt"] = next_reveal
        
        # Update notes
        week_number = next_wednesday.isocalendar()[1]
        month = next_wednesday.strftime("%B")
        week_config["notes"] = f"Week {week_number} of {month} {next_wednesday.year}"
        
        # Write updated week config
        with open(data_dir / "week-config.json", "w", encoding="utf-8") as f:
            json.dump(week_config, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Archived week {current_week_id}")
        print(f"✓ Updated config to week {new_week_id}")
        print(f"✓ Next reveal: {next_reveal}")
        
        # Set environment variable for commit message
        import os
        if "GITHUB_ENV" in os.environ:
            with open(os.environ["GITHUB_ENV"], "a") as f:
                f.write(f"WEEK_ID={current_week_id}\n")
    
    except FileNotFoundError as e:
        print(f"✗ File error: {e}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"✗ JSON parsing error: {e}")
        sys.exit(1)
    except KeyError as e:
        print(f"✗ Missing required field: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    archive_week()
