import TabsContent from '../../components/TabsContent';

const Menu = () => {
  return (
    <>
      <div className="grow bg-white flex flex-col justify-center" style={{ height: 'calc(100svh - 207px)' }}>
        <TabsContent />
      </div>
    </>
  );
};

export default Menu;
