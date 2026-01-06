import { Home,Settings , Calendar } from "lucide-react";

export function DashboardSidebar({tabs,activeTab , setActiveTab }){
    return (
        <aside className="w-64 border-r bg-background min-h-screen px-4 py-6">
            <div className="mb-8 text-lg font-semibold">
                Fixmate
            </div>

            <nav className="space-y-1">
                {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                        activeTab === tab.id ? "bg-muted font-medium" : "hover:bg-muted/60"
                    }`}>
                        <tab.icon className="h-4 w-4"/>
                        {tab.label}
                    </button>
                ))}
                

            </nav>
        </aside>
    )
}