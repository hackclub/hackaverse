import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/auth";

export default async function AppPage() {
    const session = await getUserSession();

    if (!session) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
                <div className="text-center mb-6">
                    <div className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                         Authenticated
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome, {session.email}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        You're all set up and ready to go.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
                        Your Information
                    </h2>
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-200">
                            <span className="font-semibold text-gray-600 sm:min-w-[120px]">
                                Email:
                            </span>
                            <span className="text-gray-800">
                                {session.email}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center py-2">
                            <span className="font-semibold text-gray-600 sm:min-w-[120px]">
                                Member since:
                            </span>
                            <span className="text-gray-800">
                                {new Date(session.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 justify-center">
                    <a
                        href="/"
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all hover:-translate-y-0.5 shadow-lg"
                    >
                        Home
                    </a>
                </div>
            </div>
        </div>
    );
}