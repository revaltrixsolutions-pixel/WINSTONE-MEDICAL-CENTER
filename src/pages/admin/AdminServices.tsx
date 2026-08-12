import ServiceManager from "../../components/admin/services/ServiceManager";

export default function AdminServices() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ServiceManager />
      </div>
    </main>
  );
}