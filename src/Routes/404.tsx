import { useEssentials } from "@/Hooks/useEssentials";

export default function NotFoundPage() {
  const { navigate } = useEssentials();
  return (
    <div className="h-screen bg-transparent dark:text-white flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold">404</h1>
        <p className="text-3xl mt-4">Page Not Found</p>
        <p className="text-lg mt-2">
          The page you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary-dark hover:bg-primary-light text-white font-bold py-2 px-4 rounded mt-6"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}
