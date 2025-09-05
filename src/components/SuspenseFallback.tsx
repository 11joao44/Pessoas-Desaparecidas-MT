export default function SuspenseFallback() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-160px)]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
}
