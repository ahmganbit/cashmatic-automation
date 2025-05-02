import json
import os
from datetime import datetime

class CampaignState:
    """Track campaign progress and state"""
    STATE_FILE = "campaign_state.json"
    
    def __init__(self):
        self.state = self._load_state()
        
    def _load_state(self):
        if os.path.exists(self.STATE_FILE):
            with open(self.STATE_FILE, 'r') as f:
                return json.load(f)
        return {
            'last_run': None,
            'sent_count': 0,
            'processed_trials': []
        }
    
    def record_successful_send(self, trial_id, email):
        self.state['sent_count'] += 1
        self.state['processed_trials'].append({
            'trial_id': trial_id,
            'email': email,
            'timestamp': datetime.now().isoformat()
        })
        self._save()
        
    def _save(self):
        with open(self.STATE_FILE, 'w') as f:
            json.dump(self.state, f, indent=2)
