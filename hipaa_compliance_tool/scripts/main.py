from src.api import clinical_trials_client
from src.data import processor
from src.email import sender
from src.utils import state_manager
import pandas as pd
from config import settings

def main():
    state = state_manager.CampaignState()
    trials_data = clinical_trials_client.fetch_clinical_trials()
    
    valid_leads = []
    for trial in trials_data:
        contacts = processor.extract_contact_info(trial)
        
        for email in contacts['pi_emails'] + contacts['central_contacts']:
            valid_leads.append({
                'nct_id': trial['NCTId'][0],
                'title': trial['BriefTitle'][0],
                'email': email
            })
    
    pd.DataFrame(valid_leads).to_csv('hipaa_leads.csv', index=False)
    
    for lead in valid_leads:
        body = f"""Principal Investigator,

Automated audit detected HIPAA compliance gaps in:
- Study ID: {lead['nct_id']}
- Title: {lead['title']}

Validate compliance immediately:
{settings.FLUTTERWAVE_LINK}

This is an automated alert from HIPAA Compliance Monitor.
"""
        
        if sender.send_hipaa_alert(
            lead['email'],
            f"Action Required: HIPAA Compliance - {lead['nct_id']}",
            body
        ):
            state.record_successful_send(lead['nct_id'], lead['email'])

if __name__ == "__main__":
    main()
