import re

def extract_contact_info(trial_data):
    """Extract emails from trial data"""
    contacts = {
        'pi_emails': [],
        'central_contacts': []
    }
    
    # Extract from Principal Investigators
    if affils := trial_data.get('OverallOfficialAffiliation', []):
        contacts['pi_emails'] = [
            match.group(0) 
            for affil in affils 
            if (match := re.search(r'\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b', affil))
        ]
    
    # Extract Central Contacts
    if emails := trial_data.get('CentralContactEMail', []):
        contacts['central_contacts'] = [
            email for email in emails 
            if re.match(r'^[\w.+-]+@[\w-]+\.[a-z]{2,}$', email)
        ]
        
    return contacts
