import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIssueStore } from '../store/issueStore';
import { IssueStatus } from '../types';
import { currentUser } from '../constants/currentUser';
import { toast } from 'react-toastify';
import './IssueDetailPage.css';

export const IssueDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { issues, addRecentlyAccessed, updateIssue } = useIssueStore();
    const [isUpdating, setIsUpdating] = useState(false);

    const issue = issues.find(i => i.id === id);
    const isAdmin = currentUser.role === 'admin';

    useEffect(() => {
        if (id) {
            addRecentlyAccessed(id);
        }
    }, [id, addRecentlyAccessed]);

    if (!issue) {
        return (
            <div className="issue-detail-page">
                <div className="issue-not-found">
                    <h2>Issue Not Found</h2>
                    <p>The issue you're looking for doesn't exist or has been deleted.</p>
                    <button onClick={() => navigate('/board')} className="back-button">
                        ← Back to Board
                    </button>
                </div>
            </div>
        );
    }

    const handleStatusChange = async (newStatus: IssueStatus) => {
        if (!isAdmin) return;

        setIsUpdating(true);
        try {
            await updateIssue(issue.id, { status: newStatus });
            toast.success('Status updated successfully');
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const getSeverityColor = (severity: number): string => {
        if (severity >= 3) return '#ef4444';
        if (severity === 2) return '#f59e0b';
        return '#10b981';
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="issue-detail-page">
            <div className="issue-detail-container">
                <button onClick={() => navigate('/board')} className="back-button">
                    ← Back to Board
                </button>

                <div className="issue-detail-card">
                    <div className="issue-header">
                        <div className="issue-header-left">
                            <span className="issue-id-large">#{issue.id}</span>
                            <span
                                className="severity-badge-large"
                                style={{ backgroundColor: getSeverityColor(issue.severity) }}
                            >
                                Severity {issue.severity}
                            </span>
                        </div>
                    </div>

                    <h1 className="issue-title-large">{issue.title}</h1>

                    <div className="issue-details-grid">
                        <div className="detail-item">
                            <label className="detail-label">Status</label>
                            {isAdmin ? (
                                <select
                                    value={issue.status}
                                    onChange={(e) => handleStatusChange(e.target.value as IssueStatus)}
                                    disabled={isUpdating}
                                    className="status-select"
                                >
                                    <option value="Backlog">Backlog</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            ) : (
                                <div className="status-badge">{issue.status}</div>
                            )}
                        </div>

                        <div className="detail-item">
                            <label className="detail-label">Priority</label>
                            <div className={`priority-badge priority-${issue.priority}`}>
                                {issue.priority}
                            </div>
                        </div>

                        <div className="detail-item">
                            <label className="detail-label">Assignee</label>
                            <div className="assignee-display">
                                <span className="assignee-icon">👤</span>
                                <span className="assignee-name">{issue.assignee}</span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <label className="detail-label">Created</label>
                            <div className="created-date">{formatDate(issue.createdAt)}</div>
                        </div>
                    </div>

                    {issue.tags && issue.tags.length > 0 && (
                        <div className="tags-section">
                            <label className="detail-label">Tags</label>
                            <div className="tags-container">
                                {issue.tags.map(tag => (
                                    <span key={tag} className="tag-large">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {!isAdmin && (
                        <div className="permission-notice">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm0 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-7a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1z"/>
                            </svg>
                            <span>You have read-only access. Only admins can edit issues.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
