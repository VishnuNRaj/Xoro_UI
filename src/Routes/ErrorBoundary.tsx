// import React from 'react';
// import { useEssentials } from '../Functions/CommonFunctions';

// interface ErrorBoundaryProps {
//     children: React.ReactNode;
// }

// const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
//     const [hasError, setHasError] = React.useState(false);
//     const { navigate } = useEssentials()
//     React.useEffect(() => {
//         setHasError(false);
//     }, []);

//     if (hasError) {
//         return (
//             <div className="h-screen bg-black flex justify-center items-center">
//                 <div className="text-center">
//                     <h1 className="text-9xl text-red-600 font-bold">Error</h1>
//                     <p className="text-3xl text-red-400 mt-4">Something went wrong.</p>
//                     <button onClick={() => navigate("/")} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-6">
//                         Go Back Home
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return children;
// };

// export default ErrorBoundary;