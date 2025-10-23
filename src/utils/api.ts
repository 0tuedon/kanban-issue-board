import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MockBackendStore {
    issues: any[];
    initialized: boolean;
    initializeIssues: (issues: any[]) => void;
    updateIssue: (issueId: string, updates: any) => void;
}

const useMockBackendStore = create<MockBackendStore>()(
    persist(
        (set, get) => ({
            issues: [],
            initialized: false,

            initializeIssues: (issues: any[]) => {
                set({ issues, initialized: true });
            },

            updateIssue: (issueId: string, updates: any) => {
                const { issues } = get();
                const updatedIssues = issues.map(issue =>
                    issue.id === issueId ? { ...issue, ...updates } : issue
                );
                set({ issues: updatedIssues });
            },
        }),
        {
            name: 'mock-backend-storage',
        }
    )
);


if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
        if (event.key === 'mock-backend-storage' && event.newValue) {
            try {
                const newState = JSON.parse(event.newValue);
                if (newState.state) {
                    useMockBackendStore.setState(newState.state);
                }
            } catch (error) {
                console.error('Error syncing storage across tabs:', error);
            }
        }
    });
}

// had to change the mock functions but it still maintains the same functionalities
export const mockFetchIssues = () => {
    return new Promise(resolve => {
        setTimeout(async () => {
            const store = useMockBackendStore.getState();

            if (!store.initialized || store.issues.length === 0) {
                const module = await import('../data/issues.json');
                store.initializeIssues(module.default);
            }

            resolve(JSON.parse(JSON.stringify(store.issues)));
        }, 500);
    });
};

export const mockUpdateIssue = (issueId: string, updates: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.9) {
                const store = useMockBackendStore.getState();
                store.updateIssue(issueId, updates);

                const updatedIssue = store.issues.find((issue: any) => issue.id === issueId);
                if (updatedIssue) {
                    resolve({ id: issueId, ...updatedIssue });
                } else {
                    reject(new Error('Issue not found'));
                }
            } else {
                reject(new Error('Failed to update issue'));
            }
        }, 500);
    });
};
