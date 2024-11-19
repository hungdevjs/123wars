import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { updateUsername } from '../services/user.service';

const usernameRegex = /^[a-zA-Z0-9._]*$/;

const ModalUpdateUsername = ({ open, close, username }) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(username);

  const submit = async () => {
    setLoading(true);

    try {
      await updateUsername({ username: value });
      toast.success('Updated username');
      close();
    } catch (err) {
      toast.error(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    setValue(username || '');
  }, [open]);

  return (
    <div
      className={`relative z-10 ${open ? '' : 'hidden'}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0" onClick={close}>
          <div
            className="relative rounded bg-white flex flex-col gap-2 shadow-xl transition-all sm:my-8 w-full sm:max-w-lg p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              <p>Your username</p>
              <input
                className="px-4 py-2 border border-slate-200 rounded outline-none"
                value={value}
                disabled={loading}
                onChange={(e) => {
                  if (usernameRegex.test(e.target.value)) {
                    setValue(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    submit();
                  }
                }}
              />
            </div>
            <button
              type="button"
              disabled={loading}
              className="justify-center rounded bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition duration-300 active:bg-green-700 disabled:opacity-60"
              onClick={submit}
            >
              {loading ? 'Updating...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdateUsername;
