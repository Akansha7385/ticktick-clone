export interface Task { 
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low' | 'none';
  subtasks?: Task[];
  showSubtaskInput?: boolean;
  type?: 'task' | 'note';
  tags?: string[];
  dueDate?: string;
  list?: 'inbox' | 'welcome' | 'work' | 'today' | 'next7Days';
  pinned?: boolean;
  description?: string;
}
 