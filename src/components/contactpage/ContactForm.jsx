import { useState } from "react";
import ContactLabel from "./ContactLabel";
import ContactInput from "./ContactInput";
import ContactTextarea from "./ContactTextarea";
import ContactButton from "./ContactButton";


export default function ContactForm() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit (NO backend yet)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    // Demo submit action
    setTimeout(() => {
      console.log("Contact Form Data:", formData);
      alert("Message sent successfully ✅");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-card p-8 rounded-xl shadow-md w-full max-w-md">
      <h3 className="text-2xl font-semibold mb-6">Get In Touch</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <ContactLabel text="Name" />
          <ContactInput
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
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

        {/* Phone */}
        <div>
          <ContactLabel text="Phone No" />
          <ContactInput
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Message */}
        <div>
          <ContactLabel text="Message" />
          <ContactTextarea
            name="message"
            placeholder="Write your message"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <ContactButton text="SEND MESSAGE" loading={loading} />
      </form>
    </div>
  );
}
