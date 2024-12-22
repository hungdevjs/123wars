const BarGraph = ({ counts }) => {
  const total = counts.rock + counts.paper + counts.scissors;
  const rockPercent = counts.rock / total;
  const paperPercent = counts.paper / total;
  const scissorsPercent = 1 - rockPercent - paperPercent;

  const parts = [
    { width: `${rockPercent * 100}%`, color: '#616d77', show: !!counts.rock, img: 'icons/rock.png', key: 'rock' },
    { width: `${paperPercent * 100}%`, color: '#e8ba5c', show: !!counts.paper, img: 'icons/paper.png', key: 'paper' },
    {
      width: `${scissorsPercent * 100}%`,
      color: '#fd5d72',
      show: !!counts.scissors,
      img: 'icons/scissors.png',
      key: 'scissors',
    },
  ];

  return (
    <div className="w-full h-[20px] flex border border-gray-500 border-b-0">
      {parts.map((part) => (
        <div
          key={part.key}
          className="h-full relative transition-all ease-in-out duration-200"
          style={{ width: part.width, backgroundColor: part.color }}>
          {part.show && (
            <div className="absolute top-0 left-0 w-full -translate-y-full flex justify-center p-1">
              <div className="py-0.5 px-1 rounded min-w-10 bg-white shadow-lg flex items-center justify-center gap-0.5">
                <img src={part.img} alt={part.img} className="w-5" />
                <span className="font-semibold text-sm">{counts[part.key]}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BarGraph;
