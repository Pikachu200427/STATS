import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, CheckCircle, ChevronLeft, ChevronRight, Check,
  Copy, Lightbulb, AlertTriangle, HelpCircle, ArrowLeft,
  Clock, Award, Sparkles, Terminal, FileCode, CheckCircle2,
  Menu, X, BookMarked, Layers, Share2, Compass, Printer
} from 'lucide-react';
import { getCourseCurriculum, LessonTopic } from '../../data/courseLearningData';
import { COURSES } from '../../data/mockData';
import { courseService } from '../../services/courseService';
import toast from 'react-hot-toast';

export default function CourseLearningPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Find course details
  const fallbackCourse = COURSES.find(c => c.slug === slug);
  const curriculum = useMemo(() => {
    return getCourseCurriculum(slug || 'java-core', fallbackCourse?.title, fallbackCourse?.technology);
  }, [slug, fallbackCourse]);

  // Flatten all topics across modules for easy indexing
  const allTopics = useMemo(() => {
    return curriculum.modules.flatMap(m => m.topics);
  }, [curriculum]);

  // Active topic state
  const [activeTopicId, setActiveTopicId] = useState<string>(() => {
    return allTopics[0]?.id || '';
  });

  // Track completed topics
  const storageKey = `stats_course_progress_${slug || 'default'}`;
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quiz state for the active topic
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Sync active topic if topic list changes
  useEffect(() => {
    if (allTopics.length > 0 && (!activeTopicId || !allTopics.some(t => t.id === activeTopicId))) {
      setActiveTopicId(allTopics[0].id);
    }
  }, [allTopics, activeTopicId]);

  // Reset quiz state when active topic changes
  useEffect(() => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTopicId]);

  const activeTopic = allTopics.find(t => t.id === activeTopicId) || allTopics[0];
  const activeTopicIndex = allTopics.findIndex(t => t.id === activeTopicId);
  const prevTopic = activeTopicIndex > 0 ? allTopics[activeTopicIndex - 1] : null;
  const nextTopic = activeTopicIndex < allTopics.length - 1 ? allTopics[activeTopicIndex + 1] : null;

  // Calculate percentage
  const progressPercent = allTopics.length > 0
    ? Math.round((completedTopicIds.length / allTopics.length) * 100)
    : 0;

  // Handle Mark Completed
  const handleToggleComplete = async (topicId: string) => {
    let updated: string[];
    const isAlreadyCompleted = completedTopicIds.includes(topicId);

    if (isAlreadyCompleted) {
      updated = completedTopicIds.filter(id => id !== topicId);
    } else {
      updated = [...completedTopicIds, topicId];
      toast.success('Topic completed! Great progress! 🚀');
    }

    setCompletedTopicIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }

    // Also persist progress to backend if student is logged in
    const newProgress = Math.round((updated.length / allTopics.length) * 100);
    if (slug) {
      try {
        await courseService.updateProgressBySlug(slug, newProgress);
      } catch (err) {
        // Fallback silently if offline or endpoint not yet loaded
      }
    }
  };

  // Copy code helper
  const handleCopyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeKey(key);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCodeKey(null), 2500);
  };

  // Print study notes
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Learning Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/portal/courses"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-slate hover:text-brand-blue transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft size={14} /> My Courses
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-brand-dark truncate max-w-xs sm:max-w-md">
                {curriculum.courseTitle}
              </h1>
              <p className="text-[11px] text-brand-slate truncate hidden sm:block">
                Instructor: {curriculum.instructor} • Non-Video Interactive Reading Classroom
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Progress badge */}
            <div className="flex items-center gap-2.5 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200">
              <div className="w-20 hidden md:block">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-blue to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, progressPercent)}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-brand-dark">
                {progressPercent}% <span className="text-slate-400 font-normal hidden sm:inline">Done</span>
              </span>
            </div>

            <button
              onClick={handlePrint}
              title="Print or Save Study Notes"
              className="p-2 text-slate-500 hover:text-brand-dark hover:bg-slate-100 rounded-lg transition-colors hidden sm:block"
            >
              <Printer size={16} />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Syllabus"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex relative">
        {/* Left Syllabus Navigation Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[57px] left-0 h-[calc(100vh-57px)] w-80 bg-white border-r border-slate-200 
            z-20 overflow-y-auto flex flex-col shrink-0 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} className="text-brand-blue" /> Syllabus Outline
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {completedTopicIds.length} / {allTopics.length} Read
              </span>
            </div>
            <input
              type="text"
              placeholder="Filter topics..."
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {curriculum.modules.map((module, mIdx) => {
              const filteredTopics = module.topics.filter(t =>
                t.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
                t.summary.toLowerCase().includes(filterQuery.toLowerCase())
              );

              if (filterQuery && filteredTopics.length === 0) return null;

              return (
                <div key={module.id} className="space-y-1.5">
                  <div className="px-2 py-1">
                    <h2 className="text-xs font-bold text-brand-dark uppercase tracking-tight">
                      {module.title}
                    </h2>
                    <p className="text-[10px] text-slate-400 truncate">
                      {module.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    {filteredTopics.map((topic) => {
                      const isActive = topic.id === activeTopicId;
                      const isDone = completedTopicIds.includes(topic.id);

                      return (
                        <button
                          key={topic.id}
                          onClick={() => {
                            setActiveTopicId(topic.id);
                            setSidebarOpen(false);
                          }}
                          className={`
                            w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5
                            ${isActive
                              ? 'bg-blue-50/90 text-brand-blue font-bold shadow-xs border border-blue-200/60'
                              : 'text-slate-700 hover:bg-slate-100/80 font-medium'
                            }
                          `}
                        >
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleComplete(topic.id);
                            }}
                            className={`
                              mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all cursor-pointer
                              ${isDone
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-300 hover:border-slate-400 bg-white'
                              }
                            `}
                            title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                          >
                            {isDone && <Check size={11} strokeWidth={3} />}
                          </span>

                          <div className="flex-1 min-w-0">
                            <span className="truncate block leading-snug">
                              {topic.title}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span><Clock size={10} className="inline mr-0.5" />{topic.readTime}</span>
                              <span className="text-[9px] uppercase font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                {topic.difficulty}
                              </span>
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 font-medium">
              <Award size={13} className="text-amber-500" /> Certificate upon 100%
            </span>
            <Link to="/portal/certificates" className="text-brand-blue font-semibold hover:underline">
              View
            </Link>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-10 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
          {activeTopic ? (
            <article className="space-y-8 animate-fadeIn">
              {/* Topic Hero Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="badge badge-info text-xs font-bold px-2.5 py-0.5">
                    {activeTopic.difficulty} Level
                  </span>
                  <span className="text-xs text-brand-slate flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                    <Clock size={12} /> {activeTopic.readTime}
                  </span>
                  {completedTopicIds.includes(activeTopic.id) && (
                    <span className="badge badge-success text-xs font-bold px-2.5 py-0.5 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Completed
                    </span>
                  )}
                </div>

                <h1 className="heading-md text-brand-dark mb-3">
                  {activeTopic.title}
                </h1>

                <p className="text-sm text-brand-slate leading-relaxed border-l-3 border-brand-blue pl-3 bg-blue-50/30 py-2 rounded-r-lg">
                  {activeTopic.summary}
                </p>

                {/* Objectives */}
                {activeTopic.objectives && activeTopic.objectives.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" /> Key Learning Outcomes
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {activeTopic.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Lesson Content Sections */}
              {activeTopic.sections.map((section, sIdx) => (
                <section
                  key={sIdx}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6"
                >
                  <h2 className="heading-sm text-brand-dark border-b border-slate-100 pb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-brand-blue" />
                    {section.sectionTitle}
                  </h2>

                  {/* Paragraphs */}
                  <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-sans">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {/* Architecture Diagram if available */}
                  {section.diagram && (
                    <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-100 p-4 sm:p-5 overflow-x-auto shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                        <span className="text-xs font-mono font-bold text-teal-400 flex items-center gap-1.5">
                          <Compass size={14} /> {section.diagram.title}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                          Architecture Blueprint
                        </span>
                      </div>
                      <pre className="font-mono text-xs text-cyan-300 leading-snug whitespace-pre overflow-x-auto py-2">
                        {section.diagram.svgOrAscii}
                      </pre>
                      {section.diagram.caption && (
                        <p className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 mt-2">
                          ℹ️ {section.diagram.caption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Code Snippet with Run/Copy */}
                  {section.codeSnippet && (
                    <div className="rounded-xl border border-slate-800 bg-[#0F172A] text-slate-100 overflow-hidden shadow-md">
                      {/* Code Header Bar */}
                      <div className="bg-[#1E293B] px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
                        <div className="flex items-center gap-2">
                          <FileCode size={15} className="text-blue-400" />
                          <span className="font-mono text-xs font-semibold text-slate-200">
                            {section.codeSnippet.filename}
                          </span>
                          <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                            {section.codeSnippet.language}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(section.codeSnippet!.code, `code-${sIdx}`)}
                          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          {copiedCodeKey === `code-${sIdx}` ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400 font-medium">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Code Content */}
                      <pre className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] text-emerald-300 leading-relaxed overflow-x-auto">
                        <code>{section.codeSnippet.code}</code>
                      </pre>

                      {/* Execution Output */}
                      {section.codeSnippet.output && (
                        <div className="border-t border-slate-800 bg-[#090D16] p-3 sm:p-4 text-xs font-mono">
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1.5 font-bold uppercase tracking-wider">
                            <Terminal size={12} className="text-teal-400" /> Standard Output:
                          </div>
                          <pre className="text-slate-300 whitespace-pre-wrap">
                            {section.codeSnippet.output}
                          </pre>
                        </div>
                      )}

                      {/* Code Explanation */}
                      {section.codeSnippet.explanation && (
                        <div className="bg-slate-900/60 p-3 sm:p-4 text-xs text-slate-300 border-t border-slate-800">
                          <span className="font-semibold text-white">Analysis: </span>
                          {section.codeSnippet.explanation}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pro Tip Box */}
                  {section.proTip && (
                    <div className="rounded-xl p-4 bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                        <Lightbulb size={17} />
                      </div>
                      <div>
                        <strong className="font-bold text-amber-950 block mb-0.5">Industry Pro-Tip:</strong>
                        <span>{section.proTip}</span>
                      </div>
                    </div>
                  )}

                  {/* Common Mistake Box */}
                  {section.commonMistake && (
                    <div className="rounded-xl p-4 bg-rose-50/70 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 shrink-0">
                        <AlertTriangle size={17} />
                      </div>
                      <div>
                        <strong className="font-bold text-rose-950 block mb-0.5">Common Gotcha & Debugging:</strong>
                        <span>{section.commonMistake}</span>
                      </div>
                    </div>
                  )}
                </section>
              ))}

              {/* Interactive Knowledge Check Quiz */}
              {activeTopic.quiz && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-5">
                  <div className="flex items-center gap-2 text-brand-dark">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <HelpCircle size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Knowledge Check Quiz</h3>
                      <p className="text-xs text-brand-slate">Test your understanding before advancing</p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    {activeTopic.quiz.question}
                  </p>

                  <div className="space-y-2.5">
                    {activeTopic.quiz.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswer === oIdx;
                      const isCorrect = oIdx === activeTopic.quiz.correctAnswer;

                      let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-semibold';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-brand-blue bg-blue-50/70 text-brand-blue font-bold shadow-xs';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedAnswer(oIdx)}
                          className={`
                            w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between
                            ${btnStyle}
                          `}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-mono text-xs text-slate-600 font-bold">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </span>
                          {quizSubmitted && isCorrect && (
                            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      disabled={selectedAnswer === null}
                      onClick={() => setQuizSubmitted(true)}
                      className="btn-primary btn-sm py-2 px-5 disabled:opacity-50"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className={`p-4 rounded-xl text-xs space-y-1.5 ${selectedAnswer === activeTopic.quiz.correctAnswer ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'}`}>
                      <p className="font-bold">
                        {selectedAnswer === activeTopic.quiz.correctAnswer ? '🎉 Correct Answer!' : '❌ Not quite right'}
                      </p>
                      <p className="text-slate-700">{activeTopic.quiz.explanation}</p>
                      {selectedAnswer !== activeTopic.quiz.correctAnswer && (
                        <button
                          onClick={() => {
                            setQuizSubmitted(false);
                            setSelectedAnswer(null);
                          }}
                          className="mt-2 text-xs font-bold text-rose-700 underline"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Topic Navigation & Mark Completed Action */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="w-full sm:w-auto">
                  {prevTopic ? (
                    <button
                      onClick={() => setActiveTopicId(prevTopic.id)}
                      className="btn-outline btn-sm w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs py-2.5 px-4"
                    >
                      <ChevronLeft size={15} /> Previous: {prevTopic.title.slice(0, 20)}...
                    </button>
                  ) : (
                    <div />
                  )}
                </div>

                {/* Mark Completed Toggle */}
                <button
                  onClick={() => handleToggleComplete(activeTopic.id)}
                  className={`
                    w-full sm:w-auto btn-sm flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold transition-all text-xs
                    ${completedTopicIds.includes(activeTopic.id)
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-brand-blue hover:bg-brand-blue/90 text-white shadow-sm'
                    }
                  `}
                >
                  <CheckCircle size={15} />
                  {completedTopicIds.includes(activeTopic.id)
                    ? 'Completed ✓ (Click to Undo)'
                    : 'Mark as Completed'
                  }
                </button>

                <div className="w-full sm:w-auto">
                  {nextTopic ? (
                    <button
                      onClick={() => {
                        // Automatically complete current if not already
                        if (!completedTopicIds.includes(activeTopic.id)) {
                          handleToggleComplete(activeTopic.id);
                        }
                        setActiveTopicId(nextTopic.id);
                      }}
                      className="btn-primary btn-sm w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs py-2.5 px-4"
                    >
                      Next Topic <ChevronRight size={15} />
                    </button>
                  ) : (
                    <Link
                      to="/portal/courses"
                      className="btn-primary btn-sm w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs py-2.5 px-4"
                    >
                      Finish Course <Award size={15} />
                    </Link>
                  )}
                </div>
              </div>

              {/* 100% Course Completion Celebration */}
              {progressPercent === 100 && (
                <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center space-y-3 shadow-lg">
                  <Award size={48} className="mx-auto text-amber-200 animate-bounce" />
                  <h3 className="heading-sm font-extrabold text-white">
                    Congratulations! You Have Mastered This Course! 🎓
                  </h3>
                  <p className="text-xs text-emerald-100 max-w-lg mx-auto">
                    You have read all curriculum modules and completed all exercises. Your completion status has been updated in the STATS INNOTECH portal.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <Link
                      to="/portal/certificates"
                      className="btn bg-white text-emerald-800 hover:bg-slate-100 text-xs font-bold py-2.5 px-5 rounded-xl shadow"
                    >
                      Claim Verified Certificate
                    </Link>
                    <Link
                      to="/portal/courses"
                      className="btn bg-emerald-700/80 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl"
                    >
                      Return to Courses
                    </Link>
                  </div>
                </div>
              )}
            </article>
          ) : (
            <div className="text-center py-20 card p-8">
              <BookOpen size={48} className="text-slate-300 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-slate-700">No Lesson Selected</h2>
              <p className="text-xs text-slate-500 mt-1">Please pick a topic from the syllabus outline.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
