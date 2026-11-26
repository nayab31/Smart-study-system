const CHALLENGE_START = "2026-11-26";
const DAYS = [
  {label:"Day 1",date:"26 Nov",title:"Operating Systems + Software Engineering",slots:[
    ["6:00–7:00 AM","Operating Systems","Introduction, functions and types of OS",60],
    ["7:00–8:00 AM","Operating Systems","Processes, process states, PCB and threads",60],
    ["1:00–2:00 PM","Software Engineering","Software characteristics and SDLC",60],
    ["6:00–7:00 PM","Operating Systems","CPU scheduling: FCFS and SJF",60],
    ["7:00–8:00 PM","Operating Systems","Round Robin and Priority Scheduling",60],
    ["8:00–9:00 PM","Practice & Revision","Scheduling numericals and OS PYQs",60]]},
  {label:"Day 2",date:"27 Nov",title:"Compiler Design + Artificial Intelligence",slots:[
    ["6:00–7:00 AM","Compiler Design","Compiler phases and structure",60],
    ["7:00–8:00 AM","Compiler Design","Lexical analysis, tokens and patterns",60],
    ["1:00–2:00 PM","Artificial Intelligence","Introduction and intelligent agents",60],
    ["6:00–7:00 PM","Compiler Design","Regular expressions and finite automata",60],
    ["7:00–8:00 PM","Compiler Design","FIRST, FOLLOW and parsing fundamentals",60],
    ["8:00–9:00 PM","Practice & Revision","Compiler numericals and PYQs",60]]},
  {label:"Day 3",date:"28 Nov",title:"OOP + Software Engineering",slots:[
    ["6:00–7:00 AM","Object-Oriented Programming","Classes, objects and constructors",60],
    ["7:00–8:00 AM","Object-Oriented Programming","Inheritance and polymorphism",60],
    ["1:00–2:00 PM","Software Engineering","Waterfall, Spiral and Agile models",60],
    ["6:00–7:00 PM","Object-Oriented Programming","Abstraction and encapsulation",60],
    ["7:00–8:00 PM","Object-Oriented Programming","Overloading and exception handling",60],
    ["8:00–9:00 PM","Practice & Revision","Programming exercises and OOP PYQs",60]]},
  {label:"Day 4",date:"29 Nov",title:"Operating Systems + Artificial Intelligence",slots:[
    ["6:00–7:00 AM","Operating Systems","Process synchronization and critical section",60],
    ["7:00–8:00 AM","Operating Systems","Semaphores and deadlocks",60],
    ["1:00–2:00 PM","Artificial Intelligence","Problem solving and search techniques",60],
    ["6:00–7:00 PM","Operating Systems","Memory management",60],
    ["7:00–8:00 PM","Operating Systems","Paging, segmentation and virtual memory",60],
    ["8:00–9:00 PM","Practice & Revision","Deadlock and memory numericals",60]]},
  {label:"Day 5",date:"30 Nov",title:"Compiler Design + Industrial Management",slots:[
    ["6:00–7:00 AM","Compiler Design","Top-down and bottom-up parsing",60],
    ["7:00–8:00 AM","Compiler Design","LR parsing and syntax-directed translation",60],
    ["1:00–2:00 PM","Industrial Management","Management principles",60],
    ["6:00–7:00 PM","Compiler Design","Intermediate code generation",60],
    ["7:00–8:00 PM","Compiler Design","Code optimization and code generation",60],
    ["8:00–9:00 PM","Practice & Revision","Parsing problems and compiler PYQs",60]]},
  {label:"Day 6",date:"1 Dec",title:"AI + Industrial Management + Constitution",slots:[
    ["6:00–7:00 AM","Artificial Intelligence","Knowledge representation",60],
    ["7:00–8:00 AM","Artificial Intelligence","Logic, inference and expert systems",60],
    ["1:00–2:00 PM","Constitution of India","Preamble, Fundamental Rights and Duties",60],
    ["6:00–7:00 PM","Industrial Management","Production and quality management",60],
    ["7:00–8:00 PM","Constitution of India","Union and State Government",60],
    ["8:00–9:00 PM","Artificial Intelligence","Machine learning fundamentals and PYQs",60]]},
  {label:"Day 7",date:"2 Dec",title:"Final revision + mock examination",slots:[
    ["6:00–7:00 AM","Software Engineering","Important concepts and unit revision",60],
    ["7:00–8:00 AM","Object-Oriented Programming","Important concepts and programs",60],
    ["1:00–2:00 PM","Constitution of India","Remaining topics and revision",60],
    ["6:00–7:00 PM","Industrial Management","Important questions and revision",60],
    ["7:00–8:00 PM","All technical subjects","Algorithms, formulas and definitions",60],
    ["8:00–9:00 PM","Mock Test","Timed mixed-subject examination",60]]}
];
const SUBJECTS = [
  ["Software Engineering","ESC501","SDLC, process models, requirements, design, testing, maintenance"],
  ["Compiler Design","PCC-CS501","Compiler phases, lexical analysis, parsing, syntax-directed translation, intermediate code, optimization"],
  ["Operating Systems","PCC-CS502","Processes, scheduling, synchronization, deadlocks, memory, file systems"],
  ["Object-Oriented Programming","PCC-CS503","Classes, objects, inheritance, polymorphism, abstraction, exceptions, templates"],
  ["Industrial Management","HSMC-501","Management principles, organization, production, quality and inventory"],
  ["Artificial Intelligence","PEC-IT501B","Agents, search, knowledge representation, logic, expert systems and ML fundamentals"],
  ["Constitution of India","MC-CS501","Preamble, rights, duties, government, Parliament, judiciary and federal structure"]
];
const KEY = "nayabStudyManagerV1";
const defaultTasks = [];
DAYS.forEach((day,di)=>day.slots.forEach((s,si)=>defaultTasks.push({
  id:`d${di}s${si}`,day:di,name:s[2],subject:s[1],minutes:s[3],status:"pending",loggedMinutes:0
})));
let state = loadState();
let selectedDay = 0;
let timerSeconds = 25*60, timerInterval=null, timerRunning=false, focusMinutes=25, breakMinutes=5, isBreak=false;

