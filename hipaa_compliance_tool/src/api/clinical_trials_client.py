import requests
import time
from config import settings

def fetch_clinical_trials():
    """Fetch trials from ClinicalTrials.gov API"""
    studies = []
    current_rank = 1
    
    while current_rank <= settings.MAX_RESULTS:
        params = {
            **settings.CLINICAL_TRIALS_API['default_params'],
            'min_rnk': current_rank,
            'max_rnk': min(current_rank + settings.BATCH_SIZE - 1, settings.MAX_RESULTS)
        }
        
        try:
            response = requests.get(
                settings.CLINICAL_TRIALS_API['endpoint'],
                params=params,
                headers={'User-Agent': 'Mozilla/5.0'},
                timeout=15
            )
            response.raise_for_status()
            
            batch_data = response.json()['StudyFieldsResponse']['StudyFields']
            studies.extend(batch_data)
            
            current_rank += settings.BATCH_SIZE
            time.sleep(settings.DELAY_BETWEEN_BATCHES)
            
        except Exception as e:
            print(f"API Error: {str(e)}")
            break
            
    return studies
