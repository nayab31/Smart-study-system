import streamlit as st
from datetime import date, datetime, timedelta
import time
import csv
import io

st.set_page_config(
    page_title="Nayab | Smart Study Manager",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="expanded",
)

# -------------------- Challenge configuration --------------------
START_DATE = date(2026, 11, 26)
DAYS = [
    {
        "day": 1, "date": "26 Nov", "theme": "Build the foundation",
        "sessions": [
            ("Morning · 2 hours", "Operating Systems", "OS basics, types, functions, system calls, process concept"),
            ("Afternoon · 1 hour", "Constitution of India", "Historical background, Preamble, salient features"),
            ("Evening · 3 hours", "Compiler Design", "Compiler structure, phases, lexical analysis, tokens"),
        ],
    },
    {
        "day": 2, "date": "27 Nov", "theme": "Core concepts",
        "sessions": [
            ("Morning · 2 hours", "Object-Oriented Programming", "Classes, objects, encapsulation, abstraction"),
            ("Afternoon · 1 hour", "Industrial Management", "Management principles, functions, planning and organization"),
            ("Evening · 3 hours", "Software Engineering", "SDLC, process models, requirements engineering"),
        ],
    },
    {
        "day": 3, "date": "28 Nov", "theme": "Processes and design",
        "sessions": [
            ("Morning · 2 hours", "Operating Systems", "Process states, PCB, threads, CPU scheduling"),
            ("Afternoon · 1 hour", "Artificial Intelligence", "Introduction, intelligent agents, problem formulation"),
            ("Evening · 3 hours", "Compiler Design", "Parsing, CFG, top-down and bottom-up parsing"),
        ],
    },
    {
        "day": 4, "date": "29 Nov", "theme": "Programming and analysis",
        "sessions": [
            ("Morning · 2 hours", "Object-Oriented Programming", "Inheritance, polymorphism, constructors, exception handling"),
            ("Afternoon · 1 hour", "Constitution of India", "Fundamental Rights, Duties and Directive Principles"),
            ("Evening · 3 hours", "Software Engineering", "Design concepts, cohesion, coupling, testing fundamentals"),
        ],
    },
    {
        "day": 5, "date": "30 Nov", "theme": "Algorithms and applications",
        "sessions": [
            ("Morning · 2 hours", "Operating Systems", "Deadlocks, memory management, paging and segmentation"),
            ("Afternoon · 1 hour", "Industrial Management", "Production, quality, inventory and project management"),
            ("Evening · 3 hours", "Artificial Intelligence", "Search strategies, BFS, DFS, heuristic search, knowledge representation"),
        ],
    },
    {
        "day": 6, "date": "1 Dec", "theme": "Revision and PYQs",
        "sessions": [
            ("Morning · 2 hours", "Compiler Design", "Intermediate code, code optimization and code generation"),
            ("Afternoon · 1 hour", "Constitution of India", "Parliament, President, Judiciary, constitutional amendments"),
            ("Evening · 3 hours", "Software Engineering + OOP", "Revise key topics; solve previous-year and model questions"),
        ],
    },
    {
        "day": 7, "date": "2 Dec", "theme": "Final practice",
        "sessions": [
            ("Morning · 2 hours", "Artificial Intelligence", "Revise algorithms and solve PYQs"),
            ("Afternoon · 1 hour", "Industrial Management", "Revise definitions, principles and short notes"),
            ("Evening · 3 hours", "All subjects", "Timed mixed mock test, check mistakes and final revision"),
        ],
    },
]

SUBJECTS = [
    ("Software Engineering", "ESC501"),
    ("Compiler Design", "PCC-CS501"),
    ("Operating Systems", "PCC-CS502"),
    ("Object-Oriented Programming", "PCC-CS503"),
    ("Introduction to Industrial Management", "HSMC-501"),
    ("Artificial Intelligence", "PEC-IT501B"),
    ("Constitution of India", "MC-CS501"),
]

# -------------------- Session state --------------------
defaults = {
    "completed": {},
    "study_logs": [],
    "tasks": [],
    "timer_started": None,
    "timer_duration": 25,
    "timer_label": "Focus session",
    "timer_total_seconds": 25 * 60,
    "timer_finished": False,
}
for key, value in defaults.items():
    if key not in st.session_state:
        st.session_state[key] = value.copy() if isinstance(value, (dict, list)) else value

def task_key(day, session_index):
    return f"{day}-{session_index}"

def get_completed_count():
    return sum(bool(v) for v in st.session_state.completed.values())

def nice_minutes(value):
    return f"{value // 60}h {value % 60}m"

# -------------------- Sidebar --------------------
with st.sidebar:
    st.title("📚 Study Manager")
    st.caption("7-day · 42-hour Semester V challenge")
    page = st.radio(
        "Navigate",
        ["Dashboard", "7-Day Roadmap", "My Tasks", "Focus Timer", "Study Reports", "Resources"],
    )
    st.divider()
    st.metric("Study target", "42 hours")
    st.metric("Completed sessions", f"{get_completed_count()} / 21")
    st.progress(min(get_completed_count() / 21, 1.0))
    st.caption("Challenge: 26 Nov – 2 Dec 2026")
    st.caption("Your progress is saved for this browser session.")

