import { useState, useMemo } from "react";
import {
  Pencil, Plus, Trash2, Lock, Check, ChevronDown, Phone, Globe,
  Star, DollarSign, ShieldCheck, Bus, Clock, GraduationCap, Puzzle,
  CalendarDays, AlertCircle, Info, Sparkles, Building2, MapPin, Tag,
  HandCoins, FileText, Shield, Receipt, Users, Mail, Trophy, Eye,
  Link2, GripVertical, ListChecks, ArrowUp, ArrowDown,
} from "lucide-react";

/* ───────── primitives ───────── */

const EditBtn = ({ label = "Edit" }) => (
  <button className="flex items-center gap-1 text-xs text-neutral-300 hover:text-white px-2 py-1 rounded-md hover:bg-neutral-800 transition-colors">
    <Pencil size={11} /> {label}
  </button>
);
const ViewOnly = () => <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded-md font-medium">View Only</span>;

const SectionTitle = ({ title, sub }) => (
  <div className="mt-8 mb-3">
    <h2 className="text-sm font-semibold text-white">{title}</h2>
    {sub && <p className="text-xs text-neutral-500 mt-1">{sub}</p>}
  </div>
);

const Card = ({ icon: Icon, title, action, children, className = "" }) => (
  <div className={`bg-neutral-900 border border-neutral-800 rounded-xl p-4 ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-white">{Icon && <Icon size={14} className="text-neutral-400" />} {title}</div>
        {action}
      </div>
    )}
    {children}
  </div>
);

const Chip = ({ active, onClick, children, pending }) => (
  <button onClick={onClick}
    className={`text-xs px-3 py-1.5 rounded-full border transition-colors text-left
      ${pending ? "border-amber-600 text-amber-400 bg-neutral-900"
        : active ? "bg-neutral-100 text-neutral-900 border-neutral-100 font-medium"
        : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500"}`}>
    {children}{pending && <span className="ml-1.5 text-amber-500">· pending review</span>}
  </button>
);

const Select = ({ value, onChange, options, placeholder }) => (
  <div className="relative inline-block">
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-lg pl-3 pr-8 py-2 hover:border-neutral-500 focus:outline-none focus:border-neutral-400 cursor-pointer">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
  </div>
);

const TextInput = ({ value, onChange, placeholder, className = "", type = "text" }) => (
  <input type={type} value={value} placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    style={type === "date" ? { colorScheme: "dark" } : undefined}
    className={`bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-400 ${className}`} />
);

const Toggle = ({ on, onChange, label }) => (
  <button onClick={() => onChange(!on)} className="flex items-center gap-2 group">
    <span className={`rounded-full p-0.5 transition-colors ${on ? "bg-emerald-600" : "bg-neutral-700"}`} style={{ height: 18, width: 32 }}>
      <span className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform ${on ? "translate-x-3.5" : ""}`} />
    </span>
    <span className="text-xs text-neutral-300 group-hover:text-white text-left">{label}</span>
  </button>
);

const Banner = ({ children, tone = "violet" }) => {
  const tones = { violet: "border-violet-700 bg-violet-950 text-violet-200", amber: "border-amber-700 bg-neutral-900 text-amber-300" };
  return <div className={`flex items-start gap-2 border rounded-lg px-3 py-2.5 text-xs ${tones[tone]}`}><Info size={13} className="mt-0.5 shrink-0" /> <div>{children}</div></div>;
};

const FieldValue = ({ children, empty }) => <p className={`text-sm mt-2 ${empty ? "text-neutral-500 italic" : "text-neutral-200"}`}>{children}</p>;
const Stamp = ({ when }) => <span className="text-xs text-neutral-500">{when ? `Last updated: ${when}` : "Last updated: —"}</span>;

/* ───────── taxonomies ───────── */

const LEARNING_MODELS = ["Montessori","Classical Learning","Project-Based Learning","Inquiry-Based Learning","Child-Centered Learning","Dual Language","STEM","Religious","Microschool","Single-Gender","Culturally Responsive","Holistic / Whole-Child","Expeditionary / Outdoor","University-Model","Hybrid / Homeschool Co-op","Virtual / Online","Self-Directed (Acton-style)","International Baccalaureate","Traditional / College-Prep","Core Knowledge"];
const TEACHING_STYLES = ["Teacher-Led","Student-Led","Blended"];
const ACADEMIC_PROGRAMS = ["AP Courses","Honors / Advanced","Dual Credit / Dual Enrollment","IB Programme","OnRamps","STEM Program / Endorsement","Robotics & Engineering","Computer Science Pathway","CTE Pathways","Industry Certifications","Internships / Work-Based Learning","College Counseling Program"];
const CTE_TRACKS = ["Health Science","IT","Business","Construction / Trades","Culinary","Agriculture","Public Service","Arts / AV"];
const EXTRACURRICULARS = ["Soccer","Basketball","Football","Baseball / Softball","Track & Field","Swimming","Tennis","Volleyball","Cheerleading","Martial Arts","Band","Orchestra","Choir / Vocal","Guitar / Piano","Theater / Drama","Visual Arts","Dance","Robotics","Coding / Computer Science","Math Competitions","Science Olympiad","Debate / Speech","Student Government","Community Service","Yearbook / Journalism"];
const NEEDS = ["Autism Spectrum","ADHD / Executive Function","Dyslexia","Dysgraphia","Dyscalculia","Speech & Language","Down Syndrome","Intellectual Disabilities","Emotional / Behavioral","Hearing Impairment","Vision Impairment","Physical / Mobility","Gifted & Twice-Exceptional (2e)"];
const PLANS = ["IEP (implemented)","504 Plan","Individual Service Plan (ISP)","Informal accommodations only"];
const DELIVERY = ["Full inclusion","Co-teaching","Pull-out / resource room","Small-group intervention (RTI / MTSS)","Self-contained classroom","1:1 aide supported"];
const SPECIALISTS = ["SPED-certified teacher","Speech-Language Pathologist","Occupational Therapist","Dyslexia specialist / CALT","Behavior specialist / BCBA","Counselor","Diagnostician / Psychologist","Reading interventionist"];
const AUTISM_OFFERINGS = ["Mainstream inclusion w/ accommodations","Structured social-skills programming","Dedicated autism classroom / program","ABA therapy on site","Sensory accommodations","BCBA / RBT on staff","Peer-model / reverse-inclusion"];
const TRANSPORT = ["District bus","Private bus / shuttle","Carpool network","Public transit accessible","None"];
const AID_TYPES = ["Need-based","Merit","Parish / Church subsidy","Scholarship fund"];
const SAFETY = ["Secured single-point entry","SRO / police officer on site","Camera coverage","Visitor management system","Regular emergency drills"];
const FEE_NAMES = ["Registration","Materials","Technology","Activity","Other"];
const FEE_FREQ = ["One-time","Annual","Monthly"];
const SERVED_GRADES = ["5th","6th"];
const QUESTION_TYPES = ["Short text","Long text","Multiple choice","Yes / No"];

const nowStamp = () => "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ───────── main ───────── */

export default function SchoolProfileDemo() {
  const [schoolType, setSchoolType] = useState("Public");

  /* combined enrollment + open seats */
  const [appStatus, setAppStatus] = useState("Accepting applications");
  const [appStatusStamp, setAppStatusStamp] = useState(null);
  const [seatRows, setSeatRows] = useState([
    { grade: "5th", status: "", seats: "" },
    { grade: "6th", status: "", seats: "" },
  ]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [seatsSavedAt, setSeatsSavedAt] = useState(null);
  const [appOpen, setAppOpen] = useState("");
  const [deadline, setDeadline] = useState("");
  const [rolling, setRolling] = useState(false);
  const [midYear, setMidYear] = useState(false);

  /* description */
  const [desc, setDesc] = useState("Barbar C. Jordan Intermediate School is an above average, public school located in CIBOLO, TX. It has 769 students in grades 5-6 with a student-teacher ratio of 15 to 1. According to state test scores, 53% of students are at least proficient in math and 58% in reading.");
  const [editingDesc, setEditingDesc] = useState(false);

  /* money */
  const [tuitionMode, setTuitionMode] = useState("single");
  const [singleTuition, setSingleTuition] = useState("");
  const [tuitionRows, setTuitionRows] = useState([{ band: "5th", amount: "" }, { band: "6th", amount: "" }]);
  const [siblingDiscount, setSiblingDiscount] = useState(false);
  const [multiChildCap, setMultiChildCap] = useState(false);
  const TEFA_AWARD = 10330;
  const [tefa, setTefa] = useState("Not participating");
  const tefaVerified = false;
  const [aidAvailable, setAidAvailable] = useState(false);
  const [aidTypes, setAidTypes] = useState([]);
  const [aidHow, setAidHow] = useState("");
  const [aidDeadline, setAidDeadline] = useState("");
  const [fees, setFees] = useState([]);

  /* logistics */
  const [transport, setTransport] = useState(["District bus"]);
  const [radius, setRadius] = useState("");
  const [transportMapUrl, setTransportMapUrl] = useState("");
  const [careBefore, setCareBefore] = useState(false);
  const [careAfter, setCareAfter] = useState(false);
  const [careDrop, setCareDrop] = useState("7:00 AM");
  const [carePick, setCarePick] = useState("6:00 PM");
  const [careCost, setCareCost] = useState("");
  const [uniform, setUniform] = useState("");
  const [uniformNote, setUniformNote] = useState("");

  /* academics */
  const [models, setModels] = useState(["Project-Based Learning"]);
  const [teachStyle, setTeachStyle] = useState("");
  const [programs, setPrograms] = useState([]);
  const [cteTracks, setCteTracks] = useState([]);
  const [programDetail, setProgramDetail] = useState("");
  const [ratioRows, setRatioRows] = useState(SERVED_GRADES.map((g) => ({ grade: g, students: "", teachers: "" })));

  /* extracurriculars + custom */
  const [extras, setExtras] = useState([]);
  const [customExtra, setCustomExtra] = useState("");
  const [pendingExtras, setPendingExtras] = useState([]);
  const [customProgram, setCustomProgram] = useState("");
  const [pendingPrograms, setPendingPrograms] = useState([]);

  /* special ed */
  const [acceptsSped, setAcceptsSped] = useState(true); // Tier 0 gate
  const [needs, setNeeds] = useState(["Dyslexia"]);
  const [customNeed, setCustomNeed] = useState("");
  const [pendingNeeds, setPendingNeeds] = useState([]);
  const [plans, setPlans] = useState(["IEP (implemented)", "504 Plan"]);
  const [delivery, setDelivery] = useState(["Small-group intervention (RTI / MTSS)"]);
  const [aideFunding, setAideFunding] = useState("School-provided");
  const [specialists, setSpecialists] = useState({});
  const [autismOfferings, setAutismOfferings] = useState([]);
  const [autismFit, setAutismFit] = useState([]);
  const [spedCost, setSpedCost] = useState("");
  const [spedFee, setSpedFee] = useState("");
  const [admAcceptsRecords, setAdmAcceptsRecords] = useState(false);
  const [admRecordsReview, setAdmRecordsReview] = useState(false);
  const [admShadowDay, setAdmShadowDay] = useState(false);
  const [admEvalOnsite, setAdmEvalOnsite] = useState(false);
  const [tier, setTier] = useState("Tier 1 — Accommodating");

  /* safety */
  const [safety, setSafety] = useState([]);
  const [discipline, setDiscipline] = useState("");
  const [disciplineNote, setDisciplineNote] = useState("");
  const [bullyUrl, setBullyUrl] = useState("");
  const [cultureNote, setCultureNote] = useState("");

  /* tours */
  const [tourMode, setTourMode] = useState("By appointment");
  const [slots, setSlots] = useState([]);
  const [tourDates, setTourDates] = useState([]);
  const [openHouses, setOpenHouses] = useState([]);
  const [tourQuestions, setTourQuestions] = useState([
    { q: "Which grade are you enrolling?", type: "Short text", required: true, options: "" },
  ]);

  /* recruitment */
  const [recName, setRecName] = useState("");
  const [recEmail, setRecEmail] = useState("gotiwod455@fanchatu.com");
  const [recPhone, setRecPhone] = useState("");

  const toggleIn = (arr, set) => (v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const evidenceCap = useMemo(() => {
    const onStaff = Object.values(specialists).filter((v) => v === "On staff").length;
    const dedicated = delivery.includes("Self-contained classroom");
    const informalOnly = plans.length === 1 && plans[0] === "Informal accommodations only";
    const referralOnly = Object.keys(specialists).length > 0 && Object.values(specialists).every((v) => v === "By referral");
    if (informalOnly && (referralOnly || Object.keys(specialists).length === 0)) return 1;
    if (onStaff >= 1 && dedicated) return 3;
    if (onStaff >= 1 || dedicated) return 2;
    return 1;
  }, [specialists, delivery, plans]);
  const declaredLevel = tier.startsWith("Tier 3") ? 3 : tier.startsWith("Tier 2") ? 2 : 1;
  const tierMismatch = acceptsSped && declaredLevel > evidenceCap;
  const iepWarning = schoolType === "Private" && plans.includes("IEP (implemented)");

  const annualFees = useMemo(() => fees.reduce((s, f) => s + (Number(f.amount) || 0) * (f.freq === "Monthly" ? 12 : 1), 0), [fees]);
  const seatsVisible = appStatus !== "Closed for this year";
  const unknownGrades = seatRows.filter((r) => !r.status).map((r) => r.grade);
  const availableGrades = SERVED_GRADES.filter((g) => !seatRows.some((r) => r.grade === g));

  const completeness = useMemo(() => {
    const checks = [
      appStatus !== "",
      !seatsVisible || (seatRows.length > 0 && seatRows.every((r) => r.status)),
      tefa !== "", transport.length > 0, models.length > 0, teachStyle !== "",
      !acceptsSped || (needs.length > 0 && plans.length > 0 && delivery.length > 0 && Object.keys(specialists).length > 0 && spedCost !== ""),
      uniform !== "", safety.length > 0, discipline !== "", extras.length > 0, programs.length > 0,
      ratioRows.every((r) => r.students && r.teachers),
      schoolType === "Public" || (tuitionMode === "single" ? !!singleTuition : tuitionRows.every((r) => r.amount)),
      tourMode === "By appointment" || slots.length > 0 || tourDates.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [appStatus, seatsVisible, seatRows, tefa, transport, models, teachStyle, acceptsSped, needs, plans, delivery, specialists, spedCost, uniform, safety, discipline, extras, programs, ratioRows, schoolType, tuitionMode, singleTuition, tuitionRows, tourMode, slots, tourDates]);

  const addPending = (value, setValue, pending, setPending) => { const v = value.trim(); if (!v) return; setPending([...pending, v]); setValue(""); };
  const moveQ = (i, dir) => {
    const j = i + dir; if (j < 0 || j >= tourQuestions.length) return;
    const next = [...tourQuestions]; [next[i], next[j]] = [next[j], next[i]]; setTourQuestions(next);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <div className="h-8 bg-black border-b border-neutral-900" />
      <div className="px-6 py-3 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-neutral-400">School Admin <span className="mx-1 text-neutral-600">›</span> <span className="text-white font-medium">School Profile</span></p>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Eye size={11} /> Demo — preview as:
          <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            {["Public", "Private"].map((t) => (
              <button key={t} onClick={() => setSchoolType(t)} className={`px-2.5 py-1 rounded-md transition-colors ${schoolType === t ? "bg-neutral-700 text-white font-medium" : "text-neutral-400 hover:text-white"}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* header */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex gap-4">
          <div className="w-20 h-20 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 relative">
            <Building2 size={28} className="text-neutral-500" />
            <span className="absolute -bottom-1.5 -right-1.5 bg-neutral-700 rounded-full p-1.5 border border-neutral-600"><Pencil size={9} /></span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap"><h1 className="text-lg font-bold text-white">Barbar C. Jordan Intermediate School</h1><EditBtn /></div>
            <p className="text-xs text-neutral-400 mt-1.5 flex items-center gap-1.5"><Tag size={11} /> Type: {schoolType}</p>
            <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">Grades: 5th grade, 6th grade <EditBtn /></p>
            <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5"><MapPin size={11} /> 515 THISTLE CREEK DR, CIBOLO, TX, 78108 <EditBtn /></p>
          </div>
          <div className="ml-auto w-52 shrink-0 hidden md:block">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-400 flex items-center gap-1"><Sparkles size={11} /> Profile completeness</span>
              <span className={`font-semibold ${completeness >= 80 ? "text-emerald-400" : completeness >= 50 ? "text-amber-400" : "text-neutral-300"}`}>{completeness}%</span>
            </div>
            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${completeness >= 80 ? "bg-emerald-500" : completeness >= 50 ? "bg-amber-500" : "bg-neutral-500"}`} style={{ width: `${completeness}%` }} />
            </div>
            <p className="text-xs text-neutral-500 mt-1.5">Complete profiles appear in more parent searches.</p>
          </div>
        </div>

        {/* ── ENROLLMENT (combined with open seats) ── */}
        <SectionTitle title="Enrollment & Open Seats" sub="Set whether you're accepting applications, then report seats by grade. Closing applications hides the seat report from parents." />
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5"><GraduationCap size={13} /> Application status</span>
              <Select value={appStatus} onChange={(v) => { setAppStatus(v); setAppStatusStamp(nowStamp()); }}
                options={["Accepting applications", "Waitlist only", "Closed for this year"]} />
            </div>
            <Stamp when={appStatusStamp} />
          </div>
          {appStatus === "Closed for this year" && (
            <div className="mt-3"><Banner tone="amber">Applications are closed. Your school stays visible to parents with a "Not currently accepting" badge, and the open-seats report is hidden until you reopen.</Banner></div>
          )}

          {seatsVisible && (
            <div className="mt-4 border-t border-neutral-800 pt-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs text-neutral-400">Report open seats by grade. Updates are reviewed by Data Ops before they appear on your public profile.</p>
                <p className="text-xs"><span className="font-semibold text-white">Last confirmed:</span> <span className="text-neutral-400">{seatsSavedAt || "Not yet confirmed"}</span></p>
              </div>
              {unknownGrades.length > 0 && <div className="mt-3"><Banner>Current availability is unknown for {unknownGrades.join(", ")}. Choose Open, Waitlist, or Full for each unknown grade before submitting.</Banner></div>}
              <div className="mt-3 divide-y divide-neutral-800">
                {seatRows.map((row) => (
                  <div key={row.grade} className="py-3 flex flex-wrap items-center gap-4">
                    <span className="text-sm font-medium text-white w-10">{row.grade}</span>
                    <Select value={row.status} placeholder="Choose availability"
                      onChange={(v) => setSeatRows(seatRows.map((r) => r.grade === row.grade ? { ...r, status: v, seats: v === "Full" ? "0" : r.seats } : r))}
                      options={["Open", "Waitlist", "Full"]} />
                    {row.status === "Open" && <TextInput type="number" value={row.seats} placeholder="# seats" onChange={(v) => setSeatRows(seatRows.map((r) => r.grade === row.grade ? { ...r, seats: v } : r))} className="w-24" />}
                    {row.status === "Full" && <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded-md">Full — waitlist badge shows to parents</span>}
                    {!row.status && <span className="text-xs text-violet-400">Current status: Unknown. Choose a new status to submit.</span>}
                    <button onClick={() => setDeleteTarget(row.grade)} className="ml-auto text-neutral-500 hover:text-red-400 p-1.5 rounded-md hover:bg-neutral-800 transition-colors"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {availableGrades.length > 0 && (
                  <button onClick={() => setSeatRows([...seatRows, { grade: availableGrades[0], status: "", seats: "" }])}
                    className="flex items-center gap-1.5 text-xs text-neutral-300 border border-dashed border-neutral-700 hover:border-neutral-500 px-3 py-2 rounded-lg transition-colors"><Plus size={12} /> Add grade ({availableGrades.join(", ")} available)</button>
                )}
                <button onClick={() => unknownGrades.length === 0 && setSeatsSavedAt(nowStamp())} disabled={unknownGrades.length > 0}
                  className={`text-xs px-4 py-2 rounded-lg font-medium transition-colors ${unknownGrades.length > 0 ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" : "bg-neutral-100 text-neutral-900 hover:bg-white"}`}>Save open seats</button>
              </div>
            </div>
          )}

          {/* enrollment window */}
          <div className="mt-4 border-t border-neutral-800 pt-4">
            <p className="text-xs font-medium text-neutral-300 mb-3 flex items-center gap-1.5"><CalendarDays size={13} /> Enrollment window</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2"><span className="text-xs text-neutral-400">Applications open:</span><TextInput type="date" value={appOpen} onChange={setAppOpen} /></div>
              <div className="flex items-center gap-2"><span className="text-xs text-neutral-400">Deadline:</span><TextInput type="date" value={deadline} onChange={setDeadline} /></div>
              <Toggle on={rolling} onChange={setRolling} label="Rolling admissions" />
              <Toggle on={midYear} onChange={setMidYear} label="Mid-year enrollment accepted" />
            </div>
            {rolling && <p className="text-xs text-neutral-500 mt-2">With rolling admissions, the deadline is optional — parents see "applications accepted year-round."</p>}
          </div>
        </Card>

        {deleteTarget && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 max-w-md mx-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2"><AlertCircle size={15} className="text-amber-400" /> Remove {deleteTarget} grade?</h3>
              <p className="text-xs text-neutral-400 mt-3 leading-relaxed">Removing this grade tells parents your school <span className="text-white font-medium">does not offer or report {deleteTarget} grade</span> — it disappears from seat-based search results.</p>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">If {deleteTarget} grade is simply <span className="text-white font-medium">full</span>, keep the row and set availability to "Full" — your school stays visible with a "Full — waitlist" badge.</p>
              <div className="flex justify-end gap-2 mt-5">
                <button onClick={() => setDeleteTarget(null)} className="text-xs px-3 py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:border-neutral-500">Keep grade</button>
                <button onClick={() => { setSeatRows(seatRows.filter((r) => r.grade !== deleteTarget)); setDeleteTarget(null); }} className="text-xs px-3 py-2 rounded-lg bg-red-900 text-red-200 hover:bg-red-800 border border-red-800">Remove grade</button>
              </div>
            </div>
          </div>
        )}

        {/* about */}
        <SectionTitle title="About your school" />
        <Card icon={FileText} title="Description" action={<EditBtn label={editingDesc ? "Done" : "Edit"} />}>
          <div onClick={() => setEditingDesc(true)}>
            {editingDesc ? (
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} onBlur={() => setEditingDesc(false)} rows={4} autoFocus
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-400" />
            ) : <p className="text-xs text-neutral-300 leading-relaxed cursor-text">{desc}</p>}
          </div>
        </Card>

        {/* money */}
        <SectionTitle title="Tuition & Financial Support" sub="Tuition can vary by grade. TEFA verification is managed by SchoolPath." />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <Card icon={DollarSign} title="Tuition (per year)" action={<EditBtn />}>
              {schoolType === "Public" ? <FieldValue>Free / Public — tuition fields are hidden for public schools.</FieldValue> : (
                <>
                  <div className="flex gap-1 bg-neutral-800 rounded-lg p-1 w-fit mb-3">
                    {["single", "by-grade"].map((m) => <button key={m} onClick={() => setTuitionMode(m)} className={`text-xs px-3 py-1.5 rounded-md transition-colors ${tuitionMode === m ? "bg-neutral-600 text-white font-medium" : "text-neutral-400 hover:text-white"}`}>{m === "single" ? "Single tuition" : "By grade level"}</button>)}
                  </div>
                  {tuitionMode === "single" ? <TextInput value={singleTuition} onChange={setSingleTuition} placeholder="Annual tuition, e.g. 9500" className="w-full" /> : (
                    <div className="flex flex-col gap-2">{tuitionRows.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 flex-wrap">
                        <Select value={r.band} onChange={(v) => setTuitionRows(tuitionRows.map((x, j) => i === j ? { ...x, band: v } : x))} options={SERVED_GRADES} />
                        <TextInput value={r.amount} onChange={(v) => setTuitionRows(tuitionRows.map((x, j) => i === j ? { ...x, amount: v } : x))} placeholder="$ / yr" className="w-28" />
                        {r.amount && tefa === "Accepting TEFA" && <span className="text-xs text-emerald-400">≈ ${Math.max(0, Number(r.amount) - TEFA_AWARD).toLocaleString()} after TEFA</span>}
                      </div>))}</div>
                  )}
                  <div className="flex gap-5 mt-3 flex-wrap"><Toggle on={siblingDiscount} onChange={setSiblingDiscount} label="Sibling discount" /><Toggle on={multiChildCap} onChange={setMultiChildCap} label="Multi-child cap" /></div>
                </>
              )}
            </Card>
            <Card icon={Receipt} title="Fees" action={<EditBtn />}>
              {fees.length === 0 && <p className="text-xs text-neutral-500">List registration, materials, technology, or activity fees so families aren't surprised.</p>}
              <div className="flex flex-col gap-2">{fees.map((f, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  <Select value={f.name} onChange={(v) => setFees(fees.map((x, j) => i === j ? { ...x, name: v } : x))} options={FEE_NAMES} />
                  <TextInput value={f.amount} onChange={(v) => setFees(fees.map((x, j) => i === j ? { ...x, amount: v } : x))} placeholder="$" className="w-20" />
                  <Select value={f.freq} onChange={(v) => setFees(fees.map((x, j) => i === j ? { ...x, freq: v } : x))} options={FEE_FREQ} />
                  <button onClick={() => setFees(fees.filter((_, j) => j !== i))} className="text-neutral-500 hover:text-red-400 p-1"><Trash2 size={13} /></button>
                </div>))}</div>
              <button onClick={() => setFees([...fees, { name: "Registration", amount: "", freq: "Annual" }])} className="flex items-center gap-1.5 text-xs text-neutral-300 border border-dashed border-neutral-700 hover:border-neutral-500 px-3 py-2 rounded-lg w-fit mt-2 transition-colors"><Plus size={12} /> Add fee</button>
              {annualFees > 0 && <p className="text-xs text-neutral-400 mt-2.5">Estimated added cost, first year: <span className="text-white font-medium">${annualFees.toLocaleString()}</span></p>}
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <Card icon={ShieldCheck} title="TEFA / ESA Participation" action={<EditBtn />}>
              <div className="flex items-center gap-2 flex-wrap">
                <Select value={tefa} onChange={setTefa} options={["Accepting TEFA", "Certification pending", "Not participating"]} />
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${tefaVerified ? "border-emerald-700 text-emerald-400" : "border-neutral-700 text-neutral-500"}`}><Lock size={10} /> {tefaVerified ? "Verified provider" : "Not verified"}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2.5">Verification is confirmed by SchoolPath and can't be self-set. <button className="text-neutral-300 underline underline-offset-2 hover:text-white">Request verification</button></p>
            </Card>
            <Card icon={HandCoins} title="Financial Aid / Scholarships" action={<EditBtn />}>
              <Toggle on={aidAvailable} onChange={setAidAvailable} label="Financial aid available" />
              {aidAvailable && (
                <div className="mt-3 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">{AID_TYPES.map((t) => <Chip key={t} active={aidTypes.includes(t)} onClick={() => toggleIn(aidTypes, setAidTypes)(t)}>{t}</Chip>)}</div>
                  <TextInput value={aidHow} onChange={setAidHow} placeholder="How to apply (note or URL)" className="w-full" />
                  <div className="flex items-center gap-2"><span className="text-xs text-neutral-400">Aid deadline (optional):</span><TextInput type="date" value={aidDeadline} onChange={setAidDeadline} /></div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* logistics */}
        <SectionTitle title="Logistics & Daily Life" sub="The first things working parents check." />
        <div className="grid md:grid-cols-3 gap-4">
          <Card icon={Bus} title="Transportation" action={<EditBtn />}>
            <div className="flex flex-wrap gap-1.5">{TRANSPORT.map((t) => (
              <Chip key={t} active={transport.includes(t)} onClick={() => { if (t === "None") setTransport(["None"]); else setTransport(transport.includes(t) ? transport.filter((x) => x !== t) : [...transport.filter((x) => x !== "None"), t]); }}>{t}</Chip>
            ))}</div>
            {transport.some((t) => t !== "None") && (
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center gap-2"><span className="text-xs text-neutral-400">Service radius (mi, optional):</span><TextInput type="number" value={radius} onChange={setRadius} className="w-16" /></div>
                <div className="flex items-center gap-2"><Link2 size={12} className="text-neutral-500" /><TextInput value={transportMapUrl} onChange={setTransportMapUrl} placeholder="Link to your route / service map" className="w-full" /></div>
                {transportMapUrl && <span className="text-xs text-emerald-400 flex items-center gap-1"><Check size={11} /> Parents will see a "View service map" link</span>}
              </div>
            )}
          </Card>
          <Card icon={Clock} title="Before / After Care" action={<EditBtn />}>
            <div className="flex gap-5 flex-wrap"><Toggle on={careBefore} onChange={setCareBefore} label="Before care" /><Toggle on={careAfter} onChange={setCareAfter} label="After care" /></div>
            {(careBefore || careAfter) && (
              <div className="flex flex-col gap-2 mt-3 text-xs text-neutral-400">
                {careBefore && <span>Earliest drop-off: <Select value={careDrop} onChange={setCareDrop} options={["6:30 AM","7:00 AM","7:30 AM"]} /></span>}
                {careAfter && <span>Latest pick-up: <Select value={carePick} onChange={setCarePick} options={["5:30 PM","6:00 PM","6:30 PM"]} /></span>}
                <TextInput value={careCost} onChange={setCareCost} placeholder="Cost note (display only)" className="w-full" />
              </div>
            )}
          </Card>
          <Card icon={Users} title="Uniforms / Dress Code" action={<EditBtn />}>
            <Select value={uniform} placeholder="Choose policy" onChange={setUniform} options={["Uniform required", "Dress code (no uniform)", "No formal policy"]} />
            {uniform && <div className="mt-2"><TextInput value={uniformNote} onChange={setUniformNote} placeholder="Optional note (200 chars)" className="w-full" /></div>}
          </Card>
        </div>

        {/* academics */}
        <SectionTitle title="Learning Models & Academic Programs" sub="Now editable by your school — these power how families match with you." />
        <div className="flex flex-col gap-4">
          <Card title="Learning Models" action={<span className="text-xs text-neutral-500">Synced with SchoolPath admin</span>}>
            <div className="flex flex-wrap gap-1.5">{LEARNING_MODELS.map((m) => <Chip key={m} active={models.includes(m)} onClick={() => toggleIn(models, setModels)(m)}>{m}</Chip>)}</div>
            <div className="flex items-center gap-2 mt-4"><span className="text-xs font-medium text-neutral-300">Primary Teaching Style:</span><Select value={teachStyle} placeholder="None" onChange={setTeachStyle} options={TEACHING_STYLES} /></div>
            <p className="text-xs text-neutral-500 mt-3">Selected: {models.length ? models.join(", ") : "none"}</p>
          </Card>

          <Card title="Academic & Career Programs" action={<EditBtn />}>
            <div className="flex flex-wrap gap-1.5">
              {ACADEMIC_PROGRAMS.map((p) => <Chip key={p} active={programs.includes(p)} onClick={() => { const next = programs.includes(p) ? programs.filter((x) => x !== p) : [...programs, p]; if (p === "CTE Pathways" && programs.includes(p)) setCteTracks([]); setPrograms(next); }}>{p}</Chip>)}
              {pendingPrograms.map((t) => <Chip key={t} pending onClick={() => {}}>{t}</Chip>)}
            </div>
            {programs.includes("CTE Pathways") && (
              <div className="mt-3 pl-3 border-l-2 border-neutral-700">
                <p className="text-xs font-medium text-neutral-300 mb-2">CTE pathways offered</p>
                <div className="flex flex-wrap gap-1.5">{CTE_TRACKS.map((t) => <Chip key={t} active={cteTracks.includes(t)} onClick={() => toggleIn(cteTracks, setCteTracks)(t)}>{t}</Chip>)}</div>
              </div>
            )}
            {programs.includes("AP Courses") && <div className="mt-3"><TextInput value={programDetail} onChange={setProgramDetail} placeholder="Optional detail, e.g. '14 AP courses offered'" className="w-full max-w-sm" /></div>}
            <div className="flex items-center gap-2 mt-3">
              <TextInput value={customProgram} onChange={setCustomProgram} placeholder="Add a program not listed above" className="flex-1 max-w-sm" />
              <button onClick={() => addPending(customProgram, setCustomProgram, pendingPrograms, setPendingPrograms)} className="text-xs px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-neutral-500">Add</button>
            </div>
            {pendingPrograms.length > 0 && <p className="text-xs text-amber-500 mt-2">Custom entries show as pending and go to SchoolPath for review — they aren't added to the shared list until approved.</p>}
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card title="Student–Teacher Ratio" action={<EditBtn />}>
              <p className="text-xs text-neutral-500 mb-3">Enter students and teachers per grade — the ratio is calculated for parents.</p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 text-xs text-neutral-500 pl-12"><span className="w-20">Students</span><span className="w-20">Teachers</span><span>Ratio</span></div>
                {ratioRows.map((r, i) => {
                  const s = Number(r.students), t = Number(r.teachers);
                  const ratio = s && t ? `${Math.round(s / t)} : 1` : "—";
                  return (
                    <div key={r.grade} className="flex items-center gap-3">
                      <span className="text-xs text-neutral-300 w-10">{r.grade}</span>
                      <TextInput type="number" value={r.students} onChange={(v) => setRatioRows(ratioRows.map((x, j) => i === j ? { ...x, students: v } : x))} placeholder="0" className="w-20" />
                      <TextInput type="number" value={r.teachers} onChange={(v) => setRatioRows(ratioRows.map((x, j) => i === j ? { ...x, teachers: v } : x))} placeholder="0" className="w-20" />
                      <span className={`text-xs ${ratio === "—" ? "text-neutral-500" : "text-emerald-400 font-medium"}`}>{ratio}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card icon={Trophy} title="Extracurricular Programs" action={<EditBtn />}>
              <div className="flex flex-wrap gap-1.5">
                {EXTRACURRICULARS.map((e) => <Chip key={e} active={extras.includes(e)} onClick={() => toggleIn(extras, setExtras)(e)}>{e}</Chip>)}
                {pendingExtras.map((t) => <Chip key={t} pending onClick={() => {}}>{t}</Chip>)}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <TextInput value={customExtra} onChange={setCustomExtra} placeholder="Add an activity not listed" className="flex-1 max-w-sm" />
                <button onClick={() => addPending(customExtra, setCustomExtra, pendingExtras, setPendingExtras)} className="text-xs px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-neutral-500">Add</button>
              </div>
            </Card>
          </div>
        </div>

        {/* special education */}
        <SectionTitle title="Special Education & Learning Support" sub="Structured so families can tell exactly what support looks like at your school." />
        <Card>
          <Toggle on={acceptsSped} onChange={setAcceptsSped} label="This school can accommodate students with special education needs" />
          {!acceptsSped && <div className="mt-3"><Banner>Your school will display as <span className="font-semibold">"Not a special-education provider"</span> and won't appear in needs-based searches. Families looking for support won't be directed here — which spares both sides a bad-fit inquiry.</Banner></div>}
        </Card>

        {acceptsSped && (
          <div className="flex flex-col gap-4 mt-4">
            <Card icon={Puzzle} title="A · Needs supported" action={<EditBtn />}>
              <div className="flex flex-wrap gap-1.5">
                {NEEDS.map((n) => <Chip key={n} active={needs.includes(n)} onClick={() => { const next = needs.includes(n) ? needs.filter((x) => x !== n) : [...needs, n]; if (n === "Autism Spectrum" && needs.includes(n)) { setAutismOfferings([]); setAutismFit([]); } setNeeds(next); }}>{n}</Chip>)}
                {pendingNeeds.map((t) => <Chip key={t} pending onClick={() => {}}>{t}</Chip>)}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <TextInput value={customNeed} onChange={setCustomNeed} placeholder="Other — add a support type" className="flex-1 max-w-sm" />
                <button onClick={() => addPending(customNeed, setCustomNeed, pendingNeeds, setPendingNeeds)} className="text-xs px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-neutral-500">Add</button>
              </div>
            </Card>

            {needs.includes("Autism Spectrum") && (
              <Card title="Autism Spectrum Support — tell families more" className="border-neutral-700">
                <p className="text-xs text-neutral-500 mb-3">Autism support varies more school-to-school than any other need. These details help the right families find you.</p>
                <p className="text-xs font-medium text-neutral-300 mb-2">What your school offers</p>
                <div className="flex flex-wrap gap-1.5">{AUTISM_OFFERINGS.map((o) => <Chip key={o} active={autismOfferings.includes(o)} onClick={() => toggleIn(autismOfferings, setAutismOfferings)(o)}>{o}</Chip>)}</div>
                <p className="text-xs font-medium text-neutral-300 mt-4 mb-2">Best fit for students who…</p>
                <div className="flex flex-wrap gap-1.5">{["Access grade-level curriculum with supports", "Need a modified curriculum"].map((f) => <Chip key={f} active={autismFit.includes(f)} onClick={() => toggleIn(autismFit, setAutismFit)(f)}>{f}</Chip>)}</div>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <Card title="B · Plans honored" action={<EditBtn />}>
                <div className="flex flex-wrap gap-1.5">{PLANS.map((p) => <Chip key={p} active={plans.includes(p)} onClick={() => toggleIn(plans, setPlans)(p)}>{p}</Chip>)}</div>
                {iepWarning && <div className="mt-3"><Banner tone="amber">Private schools generally can't implement public-school IEPs — most offer an Individual Service Plan (ISP) instead. You can keep this, but consider whether ISP describes your support more accurately.</Banner></div>}
              </Card>
              <Card title="C · Service delivery" action={<EditBtn />}>
                <div className="flex flex-wrap gap-1.5">{DELIVERY.map((d) => <Chip key={d} active={delivery.includes(d)} onClick={() => toggleIn(delivery, setDelivery)(d)}>{d}</Chip>)}</div>
                {delivery.includes("1:1 aide supported") && <div className="flex items-center gap-2 mt-3"><span className="text-xs text-neutral-400">Aide is:</span><Select value={aideFunding} onChange={setAideFunding} options={["School-provided", "Parent-funded", "Either"]} /></div>}
              </Card>
            </div>

            <Card title="D · On-site specialists" action={<EditBtn />}>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">{SPECIALISTS.map((s) => (
                <div key={s} className="flex items-center justify-between gap-3"><span className="text-xs text-neutral-300">{s}</span>
                  <Select value={specialists[s] || ""} placeholder="—" onChange={(v) => setSpecialists({ ...specialists, [s]: v || undefined })} options={["On staff", "Contracted", "By referral"]} /></div>
              ))}</div>
              <p className="text-xs text-neutral-500 mt-3">"On staff" carries the most weight with families — it's the difference between a program and a referral list.</p>
            </Card>

            <Card title="E · Cost & admission" action={<EditBtn />}>
              <div className="flex items-center gap-2 flex-wrap"><span className="text-xs text-neutral-400">Support services cost:</span>
                <Select value={spedCost} placeholder="Choose" onChange={setSpedCost} options={["Included in tuition", "Additional fee", "Varies by service"]} />
                {spedCost === "Additional fee" && <TextInput value={spedFee} onChange={setSpedFee} placeholder="$ amount (optional)" className="w-32" />}</div>
              <div className="grid sm:grid-cols-2 gap-2.5 mt-4">
                <Toggle on={admAcceptsRecords} onChange={setAdmAcceptsRecords} label="Accepts students with existing IEP/504 records" />
                <Toggle on={admRecordsReview} onChange={setAdmRecordsReview} label="Requires records review" />
                <Toggle on={admShadowDay} onChange={setAdmShadowDay} label="Shadow day / visit required" />
                <Toggle on={admEvalOnsite} onChange={setAdmEvalOnsite} label="Conducts evaluations on-site" />
              </div>
              <p className="text-xs text-neutral-500 mt-3">Display-only for parents — answering honestly here prevents bad-fit inquiries; it never lowers your ranking.</p>
            </Card>

            <Card title="Your school's support level" action={null}>
              <div className="grid md:grid-cols-3 gap-2.5">
                {[
                  { t: "Tier 1 — Accommodating", d: "Mainstream school; supports needs case-by-case through accommodations and inclusion." },
                  { t: "Tier 2 — Dedicated Program", d: "A named program with dedicated staff inside a mainstream school." },
                  { t: "Tier 3 — Specialized School", d: "Serving students with learning differences is your school's core mission." },
                ].map(({ t, d }) => (
                  <button key={t} onClick={() => setTier(t)} className={`text-left p-3 rounded-lg border transition-colors ${tier === t ? "border-neutral-300 bg-neutral-800" : "border-neutral-800 bg-neutral-900 hover:border-neutral-600"}`}>
                    <p className="text-xs font-semibold text-white flex items-center gap-1.5">{tier === t && <Check size={12} className="text-emerald-400" />}{t}</p>
                    <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{d}</p>
                  </button>
                ))}
              </div>
              {tierMismatch ? (
                <div className="mt-3"><Banner tone="amber">Your selections in Plans, Delivery, and Specialists don't yet support this tier — it will display as <span className="font-semibold">unverified</span> and has been flagged for SchoolPath review. Adding on-staff specialists or a dedicated delivery model strengthens it.</Banner></div>
              ) : declaredLevel > 1 ? <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1.5"><Check size={12} /> Your structured details support this tier. Families filtering for this need will see your badge.</p> : null}
            </Card>
          </div>
        )}

        {/* safety */}
        <SectionTitle title="Safety & Culture" sub="Informational for families — these never affect your ranking." />
        <div className="grid md:grid-cols-3 gap-4">
          <Card icon={Shield} title="Safety Measures" action={<EditBtn />}>
            <div className="flex flex-wrap gap-1.5">{SAFETY.map((s) => <Chip key={s} active={safety.includes(s)} onClick={() => toggleIn(safety, setSafety)(s)}>{s}</Chip>)}</div>
          </Card>
          <Card title="Discipline Philosophy" action={<EditBtn />}>
            <Select value={discipline} placeholder="Choose approach" onChange={setDiscipline} options={["Restorative", "Traditional", "PBIS", "Mixed / other"]} />
            {discipline && <div className="mt-2"><TextInput value={disciplineNote} onChange={setDisciplineNote} placeholder="Optional description (300 chars)" className="w-full" /></div>}
          </Card>
          <Card title="Bullying Policy & Culture" action={<EditBtn />}>
            <div className="flex flex-col gap-2">
              <TextInput value={bullyUrl} onChange={setBullyUrl} placeholder="Link to bullying policy (URL)" className="w-full" />
              <textarea value={cultureNote} onChange={(e) => setCultureNote(e.target.value)} rows={2} placeholder="School culture statement (300 chars)" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-400" />
            </div>
          </Card>
        </div>

        {/* tours */}
        <SectionTitle title="Tours & Open Houses" sub="Publish when families can visit — tour requests will arrive with a proposed time attached." />
        <div className="grid md:grid-cols-2 gap-4">
          <Card icon={CalendarDays} title="Tour availability" action={<EditBtn />}>
            <Select value={tourMode} onChange={setTourMode} options={["By appointment", "Recurring weekly slots", "Specific dates"]} />
            {tourMode === "By appointment" && <p className="text-xs text-neutral-500 mt-2.5">Families send a free-form request and you coordinate from your inquiry inbox — today's default.</p>}
            {tourMode === "Recurring weekly slots" && (
              <div className="mt-3 flex flex-col gap-2">
                {slots.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Select value={s.day} onChange={(v) => setSlots(slots.map((x, j) => i === j ? { ...x, day: v } : x))} options={["Monday","Tuesday","Wednesday","Thursday","Friday"]} />
                    <Select value={s.time} onChange={(v) => setSlots(slots.map((x, j) => i === j ? { ...x, time: v } : x))} options={["8:30 AM","9:00 AM","10:00 AM","1:00 PM","2:00 PM"]} />
                    <button onClick={() => setSlots(slots.filter((_, j) => j !== i))} className="text-neutral-500 hover:text-red-400 p-1"><Trash2 size={13} /></button>
                  </div>
                ))}
                <button onClick={() => setSlots([...slots, { day: "Tuesday", time: "9:00 AM" }])} className="flex items-center gap-1.5 text-xs text-neutral-300 border border-dashed border-neutral-700 hover:border-neutral-500 px-3 py-2 rounded-lg w-fit transition-colors"><Plus size={12} /> Add weekly slot</button>
              </div>
            )}
            {tourMode === "Specific dates" && (
              <div className="mt-3 flex flex-col gap-2">
                {tourDates.map((o, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <TextInput type="date" value={o.date} onChange={(v) => setTourDates(tourDates.map((x, j) => i === j ? { ...x, date: v } : x))} />
                    <Select value={o.time} onChange={(v) => setTourDates(tourDates.map((x, j) => i === j ? { ...x, time: v } : x))} options={["9:00 AM","10:00 AM","1:00 PM","2:00 PM"]} />
                    <button onClick={() => setTourDates(tourDates.filter((_, j) => j !== i))} className="text-neutral-500 hover:text-red-400 p-1"><Trash2 size={13} /></button>
                  </div>
                ))}
                <button onClick={() => setTourDates([...tourDates, { date: "", time: "9:00 AM" }])} className="flex items-center gap-1.5 text-xs text-neutral-300 border border-dashed border-neutral-700 hover:border-neutral-500 px-3 py-2 rounded-lg w-fit transition-colors"><Plus size={12} /> Add tour date</button>
              </div>
            )}

            {/* pre-tour question builder */}
            <div className="mt-4 border-t border-neutral-800 pt-4">
              <p className="text-xs font-medium text-neutral-300 mb-1 flex items-center gap-1.5"><ListChecks size={13} /> Questions before a tour is booked</p>
              <p className="text-xs text-neutral-500 mb-3">Parents answer these when they request a tour — like a short intake form.</p>
              <div className="flex flex-col gap-2">
                {tourQuestions.map((q, i) => (
                  <div key={i} className="border border-neutral-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col gap-0.5 pt-1">
                        <button onClick={() => moveQ(i, -1)} disabled={i === 0} className="text-neutral-600 hover:text-neutral-300 disabled:opacity-30"><ArrowUp size={12} /></button>
                        <button onClick={() => moveQ(i, 1)} disabled={i === tourQuestions.length - 1} className="text-neutral-600 hover:text-neutral-300 disabled:opacity-30"><ArrowDown size={12} /></button>
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <TextInput value={q.q} onChange={(v) => setTourQuestions(tourQuestions.map((x, j) => i === j ? { ...x, q: v } : x))} placeholder="Question text" className="w-full" />
                        <div className="flex items-center gap-3 flex-wrap">
                          <Select value={q.type} onChange={(v) => setTourQuestions(tourQuestions.map((x, j) => i === j ? { ...x, type: v } : x))} options={QUESTION_TYPES} />
                          <Toggle on={q.required} onChange={(v) => setTourQuestions(tourQuestions.map((x, j) => i === j ? { ...x, required: v } : x))} label="Required" />
                          <button onClick={() => setTourQuestions(tourQuestions.filter((_, j) => j !== i))} className="text-neutral-500 hover:text-red-400 p-1 ml-auto"><Trash2 size={13} /></button>
                        </div>
                        {q.type === "Multiple choice" && (
                          <TextInput value={q.options} onChange={(v) => setTourQuestions(tourQuestions.map((x, j) => i === j ? { ...x, options: v } : x))} placeholder="Choices, comma-separated (e.g. 5th, 6th)" className="w-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setTourQuestions([...tourQuestions, { q: "", type: "Short text", required: false, options: "" }])} className="flex items-center gap-1.5 text-xs text-neutral-300 border border-dashed border-neutral-700 hover:border-neutral-500 px-3 py-2 rounded-lg w-fit mt-2 transition-colors"><Plus size={12} /> Add question</button>
            </div>
          </Card>

          <Card icon={CalendarDays} title="Open House events" action={<EditBtn />}>
            {openHouses.length === 0 && <p className="text-xs text-neutral-500">Published events show on your profile and the parent Events page. Past events auto-archive.</p>}
            <div className="flex flex-col gap-3">
              {openHouses.map((o, i) => (
                <div key={i} className="border border-neutral-800 rounded-lg p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <TextInput value={o.title} onChange={(v) => setOpenHouses(openHouses.map((x, j) => i === j ? { ...x, title: v } : x))} placeholder="Event title, e.g. Fall Open House" className="flex-1" />
                    <button onClick={() => setOpenHouses(openHouses.filter((_, j) => j !== i))} className="text-neutral-500 hover:text-red-400 p-1"><Trash2 size={13} /></button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <TextInput type="date" value={o.date} onChange={(v) => setOpenHouses(openHouses.map((x, j) => i === j ? { ...x, date: v } : x))} />
                    <Select value={o.time} onChange={(v) => setOpenHouses(openHouses.map((x, j) => i === j ? { ...x, time: v } : x))} options={["9:00 AM","10:00 AM","5:30 PM","6:00 PM"]} />
                    <Toggle on={o.rsvp} onChange={(v) => setOpenHouses(openHouses.map((x, j) => i === j ? { ...x, rsvp: v } : x))} label="Collect RSVPs" />
                  </div>
                  <TextInput value={o.descr} onChange={(v) => setOpenHouses(openHouses.map((x, j) => i === j ? { ...x, descr: v } : x))} placeholder="Short description" className="w-full" />
                </div>
              ))}
            </div>
            <button onClick={() => setOpenHouses([...openHouses, { title: "", date: "", time: "9:00 AM", descr: "", rsvp: true }])} className="flex items-center gap-1.5 text-xs text-neutral-300 border border-dashed border-neutral-700 hover:border-neutral-500 px-3 py-2 rounded-lg w-fit mt-3 transition-colors"><Plus size={12} /> Add open house</button>
          </Card>
        </div>

        {/* school info */}
        <SectionTitle title="School Information" />
        <div className="grid md:grid-cols-2 gap-4">
          <Card icon={Phone} title="Phone Number" action={<EditBtn />}><FieldValue>(210) 619-4250</FieldValue></Card>
          <Card icon={Globe} title="Website" action={<EditBtn />}><FieldValue>https://www.scucisd.org/</FieldValue></Card>
          <Card icon={Star} title="Rating" action={<ViewOnly />}><FieldValue>5.0/5</FieldValue></Card>
          <Card icon={ShieldCheck} title="Accreditation" action={<ViewOnly />}><FieldValue>Accredited — Texas Private School Accreditation</FieldValue></Card>
        </div>

        {/* recruitment contact */}
        <SectionTitle title="Recruitment Contact" sub="This contact will receive notifications when parents request information about your school." />
        <div className="grid md:grid-cols-3 gap-4">
          <Card icon={Users} title="Contact Name" action={<EditBtn />}>
            <TextInput value={recName} onChange={setRecName} placeholder="Not specified" className="w-full" />
          </Card>
          <Card icon={Mail} title="Contact Email" action={<EditBtn />}>
            <TextInput value={recEmail} onChange={setRecEmail} placeholder="name@school.org" className="w-full" />
          </Card>
          <Card icon={Phone} title="Contact Phone" action={<EditBtn />}>
            <TextInput type="tel" value={recPhone} onChange={setRecPhone} placeholder="(000) 000-0000" className="w-full" />
          </Card>
        </div>

        <p className="text-center text-xs text-neutral-600 mt-10">SchoolPath demo · profile field expansion v1.3 · all data is sample data</p>
      </div>
    </div>
  );
}
