export default function DashboardLayout({sidebar , children}){
    return(
        <div className="min-h-screen bg-muted/40">
            <div className="flex">
                {sidebar}
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}