"use client";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission logic here, like sending data to a backend API
    console.log(formData);
    // Reset form fields after submission
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <main className="bg-gray-100 min-h-screen w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-[90%]">
        <h1 className="text-3xl font-semibold mb-6">Contact Us</h1>
        <div className="mb-6">
          <p className="mb-2">
            You can reach out to us through the following methods:
          </p>
          <ul>
            <li>Email: info@afobata.com</li>
            <li>Phone: +234 81 6461 4193</li>
            <li>Address: 4613 Bee Caves Rd, Austin, Texas, United States</li>
          </ul>
        </div>
        <h2 className="text-xl font-semibold mb-4">Or send us a message:</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-1">
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
};

export default Contact;