# -------------------- Header --------------------
st.title("Nayab's Smart Study Manager")
st.write("A focused 7-day plan for MAKAUT B.Tech CSE Semester V.")
st.info("Daily target: **6 hours** — Morning 2h · Afternoon 1h · Evening 3h. Use the roadmap as a starter plan and verify unit coverage with your official college syllabus.")

if page == "Dashboard":
    done = get_completed_count()
    total = 21
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Overall progress", f"{round(done / total * 100)}%")
    col2.metric("Sessions completed", f"{done}/{total}")
    col3.metric("Study time logged", nice_minutes(sum(x["minutes"] for x in st.session_state.study_logs)))
    col4.metric("Challenge target", "42 hours")

    st.subheader("Today's study plan")
    today = date.today()
    day_index = (today - START_DATE).days
    if 0 <= day_index < 7:
        todays_plan = DAYS[day_index]
        st.markdown(f"### Day {todays_plan['day']} · {todays_plan['theme']}")
        for i, (slot, subject, topic) in enumerate(todays_plan["sessions"]):
            done_flag = st.session_state.completed.get(task_key(todays_plan["day"], i), False)
            st.write(("✅" if done_flag else "⬜") + f" **{slot} — {subject}**")
            st.caption(topic)
    else:
        st.write("The 7-day challenge is scheduled for 26 November to 2 December 2026.")
        st.write("Open **7-Day Roadmap** to view all study sessions.")

    st.subheader("Your subjects")
    for subject, code in SUBJECTS:
        st.write(f"**{subject}** · `{code}`")

    st.subheader("Quick actions")
    c1, c2 = st.columns(2)
    with c1:
        if st.button("Start a 25-minute focus session", use_container_width=True):
            st.session_state.timer_duration = 25
            st.session_state.timer_total_seconds = 25 * 60
            st.session_state.timer_label = "25-minute focus session"
            st.session_state.timer_started = time.time()
            st.session_state.timer_finished = False
            st.success("Timer started. Open Focus Timer to track it.")
    with c2:
        if st.button("Open 7-Day Roadmap", use_container_width=True):
            st.session_state["nav_hint"] = "7-Day Roadmap"
            st.info("Choose **7-Day Roadmap** from the sidebar.")

elif page == "7-Day Roadmap":
    st.subheader("Your 7-day study roadmap")
    st.write("Complete each 2h + 1h + 3h session. Tick a session when you finish it.")
    for day in DAYS:
        with st.expander(f"Day {day['day']} · {day['date']} · {day['theme']}", expanded=(day["day"] == 1)):
            for i, (slot, subject, topic) in enumerate(day["sessions"]):
                key = task_key(day["day"], i)
                checked = st.checkbox(
                    f"{slot} — {subject}",
                    value=st.session_state.completed.get(key, False),
                    key=f"check_{key}",
                )
                st.session_state.completed[key] = checked
                st.caption(topic)
            day_done = all(st.session_state.completed.get(task_key(day["day"], i), False) for i in range(3))
            st.caption("Day status: " + ("✅ Completed" if day_done else "In progress"))

elif page == "My Tasks":
    st.subheader("Personal task list")
    with st.form("add_task_form", clear_on_submit=True):
        task_text = st.text_input("Add a task", placeholder="e.g. Solve 2024 OS question paper")
        task_subject = st.selectbox("Subject", [s[0] for s in SUBJECTS])
        submitted = st.form_submit_button("Add task")
        if submitted:
            if task_text.strip():
                st.session_state.tasks.append({
                    "text": task_text.strip(), "subject": task_subject, "done": False
                })
                st.success("Task added.")
            else:
                st.warning("Enter a task description first.")

    if not st.session_state.tasks:
        st.info("No personal tasks yet. Add PYQ practice, revision or assignment tasks above.")
    else:
        for idx, task in enumerate(st.session_state.tasks):
            c1, c2 = st.columns([5, 1])
            with c1:
                new_done = st.checkbox(
                    f"{task['text']} · {task['subject']}",
                    value=task["done"],
                    key=f"personal_task_{idx}",
                )
                st.session_state.tasks[idx]["done"] = new_done
            with c2:
                if st.button("Delete", key=f"delete_task_{idx}"):
                    st.session_state.tasks.pop(idx)
                    st.rerun()