function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem(KEY));
    if(saved && Array.isArray(saved.tasks)) return {...saved,tasks:saved.tasks,reports:saved.reports||{},pyqLogs:saved.pyqLogs||[],revisionLogs:saved.revisionLogs||[]};
  }catch(e){}
  return {tasks:defaultTasks,reports:{},pyqLogs:[],revisionLogs:[]};
}
function save(){localStorage.setItem(KEY,JSON.stringify(state));renderAll();}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600);}
function dateForDay(i){const d=new Date(`${CHALLENGE_START}T12:00:00`);d.setDate(d.getDate()+i);return d;}
function renderDays(){
  document.getElementById("dayTabs").innerHTML=DAYS.map((d,i)=>`<button class="day-tab ${i===selectedDay?"active":""}" data-day="${i}"><b>${d.date.split(" ")[0]}</b>${d.label}</button>`).join("");
  document.querySelectorAll(".day-tab").forEach(b=>b.onclick=()=>{selectedDay=+b.dataset.day;renderDays();});
  const tasks=state.tasks.filter(t=>t.day===selectedDay),done=tasks.filter(t=>t.status==="completed").length;
  document.getElementById("daySummary").textContent=`${DAYS[selectedDay].title} · ${done}/${tasks.length} tasks complete · 6 hours planned`;
  const slots=DAYS[selectedDay].slots;
  document.getElementById("scheduleList").innerHTML=slots.map((s,i)=>{
    const t=state.tasks.find(x=>x.id===`d${selectedDay}s${i}`);
    return `<div class="schedule-item"><span class="schedule-time">${s[0]}</span><div class="schedule-main"><span class="slot"></span><div><b>${esc(s[1])}</b><small>${esc(s[2])}</small></div></div><button data-task="${t?.id||""}">${t?.status==="completed"?"Completed ✓":"View task"}</button></div>`;
  }).join("");
  document.querySelectorAll("[data-task]").forEach(b=>b.onclick=()=>{document.getElementById("taskDayFilter").value=String(selectedDay);document.getElementById("taskStatusFilter").value="all";renderTasks();document.getElementById("tasks").scrollIntoView({behavior:"smooth"});});
}
function renderSubjects(){
  document.getElementById("subjectProgress").innerHTML=SUBJECTS.map(s=>{
    const ts=state.tasks.filter(t=>t.subject===s[0]),done=ts.filter(t=>t.status==="completed").length,p=ts.length?Math.round(done/ts.length*100):0;
    return `<div class="subject-row"><div class="subject-title"><b>${esc(s[0])}</b><span>${p}% · ${done}/${ts.length}</span></div><div class="progress-bar"><span style="width:${p}%"></span></div></div>`;
  }).join("");
}
function renderTasks(){
  const day=document.getElementById("taskDayFilter").value,status=document.getElementById("taskStatusFilter").value;
  const filtered=state.tasks.filter(t=>(day==="all"||String(t.day)===day)&&(status==="all"||t.status===status));
  document.getElementById("visibleTaskCount").textContent=`Showing ${filtered.length} tasks`;
  document.getElementById("taskTable").innerHTML=filtered.length?filtered.map(t=>`<tr><td><b>${esc(t.name)}</b></td><td>${esc(t.subject)}</td><td>Day ${t.day+1}</td><td>${t.minutes} min</td><td><span class="status ${t.status}">${t.status==="completed"?"Completed":"Pending"}</span></td><td>${t.status==="completed"?`<button class="table-action" data-toggle="${t.id}">Undo</button>`:`<button class="table-action" data-toggle="${t.id}">Mark done</button>`} <button class="table-action" data-move="${t.id}">Reschedule</button></td></tr>`).join(""):`<tr><td colspan="6" class="empty-state">No tasks match these filters.</td></tr>`;
  document.querySelectorAll("[data-toggle]").forEach(b=>b.onclick=()=>{const t=state.tasks.find(x=>x.id===b.dataset.toggle);t.status=t.status==="completed"?"pending":"completed";save();toast(t.status==="completed"?"Task marked complete.":"Task moved back to pending.");});
  document.querySelectorAll("[data-move]").forEach(b=>b.onclick=()=>{const t=state.tasks.find(x=>x.id===b.dataset.move);const d=prompt("Move this task to which day? Enter 1–7:",String(Math.min(7,t.day+2)));if(d===null)return;const n=Number(d);if(Number.isInteger(n)&&n>=1&&n<=7){t.day=n-1;save();toast("Task rescheduled.");}else toast("Enter a day from 1 to 7.");});
}
function renderTimerTasks(){
  const sel=document.getElementById("timerTask"),old=sel.value;
  const pending=state.tasks.filter(t=>t.status!=="completed");
  sel.innerHTML=pending.map(t=>`<option value="${t.id}">${esc(t.name)} · ${esc(t.subject)}</option>`).join("")||`<option value="">No pending tasks</option>`;
  if(pending.some(t=>t.id===old))sel.value=old;
  document.getElementById("youtubeLink").href="https://www.youtube.com/results?search_query="+encodeURIComponent("MAKAUT BTech CSE semester 5 "+(pending.find(t=>t.id===sel.value)?.subject||""));
}
function renderStats(){
  const done=state.tasks.filter(t=>t.status==="completed").length,total=state.tasks.length,p=total?Math.round(done/total*100):0;
  document.getElementById("overallPercent").textContent=p+"%";
  document.getElementById("overallRing").style.background=`conic-gradient(#fff ${p*3.6}deg,#ffffff44 0deg)`;
  document.getElementById("completedCount").textContent=done;document.getElementById("totalCount").textContent=total;
  document.getElementById("tasksDoneStat").textContent=done;document.getElementById("tasksPendingStat").textContent=(total-done)+" pending";
  let logged=state.tasks.reduce((a,t)=>a+(Number(t.loggedMinutes)||0),0);
  Object.values(state.reports).forEach(r=>logged+=Number(r.actualMinutes)||0);
  document.getElementById("hoursLogged").textContent=`${Math.floor(logged/60)}h ${String(logged%60).padStart(2,"0")}m`;
  const now=new Date();const end=new Date("2026-12-03T00:00:00");
  const days=Math.max(0,Math.ceil((end-now)/(86400000)));
  document.getElementById("countdown").textContent=days===1?"1 day":days+" days";
  document.getElementById("remainingText").textContent=done===total?"All planned tasks completed!":`${total-done} tasks remaining`;
}
function renderReport(){
  const day=Number(document.getElementById("reportDay").value||0),r=state.reports[day]||{};
  document.getElementById("actualMinutes").value=r.actualMinutes??"";
  document.getElementById("pyqCount").value=r.pyqCount??"";
  document.getElementById("accuracy").value=r.accuracy??"";
  document.getElementById("topicsDone").value=r.topicsDone??"";
  document.getElementById("weakTopics").value=r.weakTopics??"";
  document.getElementById("savedReports").innerHTML=Object.keys(state.reports).sort((a,b)=>a-b).map(k=>`<div class="saved-report"><b>Day ${Number(k)+1} · ${DAYS[k].date}</b><span>${state.reports[k].actualMinutes||0} min · ${state.reports[k].pyqCount||0} PYQs · ${state.reports[k].accuracy??"—"}% accuracy</span></div>`).join("");
}
function renderAll(){renderDays();renderSubjects();renderTasks();renderTimerTasks();renderStats();renderReport();}
function initSelects(){
  document.getElementById("taskDayFilter").innerHTML='<option value="all">All days</option>'+DAYS.map((d,i)=>`<option value="${i}">Day ${i+1}</option>`).join("");
  document.getElementById("reportDay").innerHTML=DAYS.map((d,i)=>`<option value="${i}">Day ${i+1} · ${d.date}</option>`).join("");
  document.getElementById("newTaskDay").innerHTML=DAYS.map((d,i)=>`<option value="${i}">Day ${i+1} · ${d.date}</option>`).join("");
  document.getElementById("newTaskSubject").innerHTML=SUBJECTS.map(s=>`<option>${esc(s[0])}</option>`).join("");
}
function addTask(){
  const name=document.getElementById("newTaskName").value.trim(),minutes=Number(document.getElementById("newTaskMinutes").value);
  if(!name||!Number.isFinite(minutes)||minutes<5||minutes>360){toast("Enter a task and a target between 5 and 360 minutes.");return;}
  state.tasks.push({id:"custom-"+Date.now(),name,subject:document.getElementById("newTaskSubject").value,day:Number(document.getElementById("newTaskDay").value),minutes,status:"pending",loggedMinutes:0});
  document.getElementById("taskDialog").close();document.getElementById("taskForm").reset();save();toast("Your task has been added.");
}
function setMode(btn){
  document.querySelectorAll(".mode-btn").forEach(b=>b.classList.toggle("active",b===btn));
  focusMinutes=Number(btn.dataset.minutes);breakMinutes=Number(btn.dataset.break);isBreak=false;stopTimer();timerSeconds=focusMinutes*60;updateTimer();
}
function updateTimer(){
  document.getElementById("timerDisplay").textContent=`${String(Math.floor(timerSeconds/60)).padStart(2,"0")}:${String(timerSeconds%60).padStart(2,"0")}`;
  document.getElementById("timerLabel").textContent=isBreak?"BREAK SESSION":"FOCUS SESSION";
  document.getElementById("timerStart").textContent=timerRunning?"Pause":"Start";
}
function stopTimer(){if(timerInterval)clearInterval(timerInterval);timerInterval=null;timerRunning=false;updateTimer();}
function startTimer(){
  if(timerRunning){stopTimer();return;}
  if(!document.getElementById("timerTask").value&&!isBreak){toast("Add or select a pending task first.");return;}
  timerRunning=true;updateTimer();
  timerInterval=setInterval(()=>{
    timerSeconds--;updateTimer();
    if(timerSeconds<=0){
      clearInterval(timerInterval);timerInterval=null;timerRunning=false;
      if(!isBreak){
        const t=state.tasks.find(x=>x.id===document.getElementById("timerTask").value);
        if(t)t.loggedMinutes=(Number(t.loggedMinutes)||0)+focusMinutes;
        save();notify("Focus session complete","Great work. Take your planned break.");
        isBreak=true;timerSeconds=breakMinutes*60;document.getElementById("timerMessage").textContent="Focus session complete. Your break is ready.";
      }else{isBreak=false;timerSeconds=focusMinutes*60;notify("Break finished","Ready for another focus session?");document.getElementById("timerMessage").textContent="Break finished. Start your next focus session.";}
      updateTimer();
    }
  },1000);
}
function resetTimer(){stopTimer();isBreak=false;timerSeconds=focusMinutes*60;updateTimer();}
function notify(title,body){
  if("Notification"in window&&Notification.permission==="granted"){try{new Notification(title,{body});}catch(e){}}
  toast(title+" — "+body);
}
async function requestNotifications(){
  if(!("Notification"in window)){toast("This browser does not support desktop notifications.");return;}
  const p=await Notification.requestPermission();toast(p==="granted"?"Notifications enabled while this site is open.":"Notification permission was not granted.");
}
function downloadCalendar(){
  const events=[];
  DAYS.forEach((d,i)=>{
    const date=dateForDay(i),ymd=date.toISOString().slice(0,10).replaceAll("-","");
    [["060000","080000","Morning study · 2 hours"],["130000","140000","Afternoon study · 1 hour"],["180000","210000","Evening study · 3 hours"]].forEach((slot,j)=>{
      const desc=DAYS[i].slots.filter((_,k)=>j===0?k<2:j===1?k===2:k>=3).map(s=>s[1]+": "+s[2]).join("\\n");
      events.push(`BEGIN:VEVENT\nUID:nayab-study-${i}-${j}@study-manager\nDTSTAMP:20261125T120000Z\nDTSTART;TZID=Asia/Kolkata:${ymd}T${slot[0]}\nDTEND;TZID=Asia/Kolkata:${ymd}T${slot[1]}\nSUMMARY:${slot[2]}\nDESCRIPTION:${desc.replace(/,/g,"\\\\,")}\nBEGIN:VALARM\nTRIGGER:-PT5M\nACTION:DISPLAY\nDESCRIPTION:Study session starts in 5 minutes\nEND:VALARM\nEND:VEVENT`);
    });
  });
  const ics="BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Nayab//Smart Study Manager//EN\nCALSCALE:GREGORIAN\n"+events.join("\n")+"\nEND:VCALENDAR";
  const blob=new Blob([ics],{type:"text/calendar;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="Nayab-7-Day-Study-Reminders.ics";a.click();URL.revokeObjectURL(a.href);
  toast("Calendar file downloaded. Import it into Google Calendar.");
}
function saveReport(){
  const day=Number(document.getElementById("reportDay").value);
  const actualMinutes=Number(document.getElementById("actualMinutes").value||0),pyqCount=Number(document.getElementById("pyqCount").value||0),accuracy=document.getElementById("accuracy").value;
  if(actualMinutes<0||actualMinutes>1440||pyqCount<0||accuracy!==""&&(Number(accuracy)<0||Number(accuracy)>100)){toast("Check the report values.");return;}
  state.reports[day]={actualMinutes,pyqCount,accuracy:accuracy===""?null:Number(accuracy),topicsDone:document.getElementById("topicsDone").value,weakTopics:document.getElementById("weakTopics").value};
  save();document.getElementById("reportSaved").textContent="Saved just now.";toast("Daily report saved.");
}
function downloadReport(){
  const rows=[["Day","Date","Actual study minutes","PYQs solved","Accuracy","Topics completed","Weak topics"]];
  DAYS.forEach((d,i)=>{const r=state.reports[i]||{};rows.push([i+1,d.date,r.actualMinutes||0,r.pyqCount||0,r.accuracy??"",r.topicsDone||"",r.weakTopics||""]);});
  const csv=rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(",")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="Nayab-study-performance-report.csv";a.click();URL.revokeObjectURL(a.href);
}
function logPractice(type){
  const n=prompt(type==="PYQ"?"How many previous-year questions did you solve?":"How many minutes did you revise?",type==="PYQ"?"5":"30");if(n===null)return;
  const value=Number(n);if(!Number.isFinite(value)||value<0){toast("Enter a valid number.");return;}
  const entry={date:new Date().toISOString(),value,day:selectedDay};
  if(type==="PYQ")state.pyqLogs.push(entry);else state.revisionLogs.push(entry);
  const report=state.reports[selectedDay]||{actualMinutes:0,pyqCount:0};if(type==="PYQ")report.pyqCount=(Number(report.pyqCount)||0)+value;else report.actualMinutes=(Number(report.actualMinutes)||0)+value;
  state.reports[selectedDay]=report;save();toast(`${type} activity logged.`);
}
function resetAll(){if(!confirm("This will permanently clear all locally saved study tasks and reports. Continue?"))return;localStorage.removeItem(KEY);state=loadState();renderAll();toast("Study data has been reset.");}
function init(){
  initSelects();
  document.getElementById("taskDayFilter").onchange=renderTasks;document.getElementById("taskStatusFilter").onchange=renderTasks;
  document.getElementById("reportDay").onchange=renderReport;
  document.getElementById("addTaskBtn").onclick=()=>document.getElementById("taskDialog").showModal();
  document.getElementById("saveTaskBtn").onclick=e=>{e.preventDefault();addTask();};
  document.getElementById("timerStart").onclick=startTimer;document.getElementById("timerReset").onclick=resetTimer;
  document.getElementById("timerBreak").onclick=()=>{stopTimer();isBreak=true;timerSeconds=breakMinutes*60;updateTimer();document.getElementById("timerMessage").textContent="Break timer ready.";};
  document.querySelectorAll(".mode-btn").forEach(b=>b.onclick=()=>setMode(b));
  document.getElementById("timerTask").onchange=()=>{const t=state.tasks.find(x=>x.id===document.getElementById("timerTask").value);if(t)document.getElementById("youtubeLink").href="https://www.youtube.com/results?search_query="+encodeURIComponent("MAKAUT "+t.subject+" "+t.name+" Hindi");};
  document.getElementById("exportCalendarBtn").onclick=downloadCalendar;
  document.getElementById("saveReportBtn").onclick=saveReport;document.getElementById("downloadReportBtn").onclick=downloadReport;
  document.getElementById("pyqLogBtn").onclick=()=>logPractice("PYQ");document.getElementById("revisionLogBtn").onclick=()=>logPractice("Revision");
  document.getElementById("resetAllBtn").onclick=resetAll;
  renderAll();
}
init();
