export function getMeetingColorClass(type) {
  switch (type) {
    case 'Client Consultation':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'Internal Meeting':
      return 'bg-red-50 text-red-600 border-red-200';
    case 'Product Demo':
      return 'bg-purple-50 text-purple-600 border-purple-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}