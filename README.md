# Nayab Smart Study Manager — Streamlit Edition

A Streamlit-native study dashboard for a 7-day MAKAUT B.Tech CSE Semester V study challenge.

## Files
- `app.py` — Main Streamlit application
- `requirements.txt` — Python dependencies

## Run locally
1. Install Python 3.10 or newer.
2. Open a terminal in this folder.
3. Run:

```bash
pip install -r requirements.txt
streamlit run app.py
```

## Deploy on Streamlit Community Cloud
1. Create a GitHub repository.
2. Upload `app.py` and `requirements.txt` to the repository root.
3. Open Streamlit Community Cloud: https://share.streamlit.io/
4. Connect your GitHub account and select the repository.
5. Set the Main file path to `app.py`.
6. Click Deploy.

## Notes
- This is a Python/Streamlit application. Do not enter `index.html` as the main file.
- The 7-day schedule is a starter revision plan, not a guarantee of exhaustive official unit coverage. Verify topics against your current MAKAUT syllabus and college notes.
- YouTube resources are topic-specific search links rather than individually verified lecture videos.
- The app stores progress in Streamlit session state. For durable storage across sessions/devices, a database or external storage integration would be needed.
- The timer updates when the page reruns; use the Refresh countdown button to refresh the displayed remaining time.
