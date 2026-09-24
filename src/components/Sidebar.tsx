import React from 'react';
import { 
  BarChart3, 
  Target, 
  ShieldAlert, 
  Link2, 
  ChevronRight, 
  ChevronDown, 
  LogOut, 
  Leaf,
  Layers,
  Sparkles,
  FileSpreadsheet,
  PlusCircle,
  FolderKanban,
  LayoutDashboard
} from 'lucide-react';

interface SidebarProps {
  activeSection?: string;
  onSelectSection?: (section: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  totalTasksCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection = 'collection_tasks',
  onSelectSection,
  isOpenMobile = false,
  onCloseMobile,
  totalTasksCount = 4,
}) => {
  const menuItems = [
    {
      id: 'ghg_inventory',
      label: 'GHG Inventory',
      icon: BarChart3,
      hasSubmenu: true,
      active: false,
    },
    {
      id: 'mitigation',
      label: 'Mitigation',
      icon: Target,
      hasSubmenu: true,
      active: false,
    },
    {
      id: 'adaptation',
      label: 'Adaptation',
      icon: Leaf,
      hasSubmenu: true,
      active: false,
    },
    {
      id: 'support_nr',
      label: 'Support N/R Module',
      icon: Link2,
      hasSubmenu: true,
      active: true,
      subItems: [
        {
          id: 'cccd_dashboard',
          label: 'CCCD National Dashboard',
          icon: LayoutDashboard,
          badge: 'National',
        },
        {
          id: 'collection_tasks',
          label: 'Collection Tasks Registry',
          icon: FolderKanban,
          badge: `${totalTasksCount}`,
        },
        {
          id: 'forms_workspace',
          label: 'Forms Workspace (7 Forms)',
          icon: FileSpreadsheet,
        }
      ]
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside 
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F3825] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo and App Name */}
        <div>
          <div className="p-5 border-b border-[#1A4B34] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#18452E] border border-[#23583E] flex items-center justify-center text-emerald-300 shadow-inner">
              <Leaf className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white tracking-tight leading-tight">
                Egypt National MRV
              </h1>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                Data Management
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3.5 space-y-1.5 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSectionActive = item.active;

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    id={`nav-item-${item.id}`}
                    onClick={() => {
                      if (item.subItems && item.subItems.length > 0) {
                        if (onSelectSection) onSelectSection(item.subItems[0].id);
                      } else {
                        if (onSelectSection) onSelectSection(item.id);
                      }
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isSectionActive
                        ? 'bg-[#18452E] text-white shadow-xs border border-[#2B6648]'
                        : 'text-emerald-100/70 hover:text-white hover:bg-[#15402B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isSectionActive ? 'text-emerald-400' : 'text-emerald-300/60 group-hover:text-emerald-300'
                      }`} />
                      <span className="tracking-tight">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isSectionActive ? (
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-300/40 group-hover:text-emerald-300/80 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </div>
                  </button>

                  {/* Sub-items for Support N/R */}
                  {item.subItems && isSectionActive && (
                    <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-[#1E5239] ml-4 my-1">
                      {item.subItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = activeSection === sub.id;

                        return (
                          <button
                            key={sub.id}
                            id={`nav-subitem-${sub.id}`}
                            onClick={() => {
                              if (onSelectSection) onSelectSection(sub.id);
                              if (onCloseMobile) onCloseMobile();
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-medium transition-all ${
                              isSubActive
                                ? 'bg-emerald-600/30 text-emerald-200 font-bold border border-emerald-500/40'
                                : 'text-emerald-100/70 hover:text-white hover:bg-[#15402B]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-emerald-300' : 'text-emerald-400/60'}`} />
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.badge && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#0F3825] text-emerald-300 border border-emerald-500/40">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#18452E] space-y-3">
          <button
            id="btn-sign-out"
            onClick={() => {
              alert('Signed out of MRV Portal session.');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-emerald-100/80 hover:text-white hover:bg-[#15402B] rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 text-emerald-300/70" />
            <span>Sign out</span>
          </button>

          <div className="pt-2 border-t border-[#18452E]/70 text-[11px] text-emerald-200/50 leading-relaxed font-normal">
            Copyright © 2026 MRV. All rights reserved.
          </div>
        </div>
      </aside>
    </>
  );
};

