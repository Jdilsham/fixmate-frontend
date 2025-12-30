import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_BACKEND_URL;

const GoogleLoginButton = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/google`,
        {
          idToken: credentialResponse.credential,
        }
      );

      // save backend JWT
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in with Google");

      // redirect
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google Login Failed")}
      />
    </div>
  );
};

export default GoogleLoginButton;
