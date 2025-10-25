import { IssueStatus } from '../types';


export const getSeverityColor = (severity: number): string => {
  if (severity >= 3) return '#ef4444'; 
  if (severity === 2) return '#f59e0b'; 
  return '#10b981'; 
};


export const getColumnColor = (status: IssueStatus): string => {
  switch (status) {
    case 'Backlog':
      return '#6b7280';
    case 'In Progress':
      return '#3b82f6';
    case 'Done':
      return '#10b981'; 
    default:
      return '#6b7280';
  }
};
