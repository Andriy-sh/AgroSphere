import { toast } from 'react-toastify';

export const showTaskActionToast = (
  action: 'accept' | 'decline',
  onUndo: () => void
) => {
  const isAccept = action === 'accept';
  const toastId = toast[isAccept ? 'success' : 'error'](
    <div className="flex items-center gap-3 w-full min-w-0 mr-2">
      <span className="flex-1 font-medium">
        Task {isAccept ? 'accepted' : 'declined'}!{' '}
        <span className="text-sm font-normal text-gray-600">
          {isAccept
            ? 'It has been moved to the main task list'
            : 'You can undo this action later.'}
        </span>
      </span>
      <button
        onClick={() => {
          onUndo();
          toast.dismiss(toastId);
        }}
        className="text-xs bg-black text-white px-3 py-1 rounded ml-2 hover:bg-gray-800 p-2"
      >
        Cancel
      </button>
    </div>,
    {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      closeButton: true,
    }
  );
};

export const showUndoToast = () => {
  toast.success('Action undone successfully!', {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showExportToast = (exportedCount: number, filterCount: number) => {
  const message =
    filterCount > 0
      ? `Exported ${exportedCount} tasks with active filters`
      : `Exported ${exportedCount} tasks`;

  toast.success(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showExportErrorToast = () => {
  toast.error('Failed to export tasks', {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showDeleteSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showDeleteErrorToast = (message: string) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
