import Header from './/Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="h-svh flex flex-col bg-slate-100">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
