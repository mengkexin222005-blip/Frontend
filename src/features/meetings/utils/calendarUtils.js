export function getDaysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  
  const days = [];
  const prevMonthDays = new Date(year, month, 0).getDate();

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }
  
  const totalDays = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= totalDays; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }
  
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }
  
  return days;
}

export function formatMonthYear(date) {
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
}