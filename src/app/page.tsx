import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">Bienvenido a Gym Dashboard</h1>
        <p className="text-xl mb-8">La plataforma para gestionar tu gimnasio de forma eficiente.</p>
        <div className="space-y-4">
          <Link 
            href="/auth" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Iniciar sesión o registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}
