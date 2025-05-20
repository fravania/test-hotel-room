/**
 * Gets the CSS class for a status badge
 */
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'checked in':
      return 'bg-blue-100 text-blue-800';
    case 'checked out':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'no-show':
      return 'bg-yellow-100 text-yellow-800';
    case 'reserved':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}; 