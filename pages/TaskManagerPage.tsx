
import React, { useState } from 'react';
import { FiCalendar, FiList, FiPlus, FiStar } from 'react-icons/fi';
import TodayView from '../components/tasks/TodayView.tsx';
import TaskListView from '../components/tasks/TaskListView.tsx';
import CalendarView from '../components/tasks/CalendarView.tsx';
import TaskModal from '../components/tasks/TaskModal.tsx';
import DeleteTaskModal from '../components/tasks/DeleteTaskModal.tsx';
import type { Task } from '../types.ts';
import Button from '../components/Button.tsx';

type TaskView = 'today' | 'list' | 'calendar';

const TaskManagerPage: React.FC = () => {
  const [view, setView] = useState<TaskView>('today');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => setRefreshKey(k => k + 1);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };
  
  const handleDeleteTask = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };
  
  const handleSuccess = () => {
    setIsTaskModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedTask(null);
    refreshData();
  }
  
  const renderView = () => {
    switch(view) {
        case 'today':
            return <TodayView key={`today-${refreshKey}`} onEdit={handleEditTask} onDelete={handleDeleteTask} onComplete={refreshData} />;
        case 'list':
            return <TaskListView key={`list-${refreshKey}`} onEdit={handleEditTask} onDelete={handleDeleteTask} />;
        case 'calendar':
            return <CalendarView key={`calendar-${refreshKey}`} onEdit={handleEditTask} />;
        default:
            return null;
    }
  };
  
  const tabs = [
    { id: 'today', label: 'Today', icon: <FiStar /> },
    { id: 'list', label: 'All Tasks', icon: <FiList /> },
    { id: 'calendar', label: 'Calendar', icon: <FiCalendar /> },
  ];

  return (
    <div className="bg-warm-gray dark:bg-brand-dark-200 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-navy-blue dark:text-white font-serif">My Tasks</h1>
            <p className="mt-2 text-lg text-warm-gray-600 dark:text-gray-400">Organize your schedule and stay on top of your work.</p>
          </div>
          <Button onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }}><FiPlus className="mr-2"/> Create Task</Button>
        </header>

        <div className="bg-white dark:bg-brand-dark rounded-lg shadow-md">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setView(tab.id as TaskView)}
                            className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${view === tab.id ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="p-6">
              {renderView()}
            </div>
        </div>
      </div>
      
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onSuccess={handleSuccess}
        task={selectedTask}
      />
      
      <DeleteTaskModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleSuccess}
        task={selectedTask}
      />
    </div>
  );
};

export default TaskManagerPage;
