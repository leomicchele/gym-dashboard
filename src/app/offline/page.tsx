import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Sin conexión</h1>
      <p className="mb-6 text-gray-600">
        Parece que no tienes conexión a internet. Algunas funciones podrían no estar disponibles.
      </p>
      <Link 
        href="/"
        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Intentar nuevamente
      </Link>
    </div>
  );
} 