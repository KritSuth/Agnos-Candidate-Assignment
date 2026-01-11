"use client"

import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import Swal from "sweetalert2"

export default function PatientPage() {
  const socketRef = useRef(null) 
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    preferredLanguage: "",
    nationality: "",
    emergencyContact: "",
    religion: ""
  })
  
  useEffect(() => {
    socketRef.current = io()
    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  const isValidPhone = (phone) => {
    return /^[0-9]{9,10}$/.test(phone)
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    const requiredFields = ["firstName", "lastName", "dateOfBirth", "gender", "phone", "email"]

    requiredFields.forEach((field) => {
        if (!form[field]) {
        newErrors[field] = true
        }
    })

    if (form.phone && !isValidPhone(form.phone)) {
        newErrors.phone = "Invalid phone number"
    }

    if (form.email && !isValidEmail(form.email)) {
        newErrors.email = "Invalid email format"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
        socketRef.current.emit("patient-submit", {
            form,
            status: "submitted",
            submittedAt: Date.now()
        })
        setTimeout(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Patient record saved successfully!",
            showConfirmButton: false,
            timer: 2000, 
          })

          setForm({
            firstName: "",
            middleName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "",
            phone: "",
            email: "",
            address: "",
            preferredLanguage: "",
            nationality: "",
            emergencyContact: "",
            religion: ""
          });
          setErrors({});
        }, 500);
    }  
  }

  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value }
    setForm(newForm)

    if (socketRef.current) {
      socketRef.current.emit("patient-update", {
        form: newForm,
        status: "active",
        lastTyping: Date.now()
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8 space-y-8">

        {/* Header */}
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-blue-700">
            Patient Registration Form
          </h1>
          <p className="text-sm text-gray-500">
            Hospital Information System
          </p>
        </div>

        {/* Section: Patient Name */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-3 text-lg">Patient Name</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                name="firstName"
                value={form.firstName}
                placeholder="First Name"
                onChange={handleChange}
                className={`input ${errors.firstName ? "error" : ""}`}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Middle Name</label>
              <input
                name="middleName"
                value={form.middleName}
                placeholder="Middle Name (Optional)"
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                name="lastName"
                value={form.lastName}
                placeholder="Last Name"
                onChange={handleChange}
                className={`input ${errors.lastName ? "error" : ""}`}
              />
            </div>
          </div>
        </section>

        {/* Section: Personal Info & Contact */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-3 text-lg">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                name="dateOfBirth"
                value={form.dateOfBirth}
                type="date"
                onChange={handleChange}
                className={`input ${errors.dateOfBirth ? "error" : ""}`}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={`input ${errors.gender ? "error" : ""}`}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Religion</label>
              <input
                name="religion"
                value={form.religion}
                placeholder="Religion"
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                placeholder="Phone Number"
                onChange={handleChange}
                className={`input ${errors.phone ? "error" : ""}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                    Please enter a valid phone number
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={form.email}
                placeholder="Email Address"
                onChange={handleChange}
                className={`input ${errors.email ? "error" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                    Please enter a valid email address
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Section: Address */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-3 text-lg">Address</h2>
          <textarea 
            name="address" 
            value={form.address}
            placeholder="Full Address" 
            onChange={handleChange}
            className="input h-24 resize-none" 
          />
        </section>

        {/* Section: Additional */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-3 text-lg">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input name="preferredLanguage" value={form.preferredLanguage} placeholder="Preferred Language" onChange={handleChange} className="input" />
            </div>
            <div>
              <input name="nationality" value={form.nationality} placeholder="Nationality" onChange={handleChange} className="input" />
            </div>
            <div>
              <input 
                name="emergencyContact" 
                value={form.emergencyContact} 
                placeholder="Emergency Contact" 
                onChange={handleChange} 
                className="input" 
              />
              <p className="text-[12px] text-gray-400 mt-1 ml-1">
                (Name - Relationship)
              </p>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-4 border-t">
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
                Save Patient Record
            </button>
        </div>

        {/* Styling */}
        <style jsx global>{`
          .input {
            border: 1px solid #d1d5db;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            width: 100%;
            outline: none;
            color: #1f2937;          
            font-weight: 500;
            background-color: #ffffff;
            transition: all 0.2s;
          }
          .input::placeholder {
            color: #9ca3af;         
            font-weight: 400;
          }
          .input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 1px #2563eb;
            color: #111827;         
          }
          .error {
            border-color: #ef4444;
            box-shadow: 0 0 0 1px #ef4444;
          }
        `}</style>
      </form>
    </div>
  )
}