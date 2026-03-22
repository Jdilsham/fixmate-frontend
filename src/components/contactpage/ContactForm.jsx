import { useState } from "react";
import axios from "axios";
import ContactLabel from "./ContactLabel";
import ContactInput from "./ContactInput";
import ContactTextarea from "./ContactTextarea";
import ContactButton from "./ContactButton";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/v1/contact/send`, formData);

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <ContactLabel text="Name" />
        <ContactInput
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <ContactLabel text="Email" />
        <ContactInput
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <ContactLabel text="Phone No" />
        <ContactInput
          name="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <ContactLabel text="Message" />
        <ContactTextarea
          name="message"
          placeholder="Write your message"
          value={formData.message}
          onChange={handleChange}
        />
      </div>

      <ContactButton text="SEND MESSAGE" loading={loading} />
    </form>
  );
}