import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, Download, Trash2, Plus, Eye, EyeOff, ChevronDown,
  Menu, X, Home, User, Users, LogOut, Bell, Calendar,
  CheckSquare, Square, Shield, AlertCircle, CheckCircle, Clock,
  Edit3, Lock, Activity, HardDrive, Cpu, Zap, Wrench,
  FileDown, Info, ExternalLink, Settings, ChevronRight,
  PlayCircle, Folder, FolderOpen, Upload, Video, File,
  FileText, BarChart3, Layers, List, LayoutGrid,
  BookOpen, GraduationCap, Package,
  Download as DL,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "guest" | "supervisor" | "it_manager" | "el_manager" | "mechanic_manager";
type Dept = "IT" | "EL" | "ME";
type DeptTab = "software" | "courses";
type SoftwareCat = "Application" | "Utility" | "Driver" | "Firmware" | "Library" | "Tool";
type LogAction = "Login" | "Add File" | "Delete File" | "Create Folder" | "Delete Folder" | "Upload Video" | "Add User" | "Delete User" | "Change Password" | "Update Profile" | "Logout";

interface SoftwareItem {
  id: string; name: string; category: SoftwareCat; department: Dept;
  size: string; sizeBytes: number; version: string; uploadDate: string;
  uploadedBy: string; downloads: number; description: string;
}
interface VideoItem { id: string; title: string; duration: string; size: string; sizeBytes: number; }
interface CourseFolder {
  id: string; name: string; department: Dept; description: string;
  instructor: string; uploadDate: string; videoCount: number;
  totalSize: string; totalSizeBytes: number; downloads: number;
  videos: VideoItem[];
}
interface UserItem {
  id: string; username: string; email: string; phone: string;
  role: Role; createdDate: string; isSelf?: boolean;
}
interface LogItem {
  id: string; adminName: string; role: Role; action: LogAction;
  target: string; date: string; time: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SOFTWARE: SoftwareItem[] = [
  { id:"s1",  name:"AutoCAD LT 2026",         category:"Application", department:"IT", size:"2.4 GB", sizeBytes:2400000000, version:"2026.0",  uploadDate:"2026-06-10", uploadedBy:"j.carter", downloads:342, description:"2D drafting and documentation software" },
  { id:"s2",  name:"Visual Studio Code 1.90", category:"Application", department:"IT", size:"98 MB",  sizeBytes:98000000,  version:"1.90.2", uploadDate:"2026-06-08", uploadedBy:"j.carter", downloads:891, description:"Lightweight code editor by Microsoft" },
  { id:"s3",  name:"Git for Windows 2.45",    category:"Tool",        department:"IT", size:"56 MB",  sizeBytes:56000000,  version:"2.45.1", uploadDate:"2026-05-30", uploadedBy:"admin",    downloads:567, description:"Distributed version control system" },
  { id:"s4",  name:"MATLAB R2026a",           category:"Application", department:"IT", size:"8.2 GB", sizeBytes:8200000000,version:"R2026a", uploadDate:"2026-05-20", uploadedBy:"j.carter", downloads:218, description:"Numeric computing and visualization environment" },
  { id:"s5",  name:"Python 3.12.4",           category:"Library",     department:"IT", size:"28 MB",  sizeBytes:28000000,  version:"3.12.4", uploadDate:"2026-05-10", uploadedBy:"k.nguyen", downloads:1204,description:"High-level programming language runtime" },
  { id:"s6",  name:"Network Scanner Pro",     category:"Utility",     department:"IT", size:"45 MB",  sizeBytes:45000000,  version:"4.2.0",  uploadDate:"2026-04-28", uploadedBy:"j.carter", downloads:189, description:"Advanced network discovery and scanning" },
  { id:"s7",  name:"ETAP 22 Power System",    category:"Application", department:"EL", size:"3.8 GB", sizeBytes:3800000000,version:"22.0.0", uploadDate:"2026-06-15", uploadedBy:"m.silva",  downloads:156, description:"Electrical power system analysis software" },
  { id:"s8",  name:"PLC Programming Suite",   category:"Tool",        department:"EL", size:"512 MB", sizeBytes:512000000, version:"5.6.0",  uploadDate:"2026-06-05", uploadedBy:"m.silva",  downloads:243, description:"Siemens TIA Portal PLC programming environment" },
  { id:"s9",  name:"Fluke DataLogView",       category:"Utility",     department:"EL", size:"34 MB",  sizeBytes:34000000,  version:"3.1.0",  uploadDate:"2026-05-22", uploadedBy:"admin",    downloads:97,  description:"Measurement and data logging software" },
  { id:"s10", name:"Eplan Electric P8",       category:"Application", department:"EL", size:"1.9 GB", sizeBytes:1900000000,version:"2024.0", uploadDate:"2026-05-10", uploadedBy:"m.silva",  downloads:184, description:"Professional electrical engineering CAD" },
  { id:"s11", name:"SolidWorks 2026",         category:"Application", department:"ME", size:"6.5 GB", sizeBytes:6500000000,version:"2026 SP0",uploadDate:"2026-06-18", uploadedBy:"r.hayes", downloads:278, description:"3D CAD design and engineering simulation" },
  { id:"s12", name:"CATIA V5 R34",            category:"Application", department:"ME", size:"7.1 GB", sizeBytes:7100000000,version:"R34 SP3",uploadDate:"2026-06-01", uploadedBy:"r.hayes", downloads:142, description:"Advanced surface and product design software" },
  { id:"s13", name:"Mastercam 2026",          category:"Application", department:"ME", size:"4.3 GB", sizeBytes:4300000000,version:"2026.0", uploadDate:"2026-05-18", uploadedBy:"r.hayes", downloads:199, description:"CAD/CAM software for CNC machining" },
  { id:"s14", name:"ANSYS Mechanical 2026",   category:"Application", department:"ME", size:"9.8 GB", sizeBytes:9800000000,version:"2026 R1",uploadDate:"2026-05-05", uploadedBy:"admin",    downloads:88,  description:"Finite element analysis simulation" },
  { id:"s15", name:"GD&T Advisor 4.0",        category:"Tool",        department:"ME", size:"120 MB", sizeBytes:120000000, version:"4.0.2",  uploadDate:"2026-04-20", uploadedBy:"r.hayes", downloads:305, description:"Geometric dimensioning & tolerancing tool" },
];

const COURSES: CourseFolder[] = [
  {
    id:"c1", name:"Python for Engineers", department:"IT", downloads:643,
    description:"Complete Python programming course tailored for engineering applications — data analysis, automation, and scripting.",
    instructor:"Dr. Sarah Chen", uploadDate:"2026-05-15", videoCount:24,
    totalSize:"18.4 GB", totalSizeBytes:18400000000,
    videos:[
      {id:"v1",title:"Introduction & Setup",      duration:"12:30",size:"380 MB",sizeBytes:380000000},
      {id:"v2",title:"Variables & Data Types",    duration:"18:45",size:"560 MB",sizeBytes:560000000},
      {id:"v3",title:"Control Flow & Loops",      duration:"22:10",size:"680 MB",sizeBytes:680000000},
      {id:"v4",title:"Functions & Modules",       duration:"26:00",size:"780 MB",sizeBytes:780000000},
      {id:"v5",title:"File I/O & Error Handling", duration:"20:15",size:"610 MB",sizeBytes:610000000},
    ],
  },
  {
    id:"c2", name:"Network Security Fundamentals", department:"IT", downloads:421,
    description:"Core cybersecurity principles, network protocols, threat modeling, and secure infrastructure design.",
    instructor:"Prof. James Rao", uploadDate:"2026-04-20", videoCount:18,
    totalSize:"14.2 GB", totalSizeBytes:14200000000,
    videos:[
      {id:"v6", title:"OSI Model Deep Dive",   duration:"30:20",size:"920 MB",sizeBytes:920000000},
      {id:"v7", title:"TCP/IP Protocol Suite", duration:"25:15",size:"760 MB",sizeBytes:760000000},
      {id:"v8", title:"Cryptography Basics",   duration:"28:40",size:"860 MB",sizeBytes:860000000},
    ],
  },
  {
    id:"c3", name:"Power Systems Analysis", department:"EL", downloads:387,
    description:"Comprehensive course on power system analysis, load flow studies, fault analysis, and protection systems.",
    instructor:"Dr. Ahmed Hassan", uploadDate:"2026-06-01", videoCount:30,
    totalSize:"24.8 GB", totalSizeBytes:24800000000,
    videos:[
      {id:"v10",title:"Per-Unit System Explained",duration:"35:00",size:"1.05 GB",sizeBytes:1050000000},
      {id:"v11",title:"Load Flow Analysis",       duration:"40:20",size:"1.2 GB", sizeBytes:1200000000},
      {id:"v12",title:"Fault Analysis Methods",   duration:"38:15",size:"1.15 GB",sizeBytes:1150000000},
    ],
  },
  {
    id:"c4", name:"PLC & Automation Engineering", department:"EL", downloads:512,
    description:"Ladder logic programming, HMI design, SCADA systems, and industrial automation integration.",
    instructor:"Eng. Liu Wei", uploadDate:"2026-05-10", videoCount:22,
    totalSize:"17.6 GB", totalSizeBytes:17600000000,
    videos:[
      {id:"v14",title:"PLC Hardware Overview",    duration:"15:30",size:"465 MB", sizeBytes:465000000},
      {id:"v15",title:"Ladder Logic Programming", duration:"42:00",size:"1.26 GB",sizeBytes:1260000000},
    ],
  },
  {
    id:"c5", name:"Advanced Machine Design", department:"ME", downloads:298,
    description:"Gear train design, bearing selection, fatigue analysis, and tolerance stack-up using modern CAD tools.",
    instructor:"Dr. Maria Santos", uploadDate:"2026-06-10", videoCount:28,
    totalSize:"22.1 GB", totalSizeBytes:22100000000,
    videos:[
      {id:"v17",title:"Gear Train Fundamentals", duration:"33:00",size:"990 MB", sizeBytes:990000000},
      {id:"v18",title:"Bearing Load Analysis",   duration:"27:45",size:"835 MB", sizeBytes:835000000},
    ],
  },
  {
    id:"c6", name:"CNC Machining & G-Code", department:"ME", downloads:436,
    description:"CNC machine operation, G-code/M-code programming, tool path optimization, and quality control.",
    instructor:"Eng. Robert Kim", uploadDate:"2026-04-25", videoCount:20,
    totalSize:"15.8 GB", totalSizeBytes:15800000000,
    videos:[
      {id:"v20",title:"CNC Machine Types",     duration:"18:00",size:"540 MB", sizeBytes:540000000},
      {id:"v21",title:"G-Code Programming",    duration:"44:30",size:"1.33 GB",sizeBytes:1330000000},
    ],
  },
];

const USERS: UserItem[] = [
  { id:"u1", username:"admin",    email:"admin@acadevault.edu",    phone:"+1 555-0100", role:"supervisor",       createdDate:"2025-01-15", isSelf:true },
  { id:"u2", username:"j.carter", email:"j.carter@acadevault.edu", phone:"+1 555-0201", role:"it_manager",       createdDate:"2025-03-22" },
  { id:"u3", username:"m.silva",  email:"m.silva@acadevault.edu",  phone:"+1 555-0302", role:"el_manager",       createdDate:"2025-04-10" },
  { id:"u4", username:"r.hayes",  email:"r.hayes@acadevault.edu",  phone:"+1 555-0403", role:"mechanic_manager", createdDate:"2025-05-07" },
  { id:"u5", username:"k.nguyen", email:"k.nguyen@acadevault.edu", phone:"+1 555-0504", role:"it_manager",       createdDate:"2026-01-18" },
];

const LOGS: LogItem[] = [
  { id:"l1",  adminName:"admin",    role:"supervisor",       action:"Login",           target:"System",                      date:"2026-06-23", time:"08:14:32" },
  { id:"l2",  adminName:"j.carter", role:"it_manager",       action:"Upload Video",    target:"Python for Engineers",        date:"2026-06-23", time:"09:02:18" },
  { id:"l3",  adminName:"admin",    role:"supervisor",       action:"Add User",        target:"k.nguyen",                    date:"2026-06-23", time:"10:35:44" },
  { id:"l4",  adminName:"m.silva",  role:"el_manager",       action:"Create Folder",   target:"Power Systems Analysis",      date:"2026-06-22", time:"14:22:07" },
  { id:"l5",  adminName:"r.hayes",  role:"mechanic_manager", action:"Add File",        target:"GD&T Advisor 4.0",            date:"2026-06-22", time:"15:48:33" },
  { id:"l6",  adminName:"admin",    role:"supervisor",       action:"Change Password", target:"Own Account",                 date:"2026-06-21", time:"11:05:19" },
  { id:"l7",  adminName:"j.carter", role:"it_manager",       action:"Update Profile",  target:"Own Account",                 date:"2026-06-21", time:"13:17:55" },
  { id:"l8",  adminName:"admin",    role:"supervisor",       action:"Delete User",     target:"old.user",                    date:"2026-06-20", time:"09:44:22" },
  { id:"l9",  adminName:"m.silva",  role:"el_manager",       action:"Login",           target:"System",                      date:"2026-06-20", time:"08:01:09" },
  { id:"l10", adminName:"r.hayes",  role:"mechanic_manager", action:"Delete File",     target:"Legacy CAD v2.0",             date:"2026-06-19", time:"16:30:47" },
  { id:"l11", adminName:"k.nguyen", role:"it_manager",       action:"Upload Video",    target:"Network Security Fundamentals",date:"2026-06-19",time:"10:22:15" },
  { id:"l12", adminName:"admin",    role:"supervisor",       action:"Logout",          target:"System",                      date:"2026-06-18", time:"18:00:05" },
];

const ACCOUNTS: Record<string,{role:Role;pw:string}> = {
  admin:     {role:"supervisor",       pw:"Admin@123"},
  "j.carter":{role:"it_manager",       pw:"IT@pass1"},
  "m.silva": {role:"el_manager",       pw:"EL@pass1"},
  "r.hayes": {role:"mechanic_manager", pw:"ME@pass1"},
  "k.nguyen":{role:"it_manager",       pw:"IT@pass2"},
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const NAVY = "#0B3A82";
const NAVY_MED = "#1A52A8";
const NAVY_LIGHT = "#EBF0FA";
const NAVY_BORDER = "#BAD4FF";

const ROLE_LABELS: Record<Role,string> = {
  guest:"Guest", supervisor:"Supervisor",
  it_manager:"IT Manager", el_manager:"EL Manager", mechanic_manager:"Mechanic Manager",
};
const ROLE_BADGE: Record<Role,string> = {
  guest:"bg-slate-100 text-slate-600 border-slate-200",
  supervisor:"bg-violet-100 text-violet-700 border-violet-200",
  it_manager:"bg-blue-100 text-blue-800 border-blue-200",
  el_manager:"bg-amber-100 text-amber-800 border-amber-200",
  mechanic_manager:"bg-emerald-100 text-emerald-800 border-emerald-200",
};
const ACTION_META: Record<LogAction,{color:string;dot:string}> = {
  "Login":           {color:"bg-blue-50 text-blue-800 border-blue-200",      dot:"bg-blue-500"},
  "Add File":        {color:"bg-emerald-50 text-emerald-800 border-emerald-200",dot:"bg-emerald-500"},
  "Delete File":     {color:"bg-red-50 text-red-700 border-red-200",         dot:"bg-red-500"},
  "Create Folder":   {color:"bg-teal-50 text-teal-800 border-teal-200",      dot:"bg-teal-500"},
  "Delete Folder":   {color:"bg-rose-50 text-rose-700 border-rose-200",      dot:"bg-rose-500"},
  "Upload Video":    {color:"bg-indigo-50 text-indigo-800 border-indigo-200",dot:"bg-indigo-500"},
  "Add User":        {color:"bg-cyan-50 text-cyan-800 border-cyan-200",      dot:"bg-cyan-500"},
  "Delete User":     {color:"bg-red-50 text-red-700 border-red-200",         dot:"bg-red-500"},
  "Change Password": {color:"bg-amber-50 text-amber-800 border-amber-200",   dot:"bg-amber-500"},
  "Update Profile":  {color:"bg-sky-50 text-sky-700 border-sky-200",         dot:"bg-sky-500"},
  "Logout":          {color:"bg-slate-50 text-slate-600 border-slate-200",   dot:"bg-slate-400"},
};
const SW_CATS: SoftwareCat[] = ["Application","Utility","Driver","Firmware","Library","Tool"];
const CAT_STYLE: Record<SoftwareCat,{bg:string;text:string;border:string}> = {
  Application:{bg:"bg-blue-50",   text:"text-blue-800",   border:"border-blue-200"},
  Utility:    {bg:"bg-teal-50",   text:"text-teal-800",   border:"border-teal-200"},
  Driver:     {bg:"bg-amber-50",  text:"text-amber-800",  border:"border-amber-200"},
  Firmware:   {bg:"bg-orange-50", text:"text-orange-800", border:"border-orange-200"},
  Library:    {bg:"bg-violet-50", text:"text-violet-800", border:"border-violet-200"},
  Tool:       {bg:"bg-emerald-50",text:"text-emerald-800",border:"border-emerald-200"},
};
const DEPT_META = {
  IT:{label:"Information Technology",icon:<Cpu size={18}/>,   accent:"#1D4ED8",light:"#EFF6FF",border:"#BFDBFE"},
  EL:{label:"Electrical Engineering", icon:<Zap size={18}/>,  accent:"#B45309",light:"#FFFBEB",border:"#FDE68A"},
  ME:{label:"Mechanical Engineering",icon:<Wrench size={18}/>,accent:"#065F46",light:"#ECFDF5",border:"#A7F3D0"},
};

function fmtBytes(b:number){if(b>=1e9)return(b/1e9).toFixed(1)+" GB";if(b>=1e6)return(b/1e6).toFixed(1)+" MB";return(b/1e3).toFixed(0)+" KB";}
function fmtDl(n:number){return n>=1000?(n/1000).toFixed(1)+"k":String(n);}

function pwStr(pw:string){
  let s=0;
  if(pw.length>=8)s++;if(pw.length>=12)s++;if(/[A-Z]/.test(pw))s++;if(/[0-9]/.test(pw))s++;if(/[^A-Za-z0-9]/.test(pw))s++;
  const m=[{l:"Very Weak",c:"#EF4444"},{l:"Weak",c:"#F97316"},{l:"Fair",c:"#F59E0B"},{l:"Good",c:"#0B3A82"},{l:"Strong",c:"#16A34A"},{l:"Excellent",c:"#059669"}];
  return{score:s,...m[Math.min(s,5)]};
}

// ─── Atoms ────────────────────────────────────────────────────────────────────
function Badge({children,className="",style={}}:{children:React.ReactNode;className?:string;style?:React.CSSProperties}){
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${className}`} style={style}>{children}</span>;
}
function Spin(){return <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin flex-shrink-0 inline-block"/>;}
function Skeleton({className=""}:{className?:string}){return <div className={`rounded-lg animate-pulse bg-slate-200 ${className}`}/>;}
function EmptyState({icon,title,sub,action}:{icon:React.ReactNode;title:string;sub:string;action?:React.ReactNode}){
  return(
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">{icon}</div>
      <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{sub}</p>
      {action&&<div className="mt-4">{action}</div>}
    </div>
  );
}

function Btn({children,onClick,variant="primary",size="md",className="",disabled=false,type="button"}:{
  children:React.ReactNode;onClick?:()=>void;
  variant?:"primary"|"secondary"|"ghost"|"danger"|"outline"|"subtle";
  size?:"xs"|"sm"|"md"|"lg";className?:string;disabled?:boolean;type?:"button"|"submit";
}){
  const base="inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 whitespace-nowrap";
  const sz={xs:"px-2 py-1 text-[11px]",sm:"px-3 py-1.5 text-xs",md:"px-4 py-2 text-sm",lg:"px-5 py-2.5 text-sm"};
  const va={
    primary:"text-white active:scale-[0.98] focus:ring-blue-400 shadow-sm",
    secondary:"text-[#0B3A82] hover:opacity-90 focus:ring-blue-300 border border-[#BAD4FF]",
    ghost:"bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300",
    danger:"bg-[#DC2626] text-white hover:bg-red-700 active:scale-[0.98] focus:ring-red-400 shadow-sm",
    outline:"bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-300",
    subtle:"bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300",
  };
  const pStyle = variant==="primary" ? {background:NAVY} : variant==="secondary" ? {background:NAVY_LIGHT} : {};
  return(
    <button type={type} onClick={onClick} disabled={disabled} style={pStyle}
      className={`${base} ${sz[size]} ${va[variant]} ${className}`}>
      {children}
    </button>
  );
}

function FieldInput({label,value,onChange,type="text",placeholder="",disabled=false,error="",hint="",pwToggle}:{
  label?:string;value:string;onChange:(v:string)=>void;type?:string;
  placeholder?:string;disabled?:boolean;error?:string;hint?:string;
  pwToggle?:{show:boolean;setShow:(v:boolean)=>void};
}){
  return(
    <div className="flex flex-col gap-1.5">
      {label&&<label className="text-sm font-semibold text-slate-700">{label}</label>}
      <div className="relative">
        <input type={pwToggle?(pwToggle.show?"text":"password"):type} value={value} placeholder={placeholder} disabled={disabled}
          onChange={e=>onChange(e.target.value)}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all
            focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400
            disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-400
            ${pwToggle?"pr-11":""}
            ${error?"border-red-400 bg-red-50/50":"border-slate-200 bg-white hover:border-slate-300"}`}/>
        {pwToggle&&(
          <button type="button" onClick={()=>pwToggle.setShow(!pwToggle.show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
            {pwToggle.show?<EyeOff size={15}/>:<Eye size={15}/>}
          </button>
        )}
      </div>
      {error&&<p className="text-xs text-red-600 flex items-center gap-1.5"><AlertCircle size={11}/>{error}</p>}
      {hint&&!error&&<p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function FieldSel({label,value,onChange,options,className=""}:{label?:string;value:string;onChange:(v:string)=>void;options:{value:string;label:string}[];className?:string;}){
  return(
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label&&<label className="text-sm font-semibold text-slate-700">{label}</label>}
      <div className="relative">
        <select value={value} onChange={e=>onChange(e.target.value)}
          className="w-full px-4 py-2.5 pr-9 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 appearance-none cursor-pointer hover:border-slate-300 transition-all">
          {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
      </div>
    </div>
  );
}

function Modal({open,onClose,title,children,width="max-w-lg"}:{open:boolean;onClose:()=>void;title:string;children:React.ReactNode;width?:string;}){
  useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow="";};},[open]);
  if(!open)return null;
  return(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}/>
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${width} max-h-[90vh] flex flex-col`}
        style={{animation:"mIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both"}}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"><X size={15}/></button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
      <style>{`@keyframes mIn{from{opacity:0;transform:scale(0.93) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

// ─── Download Modal ───────────────────────────────────────────────────────────
function DownloadModal({open,onClose,items}:{open:boolean;onClose:()=>void;items:{name:string;size:string;sizeBytes:number}[];}){
  const [stage,setStage]=useState<"confirm"|"loading"|"done">("confirm");
  const total=items.reduce((a,i)=>a+i.sizeBytes,0);
  useEffect(()=>{if(open)setStage("confirm");},[open]);
  const go=()=>{setStage("loading");setTimeout(()=>setStage("done"),1800);setTimeout(()=>onClose(),3200);};
  return(
    <Modal open={open} onClose={onClose} title="Confirm Download" width="max-w-md">
      {stage==="confirm"&&(
        <div className="space-y-4">
          <div className="rounded-2xl border p-4" style={{background:NAVY_LIGHT,borderColor:NAVY_BORDER}}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border" style={{borderColor:NAVY_BORDER}}>
                <FileDown size={18} style={{color:NAVY}}/>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{items.length} item{items.length!==1?"s":""} selected</p>
                <p className="text-xs text-slate-500">Total: <span className="font-mono font-bold text-slate-800">{fmtBytes(total)}</span></p>
              </div>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {items.map((it,i)=>(
                <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2 border border-white shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:NAVY}}/>
                  <span className="text-xs text-slate-700 flex-1 truncate">{it.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono flex-shrink-0">{it.size}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-amber-800 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
            <Info size={12} className="text-amber-500 flex-shrink-0"/> Multiple files will be packaged as a ZIP archive.
          </p>
          <div className="flex gap-3"><Btn variant="outline" onClick={onClose} className="flex-1">Cancel</Btn><Btn variant="primary" onClick={go} className="flex-1"><FileDown size={14}/> Confirm Download</Btn></div>
        </div>
      )}
      {stage==="loading"&&(
        <div className="py-12 flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4" style={{borderColor:NAVY_LIGHT}}/>
            <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin" style={{borderTopColor:NAVY}}/>
            <div className="absolute inset-3 rounded-full flex items-center justify-center" style={{background:NAVY_LIGHT}}>
              <FileDown size={14} style={{color:NAVY}}/>
            </div>
          </div>
          <div className="text-center"><p className="text-sm font-bold text-slate-800">Preparing download…</p><p className="text-xs text-slate-400 mt-1">Packaging {items.length} item{items.length!==1?"s":""}</p></div>
        </div>
      )}
      {stage==="done"&&(
        <div className="py-12 flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center border border-green-200"><CheckCircle size={26} className="text-green-600"/></div>
          <div className="text-center"><p className="text-sm font-bold text-slate-900">Download started!</p><p className="text-xs text-slate-400 mt-1">{fmtBytes(total)} — saving to your device.</p></div>
        </div>
      )}
    </Modal>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({role,user,onMenu,onNav}:{role:Role;user:string;onMenu:()=>void;onNav:(v:string)=>void;}){
  const [notif,setNotif]=useState(false);
  return(
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 sticky top-0 z-30 flex-shrink-0 shadow-sm">
      <button onClick={onMenu} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Menu size={18}/></button>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0" style={{background:NAVY}}>
          <GraduationCap size={16} className="text-white"/>
        </div>
        <div className="min-w-0">
          <p className="font-extrabold text-sm leading-none" style={{color:NAVY}}>AcadeVault</p>
          <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">Academic Resource Management System</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {role!=="guest"&&(
          <div className="relative">
            <button onClick={()=>setNotif(p=>!p)} className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell size={18}/><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"/>
            </button>
            {notif&&(
              <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">3 new</Badge>
                </div>
                {[
                  {msg:"New course uploaded: CNC Machining & G-Code",time:"5m ago"},
                  {msg:"k.nguyen uploaded 3 videos to Python course",time:"2h ago"},
                  {msg:"Bulk download: 8 programs completed",time:"4h ago"},
                ].map((n,i)=>(
                  <div key={i} className="px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors">
                    <p className="text-xs text-slate-700 leading-snug">{n.msg}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1"><Clock size={9}/>{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {role!=="guest"?(
          <button onClick={()=>onNav("profile")} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm" style={{background:NAVY}}>
              {user.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{user}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{ROLE_LABELS[role]}</p>
            </div>
          </button>
        ):(
          <Btn variant="primary" size="sm" onClick={()=>onNav("login")}><Lock size={13}/> Admin Login</Btn>
        )}
      </div>
    </header>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({role,view,onNav,open,onClose,onLogout}:{role:Role;view:string;onNav:(v:string)=>void;open:boolean;onClose:()=>void;onLogout:()=>void;}){
  const items=[
    {icon:<Home size={16}/>,     label:"Home",       view:"main",    roles:["guest","supervisor","it_manager","el_manager","mechanic_manager"]},
    {icon:<User size={16}/>,     label:"Profile",    view:"profile", roles:["supervisor","it_manager","el_manager","mechanic_manager"]},
    {icon:<Users size={16}/>,    label:"Users",      view:"users",   roles:["supervisor"]},
    {icon:<Activity size={16}/>, label:"Audit Logs", view:"logs",    roles:["supervisor"]},
  ].filter(i=>i.roles.includes(role));

  const body=(
    <aside className="w-52 h-full flex flex-col" style={{background:NAVY}}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.1] lg:hidden">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center"><GraduationCap size={15} className="text-white"/></div>
          <span className="font-extrabold text-white text-sm">AcadeVault</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50"><X size={15}/></button>
      </div>
      <div className="px-4 pt-6 pb-2"><p className="text-[10px] font-bold uppercase tracking-widest text-white/25">Navigation</p></div>
      <nav className="px-3 space-y-0.5 flex-1">
        {items.map(item=>{
          const active=view===item.view;
          return(
            <button key={item.view} onClick={()=>{onNav(item.view);onClose();}}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                ${active?"bg-white/15 text-white shadow-sm":"text-white/50 hover:bg-white/[0.07] hover:text-white/80"}`}>
              <span className={active?"text-blue-200 opacity-100":"opacity-70"}>{item.icon}</span>
              {item.label}
              {active&&<div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-300"/>}
            </button>
          );
        })}
      </nav>
      {role!=="guest"&&(
        <div className="px-3 pb-5 pt-3 border-t border-white/[0.08] mt-4">
          <div className="bg-white/[0.07] rounded-xl p-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {role==="supervisor"?"A":role.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white/90 truncate">{role==="supervisor"?"admin":role.replace("_manager","")}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{ROLE_LABELS[role]}</p>
              </div>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-colors">
            <LogOut size={15}/> Sign Out
          </button>
        </div>
      )}
    </aside>
  );
  return(
    <>
      <div className="hidden lg:flex h-full">{body}</div>
      {open&&(
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
          <div className="absolute left-0 top-0 h-full">{body}</div>
        </div>
      )}
    </>
  );
}

// ─── Role Switcher ────────────────────────────────────────────────────────────
function RoleSwitcher({role,onSwitch}:{role:Role;onSwitch:(r:Role,u:string)=>void;}){
  const [open,setOpen]=useState(false);
  const opts=[
    {role:"guest"as Role,            user:"guest",    label:"Public Guest"},
    {role:"supervisor"as Role,       user:"admin",    label:"Supervisor"},
    {role:"it_manager"as Role,       user:"j.carter", label:"IT Manager"},
    {role:"el_manager"as Role,       user:"m.silva",  label:"EL Manager"},
    {role:"mechanic_manager"as Role, user:"r.hayes",  label:"Mechanic Manager"},
  ];
  return(
    <div className="relative">
      <button onClick={()=>setOpen(p=>!p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors" style={{background:NAVY_LIGHT,color:NAVY,borderColor:NAVY_BORDER}}>
        <Settings size={12}/> Demo Role: {ROLE_LABELS[role]} <ChevronDown size={11} className={`transition-transform ${open?"rotate-180":""}`}/>
      </button>
      {open&&(
        <div className="absolute left-0 top-full mt-1 bg-white rounded-xl border border-slate-100 shadow-xl z-50 py-1 min-w-48 overflow-hidden">
          {opts.map(o=>(
            <button key={o.role} onClick={()=>{onSwitch(o.role,o.user);setOpen(false);}}
              className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 transition-colors
                ${role===o.role?"font-bold":"text-slate-600 hover:bg-slate-50"}`}
              style={role===o.role?{color:NAVY,background:NAVY_LIGHT}:{}}>
              {role===o.role?<CheckCircle size={11} style={{color:NAVY}}/>:<span className="w-[11px]"/>}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
function UploadModal({open,onClose,tab,courses,dept,onAddSw,onAddCourse}:{
  open:boolean;onClose:()=>void;tab:DeptTab;courses:CourseFolder[];dept:Dept;
  onAddSw:(s:SoftwareItem)=>void;onAddCourse:(c:CourseFolder)=>void;
}){
  const [mode,setMode]=useState<"new"|"existing">("new");
  const [folderName,setFolderName]=useState("");
  const [existingId,setExistingId]=useState("");
  const [swName,setSwName]=useState("");
  const [swCat,setSwCat]=useState<SoftwareCat>("Application");
  const [swVer,setSwVer]=useState("");
  const [desc,setDesc]=useState("");
  const [instructor,setInstructor]=useState("");
  const [fileCount,setFileCount]=useState(0);
  const ref=useRef<HTMLInputElement>(null);
  const deptCourses=courses.filter(c=>c.department===dept);

  const submit=()=>{
    if(tab==="software"){
      if(!swName.trim())return;
      onAddSw({id:`s${Date.now()}`,name:swName,category:swCat,department:dept,size:"150 MB",sizeBytes:150000000,version:swVer||"1.0.0",uploadDate:new Date().toISOString().split("T")[0],uploadedBy:"admin",downloads:0,description:desc||"Newly uploaded software"});
    } else {
      const name=mode==="new"?folderName:deptCourses.find(c=>c.id===existingId)?.name||"";
      if(!name.trim())return;
      onAddCourse({id:`c${Date.now()}`,name,department:dept,description:desc||"New course",instructor:instructor||"TBD",uploadDate:new Date().toISOString().split("T")[0],videoCount:fileCount||1,totalSize:"2.4 GB",totalSizeBytes:2400000000,downloads:0,videos:[]});
    }
    onClose();
  };

  return(
    <Modal open={open} onClose={onClose} title={tab==="software"?"Upload Software / Program":"Upload Course Videos"} width="max-w-lg">
      <div className="space-y-4">
        {tab==="software"?(
          <>
            <FieldInput label="Software Name" value={swName} onChange={setSwName} placeholder="e.g. AutoCAD LT 2027"/>
            <div className="grid grid-cols-2 gap-3">
              <FieldSel label="Category" value={swCat} onChange={v=>setSwCat(v as SoftwareCat)} options={SW_CATS.map(c=>({value:c,label:c}))}/>
              <FieldInput label="Version" value={swVer} onChange={setSwVer} placeholder="e.g. 2027.0"/>
            </div>
            <FieldInput label="Description" value={desc} onChange={setDesc} placeholder="Brief description"/>
          </>
        ):(
          <>
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-1">
              {(["new","existing"] as const).map(m=>(
                <button key={m} onClick={()=>setMode(m)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode===m?"text-white shadow-sm":"text-slate-500 hover:text-slate-700"}`}
                  style={mode===m?{background:NAVY}:{}}>
                  {m==="new"?"Create New Folder":"Select Existing Folder"}
                </button>
              ))}
            </div>
            {mode==="new"?(
              <>
                <FieldInput label="Course / Folder Name" value={folderName} onChange={setFolderName} placeholder="e.g. Advanced Machine Design"/>
                <FieldInput label="Instructor" value={instructor} onChange={setInstructor} placeholder="e.g. Dr. Maria Santos"/>
                <FieldInput label="Description" value={desc} onChange={setDesc} placeholder="Brief course overview"/>
              </>
            ):(
              deptCourses.length===0?(
                <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl">No existing folders in {dept} department yet.</p>
              ):(
                <FieldSel label="Select Course Folder" value={existingId} onChange={setExistingId}
                  options={[{value:"",label:"— choose a folder —"},...deptCourses.map(c=>({value:c.id,label:c.name}))]}/>
              )
            )}
          </>
        )}
        {/* Drop Zone */}
        <div className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all group"
          style={{borderColor:NAVY_BORDER,background:NAVY_LIGHT}}
          onClick={()=>ref.current?.click()}>
          <input ref={ref} type="file" multiple className="hidden" onChange={e=>setFileCount(e.target.files?.length||0)}/>
          <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center border-2 border-dashed" style={{background:"white",borderColor:NAVY}}>
            {tab==="software"?<Upload size={18} style={{color:NAVY}}/>:<Video size={18} style={{color:NAVY}}/>}
          </div>
          {fileCount>0?(
            <p className="text-sm font-bold" style={{color:NAVY}}>{fileCount} file{fileCount!==1?"s":""} ready to upload</p>
          ):(
            <>
              <p className="text-sm font-semibold text-slate-700">Drop files here or <span style={{color:NAVY}}>browse</span></p>
              <p className="text-xs text-slate-400 mt-1">{tab==="software"?"EXE, MSI, ZIP up to 20 GB":"MP4, MOV, AVI — multiple videos supported"}</p>
            </>
          )}
        </div>
        <div className="flex gap-3">
          <Btn variant="outline" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn variant="primary" onClick={submit} className="flex-1" disabled={tab==="software"?!swName.trim():mode==="new"?!folderName.trim():!existingId}>
            <Upload size={14}/> {tab==="software"?"Upload Software":"Upload Videos"}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Course Detail Modal ──────────────────────────────────────────────────────
function CourseModal({open,onClose,course,onDownload}:{open:boolean;onClose:()=>void;course:CourseFolder|null;onDownload:(items:{name:string;size:string;sizeBytes:number}[])=>void;}){
  if(!course)return null;
  return(
    <Modal open={open} onClose={onClose} title={course.name} width="max-w-xl">
      <div className="space-y-4">
        <div className="rounded-2xl border p-4" style={{background:NAVY_LIGHT,borderColor:NAVY_BORDER}}>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">{course.description}</p>
          <div className="flex flex-wrap gap-3">
            <span className="text-xs text-slate-500 flex items-center gap-1"><User size={11}/>{course.instructor}</span>
            <span className="text-xs text-slate-500 flex items-center gap-1"><PlayCircle size={11}/>{course.videoCount} videos</span>
            <span className="text-xs text-slate-500 flex items-center gap-1"><HardDrive size={11}/>{course.totalSize}</span>
            <span className="text-xs font-bold flex items-center gap-1" style={{color:"#16A34A"}}><DL size={11}/>{fmtDl(course.downloads)} downloads</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2" style={{color:NAVY}}>
            <Video size={13}/> Course Videos ({course.videos.length} of {course.videoCount} shown)
          </p>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {course.videos.map((v,i)=>(
              <div key={v.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:NAVY}}>{i+1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{v.title}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{v.duration} · {v.size}</p>
                </div>
                <PlayCircle size={14} className="text-slate-300 flex-shrink-0"/>
              </div>
            ))}
            {course.videoCount>course.videos.length&&(
              <p className="text-xs text-slate-400 text-center py-2">+{course.videoCount-course.videos.length} more videos in this course</p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Btn variant="outline" onClick={onClose} className="flex-1">Close</Btn>
          <Btn variant="primary" className="flex-1" onClick={()=>onDownload([{name:course.name,size:course.totalSize,sizeBytes:course.totalSizeBytes}])}>
            <Download size={14}/> Download Course
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
function MainPage({role}:{role:Role;}){
  const isAdmin=role!=="guest";
  const [dept,setDept]=useState<Dept>("IT");
  const [tab,setTab]=useState<DeptTab>("software");
  const [q,setQ]=useState("");
  const [swCat,setSwCat]=useState<SoftwareCat|"ALL">("ALL");
  const [sort,setSort]=useState<"downloads"|"name"|"date"|"size">("downloads");
  const [viewMode,setViewMode]=useState<"grid"|"list">("grid");
  const [selected,setSelected]=useState<Set<string>>(new Set());
  const [loading,setLoading]=useState(true);
  const [dlOpen,setDlOpen]=useState(false);
  const [dlItems,setDlItems]=useState<{name:string;size:string;sizeBytes:number}[]>([]);
  const [uploadOpen,setUploadOpen]=useState(false);
  const [courseDetail,setCourseDetail]=useState<CourseFolder|null>(null);
  const [software,setSoftware]=useState(SOFTWARE);
  const [courses,setCourses]=useState(COURSES);

  useEffect(()=>{const t=setTimeout(()=>setLoading(false),900);return()=>clearTimeout(t);},[]);
  useEffect(()=>{setSelected(new Set());setSwCat("ALL");setQ("");},[dept,tab]);

  const filteredSw=useMemo(()=>{
    const dir=-1;
    return software
      .filter(s=>s.department===dept&&(swCat==="ALL"||s.category===swCat)&&(!q||s.name.toLowerCase().includes(q.toLowerCase())))
      .sort((a,b)=>{
        if(sort==="name")return a.name.localeCompare(b.name);
        if(sort==="date")return b.uploadDate.localeCompare(a.uploadDate);
        if(sort==="size")return b.sizeBytes-a.sizeBytes;
        return b.downloads-a.downloads;
      });
  },[software,dept,swCat,q,sort]);

  const filteredCourses=useMemo(()=>{
    return courses
      .filter(c=>c.department===dept&&(!q||c.name.toLowerCase().includes(q.toLowerCase())||c.instructor.toLowerCase().includes(q.toLowerCase())))
      .sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):sort==="date"?b.uploadDate.localeCompare(a.uploadDate):b.downloads-a.downloads);
  },[courses,dept,q,sort]);

  const selSw=software.filter(s=>selected.has(s.id));
  const allSel=tab==="software"&&filteredSw.length>0&&filteredSw.every(s=>selected.has(s.id));
  const toggle=(id:string)=>setSelected(p=>{const s=new Set(p);s.has(id)?s.delete(id):s.add(id);return s;});
  const toggleAll=()=>setSelected(allSel?new Set():new Set(filteredSw.map(s=>s.id)));
  const openDl=(items:{name:string;size:string;sizeBytes:number}[])=>{setDlItems(items);setDlOpen(true);};
  const delSw=(id:string)=>{setSoftware(p=>p.filter(s=>s.id!==id));setSelected(p=>{const s=new Set(p);s.delete(id);return s;});};
  const depts:Dept[]=["IT","EL","ME"];

  return(
    <div className="flex-1 min-h-0 overflow-y-auto">
      {/* Hero */}
      <div className="relative overflow-hidden px-6 py-10 md:py-14" style={{background:NAVY}}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white opacity-[0.04]"/>
          <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full bg-white opacity-[0.03]"/>
          <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-blue-300 opacity-40"/>
          <div className="absolute top-20 right-16 w-1.5 h-1.5 rounded-full bg-blue-200 opacity-30"/>
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 mb-4">
            <GraduationCap size={12} className="text-blue-200"/>
            <span className="text-xs text-blue-100 font-semibold">Academic Resource Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">Software & Course Library</h1>
          <p className="text-white/50 text-sm md:text-base mb-6">Licensed software and instructor-led courses for all engineering departments</p>
          <div className="relative max-w-lg mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search software, courses, instructors…"
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-white/25 focus:bg-white/15 transition-all"/>
            {q&&<button onClick={()=>setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"><X size={15}/></button>}
          </div>
          {/* Quick stats */}
          <div className="flex items-center justify-center gap-6 mt-6">
            {[{n:software.length,l:"Programs"},{n:courses.length,l:"Courses"},{n:software.reduce((a,s)=>a+s.downloads,0)+courses.reduce((a,c)=>a+c.downloads,0),l:"Total Downloads"}].map(s=>(
              <div key={s.l} className="text-center">
                <p className="text-lg font-extrabold text-white">{s.n>=1000?fmtDl(s.n):s.n}</p>
                <p className="text-white/40 text-[11px]">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Dept selector */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm w-fit">
          {depts.map(d=>{
            const dm=DEPT_META[d];
            const active=dept===d;
            return(
              <button key={d} onClick={()=>setDept(d)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150
                  ${active?"text-white shadow-md":"text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
                style={active?{background:NAVY}:{}}>
                <span style={active?{color:"rgba(255,255,255,0.8)"}:{color:dm.accent}}>{dm.icon}</span>
                <span className="hidden md:inline">{dm.label}</span>
                <span className="md:hidden">{d}</span>
              </button>
            );
          })}
        </div>

        {/* Tab + toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap justify-between">
          <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
            {([["software","Software / Programs",<Package size={14}/>],["courses","Courses",<BookOpen size={14}/>]] as const).map(([t,label,icon])=>(
              <button key={t} onClick={()=>setTab(t as DeptTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150
                  ${tab===t?"text-white shadow-sm":"text-slate-500 hover:text-slate-700"}`}
                style={tab===t?{background:NAVY}:{}}>
                {icon}{label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select value={sort} onChange={e=>setSort(e.target.value as typeof sort)}
                className="pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none appearance-none" style={{color:NAVY}}>
                <option value="downloads">Most Downloaded</option>
                <option value="name">Name A–Z</option>
                <option value="date">Newest First</option>
                {tab==="software"&&<option value="size">File Size</option>}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:NAVY}}/>
            </div>
            <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button onClick={()=>setViewMode("grid")} className={`px-2.5 py-2 transition-colors ${viewMode==="grid"?"text-white":"text-slate-400 hover:text-slate-700"}`} style={viewMode==="grid"?{background:NAVY}:{}}><LayoutGrid size={13}/></button>
              <button onClick={()=>setViewMode("list")} className={`px-2.5 py-2 border-l border-slate-200 transition-colors ${viewMode==="list"?"text-white":"text-slate-400 hover:text-slate-700"}`} style={viewMode==="list"?{background:NAVY}:{}}><List size={13}/></button>
            </div>
            {isAdmin&&<Btn variant="primary" size="sm" onClick={()=>setUploadOpen(true)}><Upload size={13}/> {tab==="software"?"Add Software":"Upload Videos"}</Btn>}
          </div>
        </div>

        {/* Cat filters */}
        {tab==="software"&&(
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {(["ALL",...SW_CATS] as const).map(c=>(
              <button key={c} onClick={()=>setSwCat(c as typeof swCat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${swCat===c?"text-white border-transparent shadow-sm":"bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}
                style={swCat===c?{background:NAVY,borderColor:NAVY}:{}}>
                {c}
              </button>
            ))}
            <button onClick={toggleAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border bg-white border-slate-200 text-slate-500 hover:border-slate-300 transition-colors ml-auto">
              {allSel?<CheckSquare size={13} style={{color:NAVY}}/>:<Square size={13}/>} Select All
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-400">
            {loading?"Loading resources…":tab==="software"?`${filteredSw.length} program${filteredSw.length!==1?"s":""}`:`${filteredCourses.length} course${filteredCourses.length!==1?"s":""}`}
            {q&&<> matching "<strong className="text-slate-600">{q}</strong>"</>}
          </p>
          {selected.size>0&&<Badge style={{background:NAVY_LIGHT,borderColor:NAVY_BORDER,color:NAVY}}>{selected.size} selected · {fmtBytes(selSw.reduce((a,s)=>a+s.sizeBytes,0))}</Badge>}
        </div>

        {/* Software — Grid */}
        {tab==="software"&&viewMode==="grid"&&(
          loading?(
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({length:6}).map((_,i)=>(
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                  <div className="flex gap-3"><Skeleton className="w-10 h-10 rounded-xl"/><div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-3/4"/><Skeleton className="h-3 w-1/2"/></div></div>
                  <div className="flex gap-2"><Skeleton className="h-5 w-20 rounded-md"/><Skeleton className="h-5 w-12 rounded-md"/></div>
                  <Skeleton className="h-px w-full"/><div className="flex justify-between"><Skeleton className="h-3 w-16"/><Skeleton className="h-3 w-10"/></div>
                </div>
              ))}
            </div>
          ):filteredSw.length===0?(
            <EmptyState icon={<Package size={28}/>} title="No software found" sub={q?`No results for "${q}". Try different keywords.`:"No software in this category."}
              action={<Btn variant="secondary" size="sm" onClick={()=>{setQ("");setSwCat("ALL");}}>Clear filters</Btn>}/>
          ):(
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSw.map(sw=>{
                const isSel=selected.has(sw.id);
                const cat=CAT_STYLE[sw.category];
                return(
                  <div key={sw.id} onClick={()=>toggle(sw.id)}
                    className={`bg-white rounded-2xl border cursor-pointer transition-all duration-150 hover:shadow-md group
                      ${isSel?"ring-2 shadow-sm":"border-slate-200 hover:border-slate-300"}`}
                    style={isSel?{borderColor:NAVY,ringColor:NAVY_LIGHT}:{}}>
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <button onClick={e=>{e.stopPropagation();toggle(sw.id);}} className="mt-0.5 flex-shrink-0">
                          {isSel?<CheckSquare size={15} style={{color:NAVY}}/>:<Square size={15} className="text-slate-200 group-hover:text-slate-400"/>}
                        </button>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:NAVY_LIGHT}}>
                          <Package size={18} style={{color:NAVY}}/>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 line-clamp-1">{sw.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{sw.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${cat.bg} ${cat.text} ${cat.border}`}>{sw.category}</span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-slate-50 text-slate-500 border-slate-200">v{sw.version}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="text-slate-400 font-mono">{sw.size}</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-1"><DL size={10}/>{fmtDl(sw.downloads)}</span>
                        </div>
                        <div className="flex items-center gap-1" onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>openDl([{name:sw.name,size:sw.size,sizeBytes:sw.sizeBytes}])}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white transition-colors"
                            onMouseEnter={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color="white";}}
                            onMouseLeave={e=>{e.currentTarget.style.background="";e.currentTarget.style.color="";}}>
                            <Download size={13}/>
                          </button>
                          {isAdmin&&<button onClick={()=>delSw(sw.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={13}/></button>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Software — List */}
        {tab==="software"&&viewMode==="list"&&(
          loading?(
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-50">
              {Array.from({length:5}).map((_,i)=>(
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0"/><div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-2/3"/><Skeleton className="h-3 w-1/3"/></div>
                  <Skeleton className="h-5 w-20 rounded-md hidden sm:block"/>
                </div>
              ))}
            </div>
          ):filteredSw.length===0?(
            <EmptyState icon={<Package size={28}/>} title="No software found" sub="Adjust your search or filters."/>
          ):(
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                <div className="w-8"><button onClick={toggleAll}>{allSel?<CheckSquare size={13} style={{color:NAVY}}/>:<Square size={13} className="text-slate-400"/>}</button></div>
                <div className="flex-1 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Software Name</div>
                <div className="w-24 hidden sm:block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Category</div>
                <div className="w-20 hidden md:block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Size</div>
                <div className="w-20 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wide">DLs</div>
                <div className="w-16 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wide">Actions</div>
              </div>
              <div className="divide-y divide-slate-50">
                {filteredSw.map(sw=>{
                  const isSel=selected.has(sw.id);
                  const cat=CAT_STYLE[sw.category];
                  return(
                    <div key={sw.id} onClick={()=>toggle(sw.id)}
                      className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-colors group ${isSel?"bg-blue-50/80":"hover:bg-slate-50/60"}`}>
                      <div className="w-8 flex-shrink-0" onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>toggle(sw.id)}>{isSel?<CheckSquare size={13} style={{color:NAVY}}/>:<Square size={13} className="text-slate-300 group-hover:text-slate-400"/>}</button>
                      </div>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:NAVY_LIGHT}}><Package size={14} style={{color:NAVY}}/></div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{sw.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">v{sw.version}</p>
                        </div>
                      </div>
                      <div className="w-24 hidden sm:block"><span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${cat.bg} ${cat.text} ${cat.border}`}>{sw.category}</span></div>
                      <div className="w-20 hidden md:block"><span className="text-xs text-slate-400 font-mono">{sw.size}</span></div>
                      <div className="w-20 text-center"><span className="text-xs font-bold text-emerald-600">{fmtDl(sw.downloads)}</span></div>
                      <div className="w-16 flex items-center justify-end gap-1" onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>openDl([{name:sw.name,size:sw.size,sizeBytes:sw.sizeBytes}])}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white transition-colors"
                          onMouseEnter={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color="white";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="";e.currentTarget.style.color="white" as any;}}>
                          <Download size={13}/>
                        </button>
                        {isAdmin&&<button onClick={()=>delSw(sw.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={13}/></button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}

        {/* Courses Grid */}
        {tab==="courses"&&(
          loading?(
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({length:4}).map((_,i)=>(
                <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="h-2 bg-slate-200"/>
                  <div className="p-4 space-y-3">
                    <div className="flex gap-3"><Skeleton className="w-11 h-11 rounded-xl"/><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4"/><Skeleton className="h-3 w-1/2"/></div></div>
                    <Skeleton className="h-3 w-full"/><Skeleton className="h-3 w-4/5"/>
                    <div className="grid grid-cols-3 gap-2"><Skeleton className="h-12 rounded-xl"/><Skeleton className="h-12 rounded-xl"/><Skeleton className="h-12 rounded-xl"/></div>
                  </div>
                </div>
              ))}
            </div>
          ):filteredCourses.length===0?(
            <EmptyState icon={<BookOpen size={28}/>} title="No courses found" sub={q?`No courses match "${q}".`:"No courses in this department yet."}
              action={isAdmin?<Btn variant="primary" size="sm" onClick={()=>setUploadOpen(true)}><Plus size={13}/> Create Course</Btn>:undefined}/>
          ):(
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map(c=>(
                <div key={c.id} onClick={()=>setCourseDetail(c)}
                  className="bg-white rounded-2xl border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-150 overflow-hidden cursor-pointer group">
                  <div className="h-1.5" style={{background:NAVY}}/>
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:NAVY_LIGHT}}>
                        <BookOpen size={20} style={{color:NAVY}}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-slate-900 line-clamp-1">{c.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{c.instructor}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{c.description}</p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[{l:"Videos",v:c.videoCount},{l:"Size",v:c.totalSize},{l:"Downloads",v:fmtDl(c.downloads)}].map(s=>(
                        <div key={s.l} className="text-center p-2 rounded-xl" style={{background:NAVY_LIGHT}}>
                          <p className="text-xs font-extrabold" style={{color:NAVY}}>{s.v}</p>
                          <p className="text-[10px] text-slate-400">{s.l}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={11}/>{c.uploadDate}</span>
                      <div className="flex items-center gap-1" onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>openDl([{name:c.name,size:c.totalSize,sizeBytes:c.totalSizeBytes}])}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white transition-colors hover:opacity-90 shadow-sm"
                          style={{background:NAVY}}>
                          <Download size={12}/> Download
                        </button>
                        {isAdmin&&<button onClick={()=>setCourses(p=>p.filter(x=>x.id!==c.id))} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={13}/></button>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        <div className="h-24"/>
      </div>

      {/* Sticky action bar */}
      {selected.size>0&&tab==="software"&&(
        <div className="fixed bottom-6 inset-x-0 flex justify-center pointer-events-none z-20 px-4">
          <div className="pointer-events-auto rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 border border-white/15" style={{background:NAVY}}>
            <CheckSquare size={14} className="text-blue-200"/>
            <span className="text-sm font-extrabold text-white">{selected.size}</span>
            <span className="text-xs text-white/50">program{selected.size!==1?"s":""} · {fmtBytes(selSw.reduce((a,s)=>a+s.sizeBytes,0))}</span>
            <div className="w-px h-4 bg-white/15"/>
            <button onClick={()=>openDl(selSw.map(s=>({name:s.name,size:s.size,sizeBytes:s.sizeBytes})))}
              className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors hover:bg-blue-50" style={{color:NAVY}}>
              <Download size={13}/> Download All
            </button>
            {isAdmin&&<button onClick={()=>{selSw.forEach(s=>delSw(s.id));}} className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"><Trash2 size={13}/> Delete</button>}
            <button onClick={()=>setSelected(new Set())} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"><X size={14}/></button>
          </div>
        </div>
      )}

      <DownloadModal open={dlOpen} onClose={()=>setDlOpen(false)} items={dlItems}/>
      <CourseModal open={!!courseDetail} onClose={()=>setCourseDetail(null)} course={courseDetail} onDownload={items=>{setDlItems(items);setDlOpen(true);setCourseDetail(null);}}/>
      <UploadModal open={uploadOpen} onClose={()=>setUploadOpen(false)} tab={tab} courses={courses} dept={dept} onAddSw={s=>setSoftware(p=>[s,...p])} onAddCourse={c=>setCourses(p=>[c,...p])}/>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({onLogin}:{onLogin:(r:Role,u:string)=>void;}){
  const [u,setU]=useState("");
  const [p,setP]=useState("");
  const [show,setShow]=useState(false);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");

  const submit=(e:React.FormEvent)=>{
    e.preventDefault();setErr("");
    if(!u.trim()){setErr("Please enter a valid username or email.");return;}
    if(!p){setErr("Please enter your password.");return;}
    setLoading(true);
    setTimeout(()=>{
      const acc=ACCOUNTS[u.toLowerCase()];
      if(acc&&p===acc.pw)onLogin(acc.role,u.toLowerCase());
      else{setErr("Invalid credentials. Please check and try again.");setLoading(false);}
    },1400);
  };

  return(
    <div className="flex-1 flex min-h-0">
      {/* Left — brand panel */}
      <div className="hidden lg:flex w-[42%] flex-col justify-between p-14 relative overflow-hidden flex-shrink-0" style={{background:NAVY}}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white opacity-[0.04]"/>
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-white opacity-[0.03]"/>
          <div className="absolute top-1/3 right-8 w-2 h-2 rounded-full bg-blue-300 opacity-40"/>
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/15 border border-white/20 shadow-lg">
              <GraduationCap size={24} className="text-white"/>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-4">AcadeVault</p>
          <p className="text-white/40 text-sm mt-1">Academic Resource Management System</p>
        </div>
        <div className="relative">
          <h2 className="text-3xl font-extrabold text-white mb-5 leading-tight">
            One platform.<br/>All academic<br/>resources.
          </h2>
          <div className="space-y-3">
            {[
              {icon:<Package size={15}/>,text:"Licensed software for all engineering departments"},
              {icon:<BookOpen size={15}/>,text:"Instructor-led video course library"},
              {icon:<Shield size={15}/>,text:"Role-based access control & full audit trail"},
              {icon:<Activity size={15}/>,text:"Real-time download analytics & reporting"},
            ].map((f,i)=>(
              <div key={i} className="flex items-center gap-3 bg-white/[0.06] rounded-xl px-4 py-3 border border-white/10">
                <span className="text-blue-200 flex-shrink-0">{f.icon}</span>
                <span className="text-white/70 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-white/20 text-xs">© 2026 AcadeVault · All rights reserved</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#F4F5F7] overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md" style={{background:NAVY}}><GraduationCap size={20} className="text-white"/></div>
            <div><p className="font-extrabold text-slate-900">AcadeVault</p><p className="text-slate-400 text-xs">Academic Resource Management</p></div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Administrator Sign In</h1>
          <p className="text-slate-400 text-sm mb-7">Access restricted to authorized faculty & staff</p>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={submit} className="space-y-4">
              <FieldInput label="Username / Email" value={u} onChange={setU} placeholder="username or email@institution.edu"/>
              <FieldInput label="Password" value={p} onChange={setP} placeholder="Enter your password" pwToggle={{show,setShow}}/>
              {err&&(
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                  <AlertCircle size={13} className="text-red-500 flex-shrink-0"/>
                  <p className="text-xs text-red-700">{err}</p>
                </div>
              )}
              <button type="submit" disabled={loading} style={{background:loading?NAVY_MED:NAVY}}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-60 shadow-md mt-1">
                {loading?<><Spin/> Authenticating…</>:<><Lock size={14}/> Sign In</>}
              </button>
            </form>
          </div>
          <div className="mt-5 bg-white border border-slate-200 rounded-2xl px-4 py-4 shadow-sm">
            <p className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1.5 uppercase tracking-wide"><Info size={11}/> Demo Credentials</p>
            <div className="space-y-1">
              {[{u:"admin",p:"Admin@123",r:"Supervisor"},{u:"j.carter",p:"IT@pass1",r:"IT Manager"},{u:"m.silva",p:"EL@pass1",r:"EL Manager"}].map((d,i)=>(
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-[11px] font-mono text-slate-700">{d.u} / {d.p}</span>
                  <span className="text-[11px] text-slate-400">{d.r}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield size={12} className="text-slate-300"/>
            <p className="text-[11px] text-slate-300">Secured with JWT Authentication · TLS 1.3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage({role,username}:{role:Role;username:string;}){
  const [email,setEmail]=useState("admin@acadevault.edu");
  const [phone,setPhone]=useState("+1 555-0100");
  const [curPw,setCurPw]=useState(""); const [showCur,setShowCur]=useState(false);
  const [newPw,setNewPw]=useState(""); const [showNew,setShowNew]=useState(false);
  const [confPw,setConfPw]=useState("");
  const [tab,setTab]=useState<"info"|"security">("info");
  const [saved,setSaved]=useState(false);
  const [pwSaved,setPwSaved]=useState(false);
  const [pwErr,setPwErr]=useState("");
  const str=newPw?pwStr(newPw):null;

  return(
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F4F5F7]">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        {/* Hero card */}
        <div className="rounded-2xl p-6 mb-6 relative overflow-hidden" style={{background:NAVY}}>
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/[0.04]"/>
          <div className="absolute right-12 bottom-2 w-20 h-20 rounded-full bg-white/[0.03]"/>
          <div className="relative flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-extrabold text-white border-2 border-white/20 shadow-xl">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 flex items-center justify-center" style={{borderColor:NAVY}}>
                <CheckCircle size={10} className="text-white"/>
              </div>
            </div>
            <div>
              <p className="text-lg font-extrabold text-white">{username}</p>
              <Badge className="bg-white/20 text-white border-white/30 mt-1">{ROLE_LABELS[role]}</Badge>
              <p className="text-white/40 text-xs mt-1.5 flex items-center gap-1.5"><Clock size={11}/> Active since January 2025</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white rounded-xl mb-5 border border-slate-200 shadow-sm">
          {([["info","Account Info"],["security","Security"]] as const).map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${tab===t?"text-white shadow-sm":"text-slate-500 hover:text-slate-700"}`}
              style={tab===t?{background:NAVY}:{}}>{l}</button>
          ))}
        </div>

        {tab==="info"&&(
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">Username
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Lock size={9}/> Cannot change</span>
              </label>
              <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-extrabold" style={{background:NAVY}}>{username.charAt(0).toUpperCase()}</div>
                <span className="text-sm text-slate-400 font-mono">{username}</span>
              </div>
              <p className="text-xs text-slate-400">Username is assigned by your institution administrator.</p>
            </div>
            <FieldInput label="Email Address" value={email} onChange={setEmail} type="email" placeholder="you@acadevault.edu"/>
            <FieldInput label="Mobile Number" value={phone} onChange={setPhone} type="tel" placeholder="+1 555-0000"/>
            <div className="pt-1 flex items-center gap-3 flex-wrap">
              <Btn variant="primary" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);}}>
                {saved?<><CheckCircle size={14}/> Saved!</>:<><Edit3 size={14}/> Save Changes</>}
              </Btn>
              {saved&&<span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5"><CheckCircle size={12}/> Profile updated successfully</span>}
            </div>
          </div>
        )}

        {tab==="security"&&(
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Info size={13} className="text-amber-500 mt-0.5 flex-shrink-0"/>
              <p className="text-xs text-amber-800">Use a strong password combining uppercase, numbers, and symbols. You may be signed out after updating.</p>
            </div>
            <FieldInput label="Current Password" value={curPw} onChange={setCurPw} placeholder="Enter current password" pwToggle={{show:showCur,setShow:setShowCur}}/>
            <div className="space-y-2">
              <FieldInput label="New Password" value={newPw} onChange={setNewPw} placeholder="Enter new password" pwToggle={{show:showNew,setShow:setShowNew}}/>
              {str&&newPw&&(
                <div className="space-y-2 px-1">
                  <div className="flex gap-1">{[0,1,2,3,4].map(i=><div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{background:i<str.score?str.c:"#E2E8F0"}}/>)}</div>
                  <div className="flex justify-between text-xs"><span className="font-bold" style={{color:str.c}}>{str.l}</span></div>
                  <div className="grid grid-cols-2 gap-1">
                    {[{ok:newPw.length>=8,l:"8+ characters"},{ok:/[A-Z]/.test(newPw),l:"Uppercase letter"},{ok:/[0-9]/.test(newPw),l:"Number"},{ok:/[^A-Za-z0-9]/.test(newPw),l:"Special character"}].map((c,i)=>(
                      <span key={i} className={`text-[11px] flex items-center gap-1.5 ${c.ok?"text-emerald-600":"text-slate-400"}`}>
                        {c.ok?<CheckCircle size={10}/>:<div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 flex-shrink-0"/>}{c.l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <FieldInput label="Confirm New Password" value={confPw} onChange={setConfPw} type="password" placeholder="Re-enter new password"
              error={confPw&&confPw!==newPw?"Passwords do not match":""}/>
            {pwErr&&<p className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5"><AlertCircle size={12}/>{pwErr}</p>}
            {pwSaved&&<p className="text-xs text-emerald-700 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5"><CheckCircle size={12}/> Password updated successfully.</p>}
            <Btn variant="primary" onClick={()=>{setPwErr("");if(newPw.length<8){setPwErr("Password must be at least 8 characters.");return;}if(newPw!==confPw){setPwErr("Passwords do not match.");return;}setPwSaved(true);setCurPw("");setNewPw("");setConfPw("");setTimeout(()=>setPwSaved(false),2500);}} disabled={!curPw||!newPw||!confPw||newPw!==confPw}>
              <Lock size={14}/> Update Password
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Users Page ───────────────────────────────────────────────────────────────
function UsersPage(){
  const [users,setUsers]=useState(USERS);
  const [addOpen,setAddOpen]=useState(false);
  const [delId,setDelId]=useState<string|null>(null);
  const [q,setQ]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [form,setForm]=useState({username:"",email:"",phone:"",role:"it_manager"as Role,password:""});
  const [errs,setErrs]=useState<Record<string,string>>({});

  const filtered=users.filter(u=>!q||u.username.includes(q.toLowerCase())||u.email.includes(q.toLowerCase())||ROLE_LABELS[u.role].toLowerCase().includes(q.toLowerCase()));
  const validate=()=>{
    const e:Record<string,string>={};
    if(!form.username.trim())e.username="Required";
    if(!form.email.includes("@"))e.email="Enter a valid email";
    if(!form.password)e.password="Required";
    if(form.password&&form.password.length<6)e.password="Min 6 characters";
    setErrs(e);return!Object.keys(e).length;
  };
  const add=()=>{if(!validate())return;setUsers(p=>[...p,{id:`u${Date.now()}`,...form,createdDate:new Date().toISOString().split("T")[0]}]);setForm({username:"",email:"",phone:"",role:"it_manager",password:""});setErrs({});setAddOpen(false);};

  return(
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F4F5F7]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Users Management</h1>
            <p className="text-sm text-slate-400 mt-0.5">{users.length} accounts · {users.filter(u=>!u.isSelf).length} manageable</p>
          </div>
          <Btn variant="primary" onClick={()=>setAddOpen(true)}><Plus size={14}/> Add User</Btn>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[{l:"Total Users",v:users.length,c:NAVY,bg:NAVY_LIGHT},{l:"Supervisors",v:users.filter(u=>u.role==="supervisor").length,c:"#6D28D9",bg:"#F3E8FF"},{l:"IT Managers",v:users.filter(u=>u.role==="it_manager").length,c:"#1D4ED8",bg:"#DBEAFE"},{l:"Field Managers",v:users.filter(u=>u.role!=="supervisor"&&u.role!=="it_manager").length,c:"#065F46",bg:"#ECFDF5"}].map(s=>(
            <div key={s.l} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <p className="text-xl font-extrabold" style={{color:s.c}}>{s.v}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.l}</p>
              <div className="h-1 rounded-full mt-2" style={{background:s.bg}}/>
            </div>
          ))}
        </div>
        <div className="relative mb-4">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by username, email or role…"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 hover:border-slate-300 transition-all shadow-sm"/>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[1fr_1fr_auto_auto_auto] lg:grid-cols-[1fr_1fr_auto_auto_auto] gap-4">
            {["User","Role","Phone","Joined","Actions"].map((h,i)=><span key={h} className={`text-[11px] font-bold uppercase tracking-wide text-slate-400 ${i===2?"hidden sm:block":i===3?"hidden lg:block":""}`}>{h}</span>)}
          </div>
          {filtered.length===0?<EmptyState icon={<Users size={24}/>} title="No users found" sub={`No results for "${q}".`}/>:(
            <div className="divide-y divide-slate-50">
              {filtered.map(user=>(
                <div key={user.id} className="px-5 py-4 grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[1fr_1fr_auto_auto_auto] lg:grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 shadow-sm" style={{background:NAVY}}>{user.username.charAt(0).toUpperCase()}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{user.username}</span>
                        {user.isSelf&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1" style={{background:"#F3E8FF",color:"#6D28D9",borderColor:"#E9D5FF"}}><Shield size={8}/> Protected</span>}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block"><Badge className={ROLE_BADGE[user.role]}>{ROLE_LABELS[user.role]}</Badge></div>
                  <div className="hidden sm:block"><span className="text-xs text-slate-500 font-mono">{user.phone||"—"}</span></div>
                  <div className="hidden lg:block"><span className="text-xs text-slate-400">{user.createdDate}</span></div>
                  <div className="flex justify-end">
                    {user.isSelf?<span className="text-xs text-slate-300 italic">You</span>:(
                      <button onClick={()=>setDelId(user.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14}/></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal open={addOpen} onClose={()=>{setAddOpen(false);setErrs({});}} title="Add New User Account">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Username</label>
              <input value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))} placeholder="j.doe"
                className={`px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all ${errs.username?"border-red-400 bg-red-50":"border-slate-200 hover:border-slate-300"}`}/>
              {errs.username&&<p className="text-xs text-red-600">{errs.username}</p>}
            </div>
            <FieldInput label="Password" value={form.password} onChange={v=>setForm(p=>({...p,password:v}))} placeholder="••••••" pwToggle={{show:showPw,setShow:setShowPw}} error={errs.password}/>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">Email</label>
            <input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="j.doe@acadevault.edu" type="email"
              className={`px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all ${errs.email?"border-red-400 bg-red-50":"border-slate-200 hover:border-slate-300"}`}/>
            {errs.email&&<p className="text-xs text-red-600">{errs.email}</p>}
          </div>
          <FieldInput label="Phone Number" value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))} placeholder="+1 555-0000" type="tel"/>
          <FieldSel label="Role" value={form.role} onChange={v=>setForm(p=>({...p,role:v as Role}))} options={[{value:"supervisor",label:"Supervisor"},{value:"it_manager",label:"IT Manager"},{value:"el_manager",label:"EL Manager"},{value:"mechanic_manager",label:"Mechanic Manager"}]}/>
          <div className="flex gap-3 pt-1">
            <Btn variant="outline" onClick={()=>{setAddOpen(false);setErrs({});}} className="flex-1">Cancel</Btn>
            <Btn variant="primary" onClick={add} className="flex-1"><Plus size={14}/> Create Account</Btn>
          </div>
        </div>
      </Modal>
      <Modal open={!!delId} onClose={()=>setDelId(null)} title="Delete User Account" width="max-w-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-600"/></div>
          <p className="text-sm font-bold text-slate-900 mb-1.5">Permanently delete this account?</p>
          <p className="text-xs text-slate-500 leading-relaxed mb-5">Access will be immediately revoked. This cannot be undone.</p>
          <div className="flex gap-3">
            <Btn variant="outline" onClick={()=>setDelId(null)} className="flex-1">Cancel</Btn>
            <Btn variant="danger" onClick={()=>delId&&(setUsers(p=>p.filter(u=>u.id!==delId)),setDelId(null))} className="flex-1">Delete Account</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Logs Page ────────────────────────────────────────────────────────────────
function LogsPage(){
  const [q,setQ]=useState("");
  const [dateF,setDateF]=useState("");
  const [actionF,setActionF]=useState<LogAction|"ALL">("ALL");
  const [exported,setExported]=useState(false);
  const ACTIONS:LogAction[]=["Login","Add File","Delete File","Create Folder","Delete Folder","Upload Video","Add User","Delete User","Change Password","Update Profile","Logout"];
  const filtered=LOGS.filter(l=>{
    const s=!q||l.adminName.includes(q.toLowerCase())||l.target.toLowerCase().includes(q.toLowerCase());
    const d=!dateF||l.date===dateF;
    const a=actionF==="ALL"||l.action===actionF;
    return s&&d&&a;
  });
  return(
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F4F5F7]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Audit Logs</h1>
            <p className="text-sm text-slate-400 mt-0.5">{LOGS.length} events recorded — full administrator activity trail</p>
          </div>
          <Btn variant="outline" onClick={()=>{setExported(true);setTimeout(()=>setExported(false),2000);}}>
            {exported?<><CheckCircle size={14} className="text-emerald-600"/> Exported!</>:<><ExternalLink size={14}/> Export CSV</>}
          </Btn>
        </div>
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {(["ALL",...ACTIONS] as const).map(a=>{
            const count=a==="ALL"?LOGS.length:LOGS.filter(l=>l.action===a).length;
            if(count===0&&a!=="ALL")return null;
            const meta=a!=="ALL"?ACTION_META[a as LogAction]:null;
            return(
              <button key={a} onClick={()=>setActionF(a as typeof actionF)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${actionF===a?"text-white border-transparent shadow-sm":"bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}
                style={actionF===a?{background:NAVY}:{}}>
                {meta&&<div className={`w-1.5 h-1.5 rounded-full ${meta.dot}`}/>}
                {a} <span className={`font-mono ${actionF===a?"text-white/60":"text-slate-300"}`}>({count})</span>
              </button>
            );
          })}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 mb-4 flex flex-wrap gap-3 shadow-sm">
          <div className="relative flex-1 min-w-36">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by admin or target…"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 hover:border-slate-300"/>
          </div>
          <div className="relative">
            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"/>
            <input type="date" value={dateF} onChange={e=>setDateF(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-slate-700"/>
          </div>
          {(q||dateF)&&<button onClick={()=>{setQ("");setDateF("");}} className="px-3 py-2 text-xs text-slate-500 hover:bg-slate-100 rounded-xl flex items-center gap-1 transition-colors"><X size={12}/> Clear</button>}
        </div>
        <p className="text-xs text-slate-400 mb-3">{filtered.length} event{filtered.length!==1?"s":""}</p>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
            <div className="grid gap-4 items-center" style={{gridTemplateColumns:"1fr 1fr 1.2fr 1fr auto"}}>
              {["Admin","Role","Action","Target","Date & Time"].map(h=><span key={h} className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{h}</span>)}
            </div>
          </div>
          {filtered.length===0?<EmptyState icon={<Activity size={24}/>} title="No logs found" sub="Try adjusting your date or action filters."/>:(
            <div className="divide-y divide-slate-50">
              {filtered.map((log,i)=>{
                const meta=ACTION_META[log.action];
                return(
                  <div key={log.id} className={`px-5 py-3.5 hover:bg-slate-50/60 transition-colors ${i%2===0?"bg-white":"bg-slate-50/30"}`}>
                    <div className="grid gap-4 items-center" style={{gridTemplateColumns:"1fr 1fr 1.2fr 1fr auto"}}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0" style={{background:NAVY}}>{log.adminName.charAt(0).toUpperCase()}</div>
                        <span className="text-sm font-bold text-slate-800 truncate">{log.adminName}</span>
                      </div>
                      <Badge className={ROLE_BADGE[log.role]}>{ROLE_LABELS[log.role]}</Badge>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${meta.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${meta.dot}`}/>{log.action}
                      </span>
                      <span className="text-xs text-slate-600 truncate block max-w-[150px]">{log.target}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{log.date}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{log.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App(){
  const [role,setRole]=useState<Role>("guest");
  const [username,setUsername]=useState("guest");
  const [view,setView]=useState("main");
  const [menu,setMenu]=useState(false);

  const login=(r:Role,u:string)=>{setRole(r);setUsername(u);setView("main");};
  const logout=()=>{setRole("guest");setUsername("guest");setView("main");};
  const nav=(v:string)=>{
    if(v==="login"){setView("login");return;}
    if(role==="guest"&&v!=="main"){setView("login");return;}
    if((v==="users"||v==="logs")&&role!=="supervisor")return;
    setView(v);setMenu(false);
  };

  return(
    <div className="h-screen flex flex-col overflow-hidden" style={{fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div className="border-b border-slate-200 px-4 py-1.5 flex items-center justify-between gap-3 bg-white flex-shrink-0 shadow-sm">
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
          <Info size={11}/> Interactive prototype — data is simulated
        </div>
        <RoleSwitcher role={role} onSwitch={(r,u)=>{setRole(r);setUsername(u);setView("main");}}/>
      </div>
      <Navbar role={role} user={username} onMenu={()=>setMenu(p=>!p)} onNav={nav}/>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {view!=="login"&&<Sidebar role={role} view={view} onNav={nav} open={menu} onClose={()=>setMenu(false)} onLogout={logout}/>}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {view==="main"    &&<MainPage role={role}/>}
          {view==="login"   &&<LoginPage onLogin={login}/>}
          {view==="profile" &&role!=="guest"&&<ProfilePage role={role} username={username}/>}
          {view==="users"   &&role==="supervisor"&&<UsersPage/>}
          {view==="logs"    &&role==="supervisor"&&<LogsPage/>}
        </main>
      </div>
    </div>
  );
}
