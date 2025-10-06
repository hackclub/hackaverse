export default function LoginButton() {
    return (
        <a
            href="/api/auth/login"
            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all"
        >
            Login with Roblox
        </a>
    );
}