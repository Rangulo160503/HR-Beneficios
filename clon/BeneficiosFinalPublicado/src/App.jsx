import Display from "./components/Display";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="h-full flex overflow-x-hidden">
        <main className="flex-1 min-w-0">
          <Display />
        </main>
      </div>
    </div>
  );
}
