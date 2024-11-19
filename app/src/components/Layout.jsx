import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="h-svh flex flex-col">
      <Header />
      <div className="min-h-0 flex-1 flex flex-col">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
