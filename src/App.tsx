/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Kanban,
  Milestone,
  Users,
  Bot,
  Search,
  Plus,
  Bell,
  Settings,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  MoreHorizontal,
  Sparkles,
  Terminal,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layers,
  MessageSquare,
  Paperclip,
  CheckSquare,
  X,
  Play,
  Flame,
  HelpCircle,
  Command,
  SlidersHorizontal,
  UserCheck,
  RefreshCw,
  Send
} from 'lucide-react';

// Types
type ViewMode = 'dashboard' | 'board' | 'epics' | 'team' | 'copilot';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  epicId: string;
  assignee: {
    name: string;
    avatar: string;
  };
  estimate: number; // story points or hours
  dueDate: string;
  labels: string[];
  subtasks: { id: string; title: string; completed: boolean }[];
  comments: { id: string; author: string; avatar: string; text: string; time: string }[];
}

interface Epic {
  id: string;
  name: string;
  code: string;
  progress: number;
  health: 'healthy' | 'at_risk' | 'blocked';
  targetDate: string;
  owner: string;
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  capacity: number;
  assignedPoints: number;
  activeIssuesCount: number;
  status: 'online' | 'busy' | 'away';
}

// Initial Mock Data
const INITIAL_EPICS: Epic[] = [
  { id: 'epic-1', name: 'Auth & Security Overhaul', code: 'SEC', progress: 78, health: 'healthy', targetDate: '2026-12-01', owner: 'Alex Rivera', description: 'Migrate to passkey authentication, OAuth2 hardening, and automated RBAC audit logging.' },
  { id: 'epic-2', name: 'Real-time Canvas Engine', code: 'CAN', progress: 45, health: 'at_risk', targetDate: '2026-12-15', owner: 'Jordan Lee', description: 'High-performance WebGL/HTML5 collaborative canvas with WebSocket operational transforms.' },
  { id: 'epic-3', name: 'AI Workflow Copilot', code: 'AIC', progress: 90, health: 'healthy', targetDate: '2026-11-28', owner: 'Sam Taylor', description: 'Contextual code & task generation powered by Gemini 2.5 Flash agents.' },
  { id: 'epic-4', name: 'Billing & Enterprise Tier', code: 'BIL', progress: 20, health: 'blocked', targetDate: '2026-12-30', owner: 'Morgan Wu', description: 'Stripe usage-based metered billing, invoicing, and multi-currency support.' }
];

