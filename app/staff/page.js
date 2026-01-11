"use client"

import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"

export default function StaffPage() {
  const [patient, setPatient] = useState({})
  const [status, setStatus] = useState("inactive")
  const [lastTyping, setLastTyping] = useState(null)
  const socketRef = useRef()

  useEffect(() => {
    socketRef.current = io()

    socketRef.current.on("patient-update", (data) => {
      setPatient(data.form || {})
      setStatus("active")
      setLastTyping(data.lastTyping)
    })

    socketRef.current.on("patient-submit", (data) => {
      setPatient(data.form || {})
      setStatus("submitted")
      setLastTyping(null) 
    })

    return () => {
        if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (status === "active" && lastTyping) {
        if (Date.now() - lastTyping > 15000) {
          setStatus("inactive")
        }
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [lastTyping, status])

  const getStatusBadge = () => {
    if (status === "submitted")
      return <Badge text="Submitted" color="green" />
    if (status === "active")
      return <Badge text="Is actively filling in" color="blue" />
    return <Badge text="Is inactive in the form" color="gray" />
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 space-y-8">

        {/* Header */}
        <div className="border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              Staff Patient Monitor
            </h1>
            <p className="text-sm text-gray-500">
              Real-time Patient Information System
            </p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Info label="First Name" value={patient.firstName} />
            <Info label="Middle Name" value={patient.middleName} />
            <Info label="Last Name" value={patient.lastName} />
            <Info label="Date of Birth" value={patient.dateOfBirth} />
            <Info label="Gender" value={patient.gender} />
            <Info label="Religion" value={patient.religion} />
          </div>

          <div className="space-y-4">
            <Info label="Phone" value={patient.phone} />
            <Info label="Email" value={patient.email} />
            <Info label="Address" value={patient.address} />
            <Info label="Preferred Language" value={patient.preferredLanguage} />
            <Info label="Nationality" value={patient.nationality} />
            <Info label="Emergency Contact" value={patient.emergencyContact} />
          </div>
        </div>
      </div>

      {/* Global Style */}
      <style jsx global>{`
        .info-box {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="info-box">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">
        {value || "-"}
      </p>
    </div>
  )
}

function Badge({ text, color }) {
  const colors = {
    green: "bg-green-100 text-green-700 border-green-300",
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    gray: "bg-gray-100 text-gray-700 border-gray-300"
  }

  return (
    <span className={`px-4 py-1 rounded-full text-sm border ${colors[color]}`}>
      {text}
    </span>
  )
}
