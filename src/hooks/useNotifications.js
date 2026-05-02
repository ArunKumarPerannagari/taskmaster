import { useEffect } from 'react';
import { isOverdue } from '../utils/taskHelpers';
import { parseISO, isToday, isTomorrow } from 'date-fns';

export function useNotifications(tasks, addToast) {
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const overdueCount = tasks.filter(t => isOverdue(t) && !t.completed).length;
    const todayCount = tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      try { return isToday(parseISO(t.dueDate)); } catch { return false; }
    }).length;
    const tomorrowCount = tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      try { return isTomorrow(parseISO(t.dueDate)); } catch { return false; }
    }).length;

    const shown = sessionStorage.getItem('tm_notifications_shown');
    if (shown) return;

    const delay = (fn, ms) => setTimeout(fn, ms);

    if (overdueCount > 0) {
      delay(() => addToast({
        type: 'error',
        title: 'Overdue Tasks!',
        message: `You have ${overdueCount} overdue task${overdueCount > 1 ? 's' : ''} that need attention.`,
      }), 1500);
    }

    if (todayCount > 0) {
      delay(() => addToast({
        type: 'warning',
        title: 'Due Today',
        message: `${todayCount} task${todayCount > 1 ? 's are' : ' is'} due today.`,
      }), 2500);
    }

    if (tomorrowCount > 0) {
      delay(() => addToast({
        type: 'info',
        title: 'Due Tomorrow',
        message: `${tomorrowCount} task${tomorrowCount > 1 ? 's are' : ' is'} due tomorrow.`,
      }), 3500);
    }

    sessionStorage.setItem('tm_notifications_shown', '1');
  }, []); // Run only once on mount
}