const INITIAL_MEMBERS: TeamMember[] = [
  { id: 'm-1', name: 'Alex Rivera', role: 'Staff Security Engineer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', capacity: 40, assignedPoints: 34, activeIssuesCount: 4, status: 'online' },
  { id: 'm-2', name: 'Jordan Lee', role: 'Principal Graphics Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', capacity: 40, assignedPoints: 38, activeIssuesCount: 5, status: 'busy' },
  { id: 'm-3', name: 'Sam Taylor', role: 'AI / ML Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', capacity: 35, assignedPoints: 30, activeIssuesCount: 3, status: 'online' },
  { id: 'm-4', name: 'Morgan Wu', role: 'Senior Backend Architect', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', capacity: 40, assignedPoints: 26, activeIssuesCount: 3, status: 'away' }
];

const INITIAL_ISSUES: Issue[] = [
  {
    id: 'ENG-101',
    title: 'Implement WebAuthn passkey registration flow',
    description: 'Provide seamless FIDO2 biometric authentication for enterprise accounts with fallback hardware keys.',
    status: 'in_progress',
    priority: 'urgent',
    epicId: 'epic-1',
    assignee: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    estimate: 8,
    dueDate: 'Nov 18, 2026',
    labels: ['security', 'auth', 'frontend'],
    subtasks: [
      { id: 'st-1', title: 'Setup WebAuthn credential manager wrapper', completed: true },
      { id: 'st-2', title: 'Implement challenge verification endpoint', completed: true },
      { id: 'st-3', title: 'Design biometric prompt modal UI', completed: false }
    ],
    comments: [
      { id: 'c-1', author: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', text: 'Tested successfully on iOS Safari and Chrome desktop.', time: '2h ago' }
    ]
  },
  {
    id: 'ENG-102',
    title: 'Optimize WebGL canvas viewport render loop',
    description: 'Reduce frame drops during heavy pan/zoom operations on 10k+ node flowcharts.',
    status: 'in_progress',
    priority: 'high',
    epicId: 'epic-2',
    assignee: { name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    estimate: 13,
    dueDate: 'Nov 20, 2026',
    labels: ['performance', 'webgl', 'graphics'],
    subtasks: [
      { id: 'st-4', title: 'Implement spatial hashing grid for culling', completed: true },
      { id: 'st-5', title: 'Batch draw calls into single instanced buffer', completed: false }
    ],
    comments: []
  },
  {
    id: 'ENG-103',
    title: 'Integrate Gemini 2.5 Flash for automated code review',
    description: 'Analyze pull requests on commit push and post inline actionable suggestions via webhook.',
    status: 'in_review',
    priority: 'urgent',
    epicId: 'epic-3',
    assignee: { name: 'Sam Taylor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    estimate: 5,
    dueDate: 'Nov 16, 2026',
    labels: ['ai', 'backend', 'automation'],
    subtasks: [
      { id: 'st-6', title: 'Set up SDK streaming connection', completed: true },
      { id: 'st-7', title: 'Format output into GitHub review comments', completed: true }
    ],
    comments: [
      { id: 'c-2', author: 'Sam Taylor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', text: 'All tests passing in sandbox stage.', time: '4h ago' }
    ]
  },
  {
    id: 'ENG-104',
    title: 'Stripe Metered Billing webhook failure handler',
    description: 'Handle retries and graceful degradation when invoice webhook events time out.',
    status: 'backlog',
    priority: 'medium',
    epicId: 'epic-4',
    assignee: { name: 'Morgan Wu', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    estimate: 8,
    dueDate: 'Nov 25, 2026',
    labels: ['billing', 'backend', 'stripe'],
    subtasks: [
      { id: 'st-8', title: 'Create dead-letter queue schema', completed: false }
    ],
    comments: []
  },
  {
    id: 'ENG-105',
    title: 'Role-Based Access Control (RBAC) granular matrix UI',
    description: 'Build custom permission matrix table with instant toggle persistence.',
    status: 'todo',
    priority: 'high',
    epicId: 'epic-1',
    assignee: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    estimate: 5,
    dueDate: 'Nov 22, 2026',
    labels: ['security', 'frontend', 'rbac'],
    subtasks: [],
    comments: []
  },
  {
    id: 'ENG-106',
    title: 'Export canvas state to SVG / PNG vector formats',
    description: 'High-res client-side canvas snapshot generation without server roundtrip.',
    status: 'done',
    priority: 'low',
    epicId: 'epic-2',
    assignee: { name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    estimate: 3,
    dueDate: 'Nov 12, 2026',
    labels: ['export', 'ui'],
    subtasks: [
      { id: 'st-9', title: 'SVG serializer implementation', completed: true },
      { id: 'st-10', title: 'PNG blob downloader', completed: true }
    ],
    comments: []
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [epics] = useState<Epic[]>(INITIAL_EPICS);
  const [teamMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEpicFilter, setSelectedEpicFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  
  // Modals & Panels
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isNewIssueOpen, setIsNewIssueOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  
  // New Issue Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');
  const [newEpic, setNewEpic] = useState('epic-1');
  const [newAssignee, setNewAssignee] = useState('Alex Rivera');
  const [newEstimate, setNewEstimate] = useState(5);
  const [isAiBreakingDown, setIsAiBreakingDown] = useState(false);

  // AI Synthesis state
  const [aiSynthesisText, setAiSynthesisText] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            issue.labels.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesEpic = selectedEpicFilter === 'all' || issue.epicId === selectedEpicFilter;
      const matchesPriority = selectedPriorityFilter === 'all' || issue.priority === selectedPriorityFilter;
      return matchesSearch && matchesEpic && matchesPriority;
    });
  }, [issues, searchQuery, selectedEpicFilter, selectedPriorityFilter]);

  // Run AI Synthesis API call
  const handleRunAiSynthesis = async () => {
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/ai-synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Analyze current sprint velocity, blockers, and provide immediate risk mitigation strategies.',
          contextData: {
            velocity: '46 pts',
            activeEpics: epics.length,
            blockers: issues.filter(i => i.priority === 'urgent').length,
            issuesSummary: issues.map(i => ({ id: i.id, title: i.title, status: i.status, priority: i.priority }))
          }
        })
      });
      const data = await res.json();
      setAiSynthesisText(data.synthesis);
    } catch (err) {
      console.error(err);
      setAiSynthesisText('Failed to fetch AI synthesis. Please check API key configuration.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // AI Subtask Breakdown for New Issue
  const handleAiBreakdownNewIssue = async () => {
    if (!newTitle) return;
    setIsAiBreakingDown(true);
    try {
      const res = await fetch('/api/ai-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: newTitle, taskDescription: newDesc })
      });
      const data = await res.json();
      if (data.subtasks && Array.isArray(data.subtasks)) {
        // Add subtasks to new issue state or create directly
        const createdSubtasks = data.subtasks.map((st: any, idx: number) => ({
          id: `st-ai-${Date.now()}-${idx}`,
          title: st.title,
          completed: false
        }));
        // We can append to description or subtasks list
        setNewDesc(prev => prev + '\n\nAI Subtasks:\n' + data.subtasks.map((s:any) => `- [ ] ${s.title} (${s.estimate})`).join('\n'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiBreakingDown(false);
    }
  };

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const assigneeObj = teamMembers.find(m => m.name === newAssignee) || teamMembers[0];
    const newIssueObj: Issue = {
      id: `ENG-${100 + issues.length + 1}`,
      title: newTitle,
      description: newDesc || 'No description provided.',
      status: 'todo',
      priority: newPriority,
      epicId: newEpic,
      assignee: { name: assigneeObj.name, avatar: assigneeObj.avatar },
      estimate: Number(newEstimate) || 5,
      dueDate: 'Dec 05, 2026',
      labels: ['feature', newEpic === 'epic-1' ? 'security' : 'engineering'],
      subtasks: [],
      comments: []
    };

    setIssues([newIssueObj, ...issues]);
    setNewTitle('');
    setNewDesc('');
    setIsNewIssueOpen(false);
  };

  const handleAddComment = () => {
    if (!selectedIssue || !newCommentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You (Staff Lead)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: newCommentText,
      time: 'Just now'
    };
    const updated = {
      ...selectedIssue,
      comments: [newComment, ...selectedIssue.comments]
    };
    setSelectedIssue(updated);
    setIssues(issues.map(i => i.id === updated.id ? updated : i));
    setNewCommentText('');
  };

  const toggleSubtask = (subId: string) => {
    if (!selectedIssue) return;
    const updatedSubtasks = selectedIssue.subtasks.map(st => 
      st.id === subId ? { ...st, completed: !st.completed } : st
    );
    const updated = { ...selectedIssue, subtasks: updatedSubtasks };
    setSelectedIssue(updated);
    setIssues(issues.map(i => i.id === updated.id ? updated : i));
  };

  const updateIssueStatus = (issueId: string, newStatus: Issue['status']) => {
    setIssues(issues.map(i => i.id === issueId ? { ...i, status: newStatus } : i));
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="flex h-screen bg-[#fcf8fb] text-[#1c1b1d] font-sans antialiased overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* SIDEBAR NAVIGATION RAIL */}
      <aside className="w-64 bg-[#f6f2f5] border-r border-[#e5e1e4] flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#e5e1e4]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <Zap className="w-5 h-5 fill-white text-indigo-600" />
              </div>
              <div>
                <h1 className="font-semibold text-sm tracking-tight text-[#1c1b1d]">ProjectPulse</h1>
                <span className="text-[11px] font-medium text-[#464555] tracking-wide">Precision SaaS v2.4</span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-[#464555] uppercase tracking-wider">Workspace</div>
            
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-[#464555] hover:bg-[#eae7ea] hover:text-[#1c1b1d]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & Metrics</span>
            </button>

            <button
              onClick={() => setCurrentView('board')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'board' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-[#464555] hover:bg-[#eae7ea] hover:text-[#1c1b1d]'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Issues Kanban</span>
              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                currentView === 'board' ? 'bg-indigo-700 text-indigo-100' : 'bg-[#eae7ea] text-[#464555]'
              }`}>
                {issues.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentView('epics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'epics' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-[#464555] hover:bg-[#eae7ea] hover:text-[#1c1b1d]'
              }`}
            >
              <Milestone className="w-4 h-4" />
              <span>Epics & Roadmaps</span>
            </button>

            <button
              onClick={() => setCurrentView('team')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'team' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-[#464555] hover:bg-[#eae7ea] hover:text-[#1c1b1d]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team Workload</span>
            </button>

            <div className="pt-4 px-3 py-1.5 text-[11px] font-semibold text-[#464555] uppercase tracking-wider">Intelligence</div>

            <button
              onClick={() => setCurrentView('copilot')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'copilot' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-[#464555] hover:bg-[#eae7ea] hover:text-[#1c1b1d]'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-400 group-hover:text-white" />
              <span>AI Sprint Copilot</span>
              <span className="ml-auto text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-1.5 py-0.5 rounded">Gemini</span>
            </button>
          </div>
        </div>

        {/* Workspace Footer Info */}
        <div className="p-4 border-t border-[#e5e1e4]">
          <div className="bg-[#fcf8fb] border border-[#e5e1e4] rounded-xl p-3 flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
              alt="User" 
              className="w-9 h-9 rounded-full object-cover border border-[#e5e1e4]"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#1c1b1d] truncate">Alex Rivera</div>
              <div className="text-[11px] text-[#464555] truncate">Staff Lead • Enterprise</div>
            </div>
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-1.5 rounded-lg hover:bg-[#eae7ea] text-[#464555]"
              title="Command Menu (Cmd+K)"
            >
              <Command className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#fcf8fb] overflow-hidden">
        
        {/* TOP APP BAR */}
        <header className="h-16 px-6 border-b border-[#e5e1e4] bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-[#1c1b1d] capitalize">
              {currentView === 'dashboard' && 'Sprint Dashboard & Overview'}
              {currentView === 'board' && 'Engineering Kanban Board'}
              {currentView === 'epics' && 'Epics & Milestone Roadmaps'}
              {currentView === 'team' && 'Team Capacity & Workload'}
              {currentView === 'copilot' && 'AI Sprint Copilot & Risk Synthesis'}
            </h2>
            <div className="hidden md:flex items-center gap-2 text-xs text-[#464555] bg-[#f6f2f5] px-2.5 py-1 rounded-md border border-[#e5e1e4]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sprint 24 (Active • 6 Days Left)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-3 bg-[#f6f2f5] hover:bg-[#eae7ea] border border-[#e5e1e4] text-[#464555] px-3 py-1.5 rounded-lg text-xs font-medium transition-all w-64 justify-between"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                <span>Search issues, epics, docs...</span>
              </span>
              <kbd className="bg-white border border-[#e5e1e4] px-1.5 py-0.5 rounded text-[10px] font-mono shadow-xs">⌘K</kbd>
            </button>

            <button
              onClick={() => setIsNewIssueOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Issue</span>
            </button>

            <button className="p-2 rounded-lg hover:bg-[#f6f2f5] text-[#464555] relative border border-transparent hover:border-[#e5e1e4]">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
            </button>

            <button className="p-2 rounded-lg hover:bg-[#f6f2f5] text-[#464555] border border-transparent hover:border-[#e5e1e4]">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* VIEW CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fcf8fb]">

          {/* 1. DASHBOARD VIEW */}
          {currentView === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-[#e5e1e4] shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#464555] mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Sprint Velocity</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono text-[#1c1b1d]">46 pts</div>
                    <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <span>+12% vs last sprint</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#e5e1e4] shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#464555] mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Epics</span>
                    <Layers className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono text-[#1c1b1d]">4 Active</div>
                    <div className="text-xs text-[#464555] mt-1">2 due in &lt; 14 days</div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#e5e1e4] shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#464555] mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Open Blockers</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono text-[#1c1b1d]">2 Issues</div>
                    <div className="text-xs text-amber-600 font-medium mt-1">Requires immediate review</div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#e5e1e4] shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#464555] mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">CI / CD Health</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono text-[#1c1b1d]">99.4%</div>
                    <div className="text-xs text-emerald-600 font-medium mt-1">All pipelines passing</div>
                  </div>
                </div>
              </div>

              {/* AI Sprint Synthesis Banner */}
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full text-xs font-semibold border border-indigo-500/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini 2.5 Flash Autonomous Synthesis</span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight">Real-time Sprint Risk Analysis</h3>
                    <p className="text-xs text-indigo-200/80 leading-relaxed">
                      {aiSynthesisText || "Click below to run an instant AI evaluation of your team's velocity, commit history, and active bottlenecks."}
                    </p>
                  </div>
                  <button
                    onClick={handleRunAiSynthesis}
                    disabled={isSynthesizing}
                    className="bg-white hover:bg-indigo-50 text-indigo-950 font-semibold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 active:scale-95 disabled:opacity-50"
                  >
                    {isSynthesizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-600" />}
                    <span>{isSynthesizing ? 'Synthesizing...' : 'Run AI Sprint Synthesis'}</span>
                  </button>
                </div>
              </div>

              {/* Two Column Section: Recent Issues & Team Load */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent / Urgent Issues */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e1e4] p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-[#1c1b1d]">Active High-Priority Issues</h4>
                    <button 
                      onClick={() => setCurrentView('board')} 
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <span>View Kanban Board</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-[#e5e1e4]">
                    {issues.slice(0, 4).map(issue => (
                      <div 
                        key={issue.id}
                        onClick={() => setSelectedIssue(issue)}
                        className="py-3 flex items-center justify-between hover:bg-[#f6f2f5] px-2 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs font-semibold text-[#464555] shrink-0">{issue.id}</span>
                          <span className="text-sm font-medium text-[#1c1b1d] truncate">{issue.title}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                            issue.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            issue.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {issue.priority}
                          </span>
                          <img src={issue.assignee.avatar} alt={issue.assignee.name} className="w-6 h-6 rounded-full object-cover border border-[#e5e1e4]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Workload Summary */}
                <div className="bg-white rounded-xl border border-[#e5e1e4] p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-[#1c1b1d]">Engineer Load</h4>
                    <button 
                      onClick={() => setCurrentView('team')}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Manage
                    </button>
                  </div>

                  <div className="space-y-4">
                    {teamMembers.map(member => (
                      <div key={member.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#1c1b1d]">{member.name}</span>
                          <span className="font-mono text-[#464555]">{member.assignedPoints} / {member.capacity} pts</span>
                        </div>
                        <div className="w-full bg-[#f6f2f5] h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              member.assignedPoints > member.capacity ? 'bg-red-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${Math.min(100, (member.assignedPoints / member.capacity) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 2. KANBAN BOARD VIEW */}
          {currentView === 'board' && (
            <div className="space-y-6 h-full flex flex-col">
              
              {/* Board Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e5e1e4] shadow-xs">
                <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#464555] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter issues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 bg-[#f6f2f5] border border-[#e5e1e4] rounded-lg text-xs font-medium text-[#1c1b1d] focus:outline-none focus:border-indigo-600 w-64"
                    />
                  </div>

                  <select
                    value={selectedEpicFilter}
                    onChange={(e) => setSelectedEpicFilter(e.target.value)}
                    className="bg-[#f6f2f5] border border-[#e5e1e4] px-3 py-1.5 rounded-lg text-xs font-medium text-[#1c1b1d] focus:outline-none focus:border-indigo-600"
                  >
                    <option value="all">All Epics</option>
                    {epics.map(epic => (
                      <option key={epic.id} value={epic.id}>{epic.name}</option>
                    ))}
                  </select>

                  <select
                    value={selectedPriorityFilter}
                    onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                    className="bg-[#f6f2f5] border border-[#e5e1e4] px-3 py-1.5 rounded-lg text-xs font-medium text-[#1c1b1d] focus:outline-none focus:border-indigo-600"
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="text-xs text-[#464555] font-mono">
                  Showing <span className="font-bold text-[#1c1b1d]">{filteredIssues.length}</span> issues
                </div>
              </div>

              {/* Kanban Lanes */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 items-start overflow-x-auto pb-4">
                
                {(['backlog', 'todo', 'in_progress', 'in_review', 'done'] as const).map(statusKey => {
                  const columnIssues = filteredIssues.filter(i => i.status === statusKey);
                  const titleMap = {
                    backlog: 'Backlog',
                    todo: 'To Do',
                    in_progress: 'In Progress',
                    in_review: 'In Review',
                    done: 'Done'
                  };

                  return (
                    <div key={statusKey} className="bg-[#f6f2f5] rounded-xl border border-[#e5e1e4] flex flex-col max-h-[calc(100vh-240px)]">
                      <div className="p-3 border-b border-[#e5e1e4] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            statusKey === 'backlog' ? 'bg-[#777587]' :
                            statusKey === 'todo' ? 'bg-indigo-500' :
                            statusKey === 'in_progress' ? 'bg-amber-500' :
                            statusKey === 'in_review' ? 'bg-blue-500' : 'bg-emerald-500'
                          }`}></span>
                          <span className="text-xs font-semibold text-[#1c1b1d] uppercase tracking-wider">{titleMap[statusKey]}</span>
                        </div>
                        <span className="text-[11px] font-mono font-semibold bg-white px-2 py-0.5 rounded border border-[#e5e1e4] text-[#464555]">
                          {columnIssues.length}
                        </span>
                      </div>

                      <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1">
                        {columnIssues.map(issue => (
                          <div
                            key={issue.id}
                            onClick={() => setSelectedIssue(issue)}
                            className="bg-white p-3.5 rounded-lg border border-[#e5e1e4] shadow-xs hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer space-y-2.5 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-semibold text-[#464555]">{issue.id}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                                issue.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                issue.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                                issue.priority === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-[#f6f2f5] text-[#464555]'
                              }`}>
                                {issue.priority}
                              </span>
                            </div>

                            <div className="text-xs font-medium text-[#1c1b1d] group-hover:text-indigo-600 transition-colors line-clamp-2">
                              {issue.title}
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-[#f6f2f5] text-[11px] text-[#464555]">
                              <div className="flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3" />
                                <span>{issue.estimate} pts</span>
                              </div>
                              <img src={issue.assignee.avatar} alt={issue.assignee.name} className="w-5 h-5 rounded-full object-cover border border-[#e5e1e4]" />
                            </div>
                          </div>
                        ))}

                        {columnIssues.length === 0 && (
                          <div className="h-24 flex items-center justify-center text-xs text-[#464555] italic border border-dashed border-[#e5e1e4] rounded-lg">
                            No issues
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>

            </div>
          )}

          {/* 3. EPICS & ROADMAPS VIEW */}
          {currentView === 'epics' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#1c1b1d]">Active Epics & Milestones</h3>
                  <p className="text-xs text-[#464555]">Track high-level product initiatives, progress percentages, and health statuses.</p>
                </div>
                <button
                  onClick={() => alert('Create Epic modal coming soon.')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Epic</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {epics.map(epic => {
                  const epicIssues = issues.filter(i => i.epicId === epic.id);
                  return (
                    <div key={epic.id} className="bg-white rounded-xl border border-[#e5e1e4] p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-[#f6f2f5] text-[#1c1b1d] px-2 py-1 rounded border border-[#e5e1e4]">{epic.code}</span>
                          <h4 className="font-semibold text-sm text-[#1c1b1d]">{epic.name}</h4>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                          epic.health === 'healthy' ? 'bg-emerald-100 text-emerald-700' :
                          epic.health === 'at_risk' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {epic.health.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-[#464555] leading-relaxed">{epic.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-[#464555]">Completion Progress</span>
                          <span className="font-mono text-[#1c1b1d] font-bold">{epic.progress}%</span>
                        </div>
                        <div className="w-full bg-[#f6f2f5] h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              epic.health === 'blocked' ? 'bg-red-500' :
                              epic.health === 'at_risk' ? 'bg-amber-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${epic.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#e5e1e4] flex items-center justify-between text-xs text-[#464555]">
                        <div className="flex items-center gap-2">
                          <span>Owner: <strong className="text-[#1c1b1d]">{epic.owner}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span>Target: {epic.targetDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. TEAM WORKLOAD VIEW */}
          {currentView === 'team' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#1c1b1d]">Engineering Team Capacity</h3>
                  <p className="text-xs text-[#464555]">Monitor active workload distribution and sprint point allocations.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map(member => (
                  <div key={member.id} className="bg-white rounded-xl border border-[#e5e1e4] p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-4">
                      <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-[#e5e1e4]" />
                      <div>
                        <h4 className="font-semibold text-sm text-[#1c1b1d]">{member.name}</h4>
                        <div className="text-xs text-[#464555]">{member.role}</div>
                      </div>
                      <span className={`ml-auto text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase ${
                        member.status === 'online' ? 'bg-emerald-100 text-emerald-700' :
                        member.status === 'busy' ? 'bg-amber-100 text-amber-700' : 'bg-[#f6f2f5] text-[#464555]'
                      }`}>
                        {member.status}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#e5e1e4]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#464555]">Assigned Points vs Capacity</span>
                        <span className="font-mono font-bold text-[#1c1b1d]">{member.assignedPoints} / {member.capacity} pts</span>
                      </div>
                      <div className="w-full bg-[#f6f2f5] h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            member.assignedPoints > member.capacity ? 'bg-red-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${Math.min(100, (member.assignedPoints / member.capacity) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#464555] pt-2">
                      <span>Active Issues: <strong className="text-[#1c1b1d]">{member.activeIssuesCount}</strong></span>
                      <button className="text-indigo-600 font-medium hover:underline">View Assigned</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. AI SPRINT COPILOT VIEW */}
          {currentView === 'copilot' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-[#e5e1e4] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1c1b1d]">Gemini 2.5 Flash Sprint Copilot</h3>
                    <p className="text-xs text-[#464555]">Ask questions or request autonomous sprint rebalancing.</p>
                  </div>
                </div>

                <div className="bg-[#f6f2f5] p-4 rounded-xl border border-[#e5e1e4] space-y-3">
                  <div className="text-xs font-semibold text-[#1c1b1d]">Suggested Prompts:</div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setAiSynthesisText("Analyzing sprint velocity... All systems nominal. Recommend moving ENG-104 to next sprint.")}
                      className="bg-white hover:bg-indigo-50 border border-[#e5e1e4] text-[#1c1b1d] px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    >
                      "Summarize current sprint risks"
                    </button>
                    <button 
                      onClick={() => setAiSynthesisText("Resource Rebalance: Jordan Lee is at 95% capacity. Recommend offloading ENG-102 subtasks to Morgan Wu.")}
                      className="bg-white hover:bg-indigo-50 border border-[#e5e1e4] text-[#1c1b1d] px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    >
                      "Optimize engineer workload distribution"
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#1c1b1d]">AI Synthesis Output</label>
                  <div className="bg-[#fcf8fb] p-4 rounded-xl border border-[#e5e1e4] min-h-[160px] text-xs text-[#1c1b1d] font-mono whitespace-pre-wrap leading-relaxed">
                    {aiSynthesisText || "Run AI synthesis from the dashboard or select a prompt above to view AI recommendations."}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ISSUE DETAIL SLIDE-OVER PANEL */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="h-16 px-6 border-b border-[#e5e1e4] flex items-center justify-between bg-[#f6f2f5]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold bg-white px-2.5 py-1 rounded border border-[#e5e1e4] text-[#1c1b1d]">{selectedIssue.id}</span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                  selectedIssue.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {selectedIssue.priority}
                </span>
              </div>
              <button 
                onClick={() => setSelectedIssue(null)}
                className="p-1.5 rounded-lg hover:bg-[#eae7ea] text-[#464555]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#1c1b1d]">{selectedIssue.title}</h3>
                <p className="text-xs text-[#464555] leading-relaxed">{selectedIssue.description}</p>
              </div>

              {/* Status Selector */}
              <div className="bg-[#f6f2f5] p-4 rounded-xl border border-[#e5e1e4] space-y-2">
                <label className="text-xs font-semibold text-[#1c1b1d]">Status</label>
                <div className="flex flex-wrap gap-2">
                  {(['backlog', 'todo', 'in_progress', 'in_review', 'done'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => updateIssueStatus(selectedIssue.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                        selectedIssue.status === st 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'bg-white border border-[#e5e1e4] text-[#464555] hover:bg-[#eae7ea]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtasks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#464555]">Subtasks Checklist</h4>
                  <span className="text-xs font-mono text-[#464555]">
                    {selectedIssue.subtasks.filter(s => s.completed).length} / {selectedIssue.subtasks.length} done
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedIssue.subtasks.map(st => (
                    <div 
                      key={st.id}
                      onClick={() => toggleSubtask(st.id)}
                      className="flex items-center gap-3 p-2.5 bg-[#f6f2f5] hover:bg-[#eae7ea] rounded-lg cursor-pointer transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        checked={st.completed} 
                        onChange={() => {}} 
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={`text-xs ${st.completed ? 'line-through text-[#464555]' : 'text-[#1c1b1d] font-medium'}`}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                  {selectedIssue.subtasks.length === 0 && (
                    <div className="text-xs text-[#464555] italic">No subtasks created yet.</div>
                  )}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#464555]">Activity & Comments</h4>
                <div className="space-y-3">
                  {selectedIssue.comments.map(c => (
                    <div key={c.id} className="bg-[#f6f2f5] p-3.5 rounded-xl space-y-1.5 border border-[#e5e1e4]">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={c.avatar} alt={c.author} className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-semibold text-[#1c1b1d]">{c.author}</span>
                        </div>
                        <span className="text-[#464555] text-[10px]">{c.time}</span>
                      </div>
                      <p className="text-xs text-[#1c1b1d] leading-relaxed pl-7">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Comment Input Footer */}
            <div className="p-4 border-t border-[#e5e1e4] bg-[#f6f2f5] flex items-center gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                className="flex-1 bg-white border border-[#e5e1e4] px-3.5 py-2 rounded-lg text-xs font-medium text-[#1c1b1d] focus:outline-none focus:border-indigo-600"
              />
              <button
                onClick={handleAddComment}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NEW ISSUE MODAL */}
      {isNewIssueOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e5e1e4] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="h-16 px-6 border-b border-[#e5e1e4] flex items-center justify-between bg-[#f6f2f5]">
              <h3 className="text-sm font-semibold text-[#1c1b1d]">Create New Engineering Issue</h3>
              <button onClick={() => setIsNewIssueOpen(false)} className="p-1 rounded-lg hover:bg-[#eae7ea] text-[#464555]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1c1b1d]">Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Implement OAuth token rotation middleware"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#f6f2f5] border border-[#e5e1e4] px-3.5 py-2 rounded-lg text-xs font-medium text-[#1c1b1d] focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1c1b1d]">Epic</label>
                  <select
                    value={newEpic}
                    onChange={(e) => setNewEpic(e.target.value)}
                    className="w-full bg-[#f6f2f5] border border-[#e5e1e4] px-3 py-2 rounded-lg text-xs font-medium text-[#1c1b1d] focus:outline-none focus:border-indigo-600"
                  >
                    {epics.map(epic => (
                      <option key={epic.id} value={epic.id}>{epic.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1c1b1d]">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#f6f2f5] border border-[#e5e1e4] px-3 py-2 rounded-lg text-xs font-medium text-[#1c1b1d] focus:outline-none focus:border-indigo-600"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1c1b1d]">Assignee</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full bg-[#f6f2f5] border border-[#e5e1e4] px-3 py-2 rounded-lg text-xs font-medium text-[#1c1b1d] focus:outline-none focus:border-indigo-600"
                  >
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1c1b1d]">Estimate (pts)</label>
                  <input
                    type="number"
                    value={newEstimate}
                    onChange={(e) => setNewEstimate(Number(e.target.value))}
                    className="w-full bg-[#f6f2f5] border border-[#e5e1e4] px-3.5 py-2 rounded-lg text-xs font-medium text-[#1c1b1d] focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1c1b1d]">Description</label>
                  <button
                    type="button"
                    onClick={handleAiBreakdownNewIssue}
                    disabled={isAiBreakingDown || !newTitle}
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isAiBreakingDown ? 'Generating AI Breakdown...' : 'AI Subtask Breakdown'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Detailed task scope, technical specifications, and acceptance criteria..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#f6f2f5] border border-[#e5e1e4] p-3 rounded-lg text-xs font-medium text-[#1c1b1d] focus:outline-none focus:border-indigo-600"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-[#e5e1e4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewIssueOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#464555] hover:bg-[#f6f2f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all"
                >
                  Create Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMMAND PALETTE (CMD+K) */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-24 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e5e1e4] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 border-b border-[#e5e1e4] flex items-center gap-3 bg-[#f6f2f5]">
              <Search className="w-4 h-4 text-[#464555]" />
              <input
                type="text"
                placeholder="Type a command or search issues..."
                autoFocus
                className="w-full bg-transparent text-xs font-medium text-[#1c1b1d] focus:outline-none"
              />
              <kbd className="bg-white border border-[#e5e1e4] px-2 py-0.5 rounded text-[10px] font-mono text-[#464555]">ESC</kbd>
            </div>

            <div className="p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[#464555] uppercase tracking-wider">Quick Actions</div>
              
              <button
                onClick={() => { setCurrentView('dashboard'); setIsCommandPaletteOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#1c1b1d] hover:bg-[#f6f2f5]"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                <span>Go to Overview Dashboard</span>
              </button>

              <button
                onClick={() => { setCurrentView('board'); setIsCommandPaletteOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#1c1b1d] hover:bg-[#f6f2f5]"
              >
                <Kanban className="w-4 h-4 text-indigo-600" />
                <span>Open Kanban Board</span>
              </button>

              <button
                onClick={() => { setIsNewIssueOpen(true); setIsCommandPaletteOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#1c1b1d] hover:bg-[#f6f2f5]"
              >
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Create New Issue</span>
              </button>

              <button
                onClick={() => { setCurrentView('copilot'); setIsCommandPaletteOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#1c1b1d] hover:bg-[#f6f2f5]"
              >
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>Run AI Sprint Copilot</span>
              </button>
            </div>

            <div className="p-3 border-t border-[#e5e1e4] bg-[#f6f2f5] flex items-center justify-between text-[11px] text-[#464555]">
              <span>Navigate with arrow keys</span>
              <span className="font-mono">ProjectPulse v2.4</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
