import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Create a Notyf instance
const notyf = new Notyf({
  duration: 3000,
  position: {
    x: 'right',
    y: 'top',
  },
  types: [
    {
      type: 'success',
      background: '#28a745',
      icon: {
        className: 'notyf__icon--success',
        tagName: 'i',
      }
    },
    {
      type: 'error',
      background: '#dc3545',
      icon: {
        className: 'notyf__icon--error',
        tagName: 'i',
      }
    }
  ]
});

// Utility functions for notifications
export const showSuccessNotification = (message) => {
  notyf.success(message);
};

export const showErrorNotification = (message) => {
  notyf.error(message);
};

export default notyf;