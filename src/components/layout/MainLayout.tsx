import MainFooter from "../footer/MainFooter";
import Header from "../header/Header";
import ChatWidgetWrapper from "../chat/ChatWidgetWrapper";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Main adaptativo */}
      <main className="flex-1 flex flex-col w-full px-4 py-8">
        {children}
      </main>

      <MainFooter />
      <ChatWidgetWrapper />
    </div>
  );
};

export default MainLayout;