elif page == "Focus Timer":
    st.subheader("Focus timer")
    st.write("Choose a session length, start the timer, and refresh the page or press the refresh button to update the countdown.")
    preset = st.radio("Timer preset", ["25 / 5 Pomodoro", "50 / 10 Deep Work", "60-minute study"], horizontal=True)
    minutes = {"25 / 5 Pomodoro": 25, "50 / 10 Deep Work": 50, "60-minute study": 60}[preset]
    if st.button("Start / Restart timer", type="primary"):
        st.session_state.timer_duration = minutes
        st.session_state.timer_total_seconds = minutes * 60
        st.session_state.timer_label = preset
        st.session_state.timer_started = time.time()
        st.session_state.timer_finished = False

    if st.session_state.timer_started is not None:
        elapsed = int(time.time() - st.session_state.timer_started)
        remaining = max(0, st.session_state.timer_total_seconds - elapsed)
        if remaining == 0 and not st.session_state.timer_finished:
            st.session_state.timer_finished = True
        st.markdown(f"### {st.session_state.timer_label}")
        st.markdown(f"# {remaining // 60:02d}:{remaining % 60:02d}")
        st.progress(1 - remaining / st.session_state.timer_total_seconds)
        if st.session_state.timer_finished:
            st.success("Focus session complete! Take a short break and log your study time.")
        else:
            st.caption("The timer continues while this page remains open. Press refresh to update the display.")
        if st.button("Refresh countdown"):
            st.rerun()
        if st.button("Stop timer"):
            st.session_state.timer_started = None
            st.session_state.timer_finished = False
            st.rerun()
    else:
        st.info("No timer running. Choose a preset and press Start / Restart timer.")

    st.divider()
    st.markdown("### Log a completed study session")
    with st.form("timer_log_form"):
        log_subject = st.selectbox("Subject studied", [s[0] for s in SUBJECTS], key="timer_log_subject")
        log_minutes = st.number_input("Minutes studied", min_value=1, max_value=600, value=25)
        log_note = st.text_input("What did you cover?", placeholder="Topics, questions or chapter")
        save_log = st.form_submit_button("Save study session")
        if save_log:
            st.session_state.study_logs.append({
                "date": date.today().isoformat(),
                "subject": log_subject,
                "minutes": int(log_minutes),
                "note": log_note.strip(),
            })
            st.success("Study session saved to your report.")

elif page == "Study Reports":
    st.subheader("Study reports")
    total_minutes = sum(x["minutes"] for x in st.session_state.study_logs)
    c1, c2 = st.columns(2)
    c1.metric("Total time logged", nice_minutes(total_minutes))
    c2.metric("Sessions logged", len(st.session_state.study_logs))

    if st.session_state.study_logs:
        st.dataframe(st.session_state.study_logs, use_container_width=True, hide_index=True)
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=["date", "subject", "minutes", "note"])
        writer.writeheader()
        writer.writerows(st.session_state.study_logs)
        st.download_button(
            "Download study report (CSV)",
            data=output.getvalue(),
            file_name="nayab_study_report.csv",
            mime="text/csv",
        )
    else:
        st.info("Your study log is empty. Record sessions from the Focus Timer page.")

    st.markdown("### Daily self-check")
    with st.form("daily_review_form"):
        review_date = st.date_input("Date", value=date.today())
        pyqs = st.number_input("Number of PYQ questions attempted", min_value=0, max_value=500, value=0)
        accuracy = st.slider("Approximate accuracy (%)", 0, 100, 50)
        weak_topics = st.text_area("Topics to revise", placeholder="Write topics you found difficult")
        save_review = st.form_submit_button("Save daily review")
        if save_review:
            st.session_state.study_logs.append({
                "date": review_date.isoformat(),
                "subject": "Daily review",
                "minutes": 0,
                "note": f"PYQs: {pyqs}; Accuracy: {accuracy}%; Revise: {weak_topics}",
            })
            st.success("Daily review saved.")

elif page == "Resources":
    st.subheader("Study resources")
    st.write("Use these official or search links to find your syllabus, previous-year questions and topic-wise lectures.")
    resources = [
        ("MAKAUT official website", "https://makautwb.ac.in/"),
        ("MAKAUT syllabus search", "https://www.google.com/search?q=MAKAUT+B.Tech+CSE+5th+semester+syllabus"),
        ("MAKAUT previous-year question papers", "https://www.google.com/search?q=MAKAUT+CSE+5th+semester+previous+year+question+papers"),
        ("MAKAUT study materials", "https://www.google.com/search?q=MAKAUT+CSE+semester+5+study+materials+PDF"),
    ]
    for label, url in resources:
        st.markdown(f"- [{label}]({url})")

    st.markdown("### Topic-wise YouTube searches")
    for subject, code in SUBJECTS:
        query = subject + " MAKAUT B.Tech 5th semester"
        yt_url = "https://www.youtube.com/results?search_query=" + query.replace(" ", "+")
        st.markdown(f"- [{subject} ({code}) — YouTube lectures]({yt_url})")

    st.warning("YouTube links open search results, not individually verified lecture videos. Match every topic against your official syllabus and class notes.")

st.divider()
st.caption("Built for a 7-day Semester V study challenge · Your entries are stored in Streamlit session state and may reset when the session restarts.")
