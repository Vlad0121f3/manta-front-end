import React from 'react';
import Svgs from 'resources/icons';
import SocialMenu from 'components/Sidebar/SocialMenu';
import SidebarMenu from 'components/Sidebar/SidebarMenu';

const Sidebar = () => {
  return (
    <div className="sidebar-menu hidden lg:block bg-secondary lg:fixed left-0 h-full">
      <div className="py-6 pl-4 h-full flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="logo-content pl-1 hidden w-full items-center lg:flex">
            <div className="logo border-white">
              <img src={Svgs.Logo} alt="logo" />
            </div>
            <div>
              <h1 className="text-3xl mb-0 pl-2 font-semibold text-accent">
                Dolphin
              </h1>
              <h3 className="text-l mb-0 pl-3 font-semibold text-secondary">
                Boto version
              </h3>
            </div>
          </div>
          <SidebarMenu />
        </div>
        <SocialMenu />
      </div>
    </div>
  );
};

export default Sidebar;
