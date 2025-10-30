import { useEffect, useState } from "react";
import InputField from "../components/InputField";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
 
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user && user.email) {
      toast.success("Welcome back!");
      navigate("/game");  
    } else {
      toast.error("Please login first");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields!");
      return;
    }
    const formData = { email, password } ;

 try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      toast.success(res.data.message);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("token", res.data.token);

          setTimeout(() => navigate("/game"), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#031621] to-[#062a3b] text-white font-sans">
      <Toaster position="top-center" />
      <div className="bg-[#0b2a38]/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-[#1e4d58]/40 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-sky-300 mb-6">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col items-center">
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className="mt-4 bg-sky-500 hover:bg-sky-600 px-6 py-2 rounded-lg font-semibold transition-all duration-200 w-full"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-sky-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
