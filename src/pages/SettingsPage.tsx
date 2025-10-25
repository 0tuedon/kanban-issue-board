import { useState } from 'react';
import { currentUser } from '../constants/currentUser';
import { useIssueStore } from '../store/issueStore';
import './SettingsPage.css';

export const SettingsPage = () => {
    const { pollingInterval, setPollingInterval } = useIssueStore();
    const [tempInterval, setTempInterval] = useState(pollingInterval / 1000);

    const handleIntervalChange = (value: number) => {
        setTempInterval(value);
        setPollingInterval(value * 1000);
    };

    const getRoleBadgeClass = (role: string) => {
        return role === 'admin' ? 'role-badge admin' : 'role-badge contributor';
    };

    const getRoleDescription = (role: string) => {
        if (role === 'admin') {
            return 'Full access - Can drag and drop issues, update status, and modify all content';
        }
        return 'Read-only access - Can view issues and use filters but cannot make changes';
    };

    return (
        <div className="settings-page">
            <div className="settings-container">
                <h1 className="settings-title">Settings</h1>

          
                <section className="settings-section">
                    <h2 className="section-title">User Profile</h2>
                    <div className="profile-card">
                        <div className="profile-avatar">
                            {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-details">
                            <div className="profile-name">{currentUser.name}</div>
                            <div className="profile-role">
                                <span className={getRoleBadgeClass(currentUser.role)}>
                                    {currentUser.role.toUpperCase()}
                                </span>
                            </div>
                            <p className="role-description">
                                {getRoleDescription(currentUser.role)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Sync Settings Section */}
                <section className="settings-section">
                    <h2 className="section-title">Sync Settings</h2>
                    <div className="settings-card">
                        <div className="setting-item">
                            <div className="setting-label">
                                <label htmlFor="polling-interval">Polling Interval</label>
                                <span className="setting-description">
                                    How often the board syncs with the backend (in seconds)
                                </span>
                            </div>
                            <div className="setting-control">
                                <input
                                    id="polling-interval"
                                    type="number"
                                    min="5"
                                    max="60"
                                    value={tempInterval}
                                    onChange={(e) => handleIntervalChange(Number(e.target.value))}
                                    className="interval-input"
                                />
                                <span className="interval-unit">seconds</span>
                            </div>
                        </div>

                        <div className="setting-info">
                            Current sync interval: <strong>{tempInterval}s</strong>
                        </div>
                    </div>
                </section>


            </div>
        </div>
    );
};