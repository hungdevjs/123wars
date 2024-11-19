import { useRef } from 'react';

import TabsContent from './TabsContent';

const GameCanvas = () => {
  const canvasRef = useRef();

  return (
    <div className="h-full flex justify-center items-center gap-4">
      <div className="w-2/5 max-h-full aspect-[2/3] bg-white border border-slate-400 hidden lg:flex flex-col">
        <TabsContent />
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={960}
        className="max-w-full max-h-full aspect-[2/3] lg:w-2/5 bg-white  border border-slate-400"
      />
    </div>
  );
};

export default GameCanvas;
