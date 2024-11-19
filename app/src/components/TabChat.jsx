import { useState } from 'react';

import { IconSend } from './Icons';

const TabChat = () => {
  const [text, setText] = useState('');

  return (
    <div className="h-full p-4 flex flex-col gap-2">
      <div className="grow">TabChat, dont build it yet</div>
      <div className="px-4 py-2 flex items-center rounded border border-slate-500">
        <input
          placeholder="Type your message"
          className="grow border-none outline-none bg-transparent"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="p-2 transition duration-300 active:scale-90">
          <IconSend className="w-5 h-5 sm:w-8 sm:h-8" />
        </button>
      </div>
    </div>
  );
};

export default TabChat;
