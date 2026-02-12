import { useState } from "react";
import ContactLabel from "./ContactLabel";
import ContactInput from "./ContactInput";
import ContactTextarea from "./ContactTextarea";
import ContactButton from "./ContactButton";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Replace this with your API call later
      console.log("CONTACT FORM DATA:", formData);

      // fake delay (optional)
      await new Promise((r) => setTimeout(r, 800));

      // clear form
      setFormData({ name: "", email: "", phone: "", message: "" });
      alert("Message sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again!");
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