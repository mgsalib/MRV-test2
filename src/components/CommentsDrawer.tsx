import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  X, 
  User, 
  Building, 
  Filter,
  Check
} from 'lucide-react';
import { ReviewComment, UserRole } from '../types';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: ReviewComment[];
  activeRole: UserRole;
  currentUserName: string;
  currentUserEntity: string;
  onAddComment: (comment: Omit<ReviewComment, 'id' | 'timestamp'>) => void;
  onToggleResolve: (commentId: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  comments,
  activeRole,
  currentUserName,
  currentUserEntity,
  onAddComment,
  onToggleResolve,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedSection, setSelectedSection] = useState('Form 1A: Financial Support Needed');
  const [filterResolved, setFilterResolved] = useState<'All' | 'Unresolved' | 'Resolved'>('All');

  if (!isOpen) return null;

  const filteredComments = comments.filter((c) => {
    if (filterResolved === 'Unresolved') return !c.isResolved;
    if (filterResolved === 'Resolved') return c.isResolved;
    return true;
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    onAddComment({
      authorName: currentUserName,
      authorRole: activeRole,
      entity: currentUserEntity,
      formSection: selectedSection,
      content: newCommentText.trim(),
      isResolved: false,
    });

    setNewCommentText('');
  };

  const sections = [
    'General Information',
    'Form 1A: Financial Support Needed',
    'Form 1B: Financial Support Received',
    'Form 2A: Capacity Building Support Needed',
    'Form 2B: Capacity Building Support Received',
    'Form 3A: Technological Support Needed',
    'Form 3B: Technological Support Received',
    'Form 4: Barriers & Assumptions',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Review Comments & Quality Feedback
              </h3>
              <p className="text-[11px] text-slate-500">
                Support N/R Inter-Agency Review Loop (MoF / MoPEDIC / CCCD)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px] font-medium">Filter feedback:</span>
          <div className="flex gap-1 bg-slate-200/70 p-0.5 rounded-lg text-[11px]">
            {(['All', 'Unresolved', 'Resolved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterResolved(f)}
                className={`px-2.5 py-0.5 rounded-md font-medium transition-all ${
                  filterResolved === f
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          {filteredComments.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No review comments found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Review feedback and verification remarks will appear here.
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`p-4 rounded-2xl border transition-all ${
                  comment.isResolved
                    ? 'bg-slate-50/70 border-slate-200 opacity-75'
                    : 'bg-amber-50/40 border-amber-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs">
                        {comment.authorName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-medium">
                        {comment.authorRole.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{comment.entity}</span>
                      <span>•</span>
                      <span>{comment.timestamp}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleResolve(comment.id)}
                    className={`p-1.5 rounded-lg border text-[11px] flex items-center gap-1 font-medium transition-all ${
                      comment.isResolved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                    }`}
                    title={comment.isResolved ? 'Mark as Unresolved' : 'Mark as Addressed / Resolved'}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{comment.isResolved ? 'Resolved' : 'Mark Resolved'}</span>
                  </button>
                </div>

                <div className="mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                    {comment.formSection}
                  </span>
                </div>

                <p className="text-slate-800 text-xs leading-relaxed bg-white/60 p-2.5 rounded-xl border border-slate-100">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add New Comment Box */}
        <form onSubmit={handlePost} className="p-4 border-t border-slate-200 bg-slate-50 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-800">
              Add Review Feedback / Resolution Note
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="text-[11px] bg-white border border-slate-300 rounded px-2 py-1 text-slate-700"
            >
              {sections.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <textarea
              rows={2}
              required
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Type feedback, verification note, or clarification reply..."
              className="flex-1 bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold flex items-center justify-center shrink-0 shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
