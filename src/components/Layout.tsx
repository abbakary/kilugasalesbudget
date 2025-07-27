import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import HorizontalMenu from './HorizontalMenu';
import Footer from './Footer';
import PasswordModal from './PasswordModal';
import ToastContainer from './ToastContainer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="layout-wrapper flex flex-col">
        {location.pathname === '/' ? (
          <div className="flex-grow container mx-auto px-4 py-6">
            {children}
          </div>
        ) : (
          <>
            <Navbar onPasswordModalOpen={() => setIsPasswordModalOpen(true)} />
            <div className="layout-page flex-grow mt-16 mb-24">
              <div className="content-wrapper flex flex-col">
                <HorizontalMenu />
                <div className="flex-grow container mx-auto px-4 py-6">
                  {children}
                </div>
              </div>
            </div>
            <Footer className="mt-auto" />
          </>
        )}
      </div>
      <PasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
      <ToastContainer />
    </div>
  );
};

export default Layout;