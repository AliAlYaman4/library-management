export function convertToCSV(data: any[], headers: string[]): string {
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      
      // Handle null/undefined
      if (value === null || value === undefined) return '';
      
      // Handle dates
      if (value instanceof Date) {
        return value.toISOString();
      }
      
      // Handle strings with commas or quotes
      if (typeof value === 'string') {
        const escaped = value.replace(/"/g, '""');
        return `"${escaped}"`;
      }
      
      return value;
    });
    
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportBooksToCSV(books: any[]): string {
  const headers = [
    'id',
    'title',
    'author',
    'genre',
    'publishedYear',
    'totalCopies',
    'availableCopies',
    'borrowCount',
    'viewCount',
    'createdAt',
  ];
  
  return convertToCSV(books, headers);
}

export function exportBorrowRecordsToCSV(records: any[]): string {
  const headers = [
    'id',
    'userId',
    'bookId',
    'borrowedAt',
    'dueDate',
    'returnedAt',
    'daysLate',
    'penalty',
  ];
  
  return convertToCSV(records, headers);
}

export function exportUsersToCSV(users: any[]): string {
  const headers = [
    'id',
    'email',
    'name',
    'role',
    'totalPenalty',
    'createdAt',
  ];
  
  return convertToCSV(users, headers);
}

export function exportActivityLogsToCSV(logs: any[]): string {
  const headers = [
    'id',
    'userId',
    'action',
    'entityType',
    'entityId',
    'details',
    'createdAt',
  ];
  
  return convertToCSV(logs, headers);
}
