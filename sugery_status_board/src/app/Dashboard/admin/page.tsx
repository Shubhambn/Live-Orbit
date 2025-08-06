"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { usePatientStore, Patient } from "@/store/patientStore";

import { LuUserPlus, LuClipboardPlus } from "react-icons/lu";
import { CiSearch, CiSquareRemove } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import ProtectedRoute from "@/components/guards/withAuthRedirect";

interface IFormInput {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  contactEmail: string;
}

interface ISearchFormInput {
  searchQuery: string;
}

function PatientInformation() {
  const addPatient = usePatientStore((state) => state.addPatient);
  const patients = usePatientStore((state) => state.patients);
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const result = addPatient(data);
    if (result.success) {
      setFormMessage({ type: "success", text: result.message });
      reset();
    } else {
      setFormMessage({ type: "error", text: result.message });
    }
  };

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const {
    register: registerSearch,
    watch,
    setValue,
  } = useForm<ISearchFormInput>();
  const searchQuery = watch("searchQuery");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        const filteredPatients = patients.filter((patient) =>
          patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredPatients);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, patients]);

  const handleClearSearch = () => {
    setValue("searchQuery", "");
    setSearchResults([]);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto lg:px-4 px-2 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <LuUserPlus className="size-5 lg:size-6 text-accentMain" />
            <h1 className="md:text-2xl font-bold text-viking-950">
              Patient Information Management
            </h1>
          </div>
          <button
            className="bg-viking-700 p-2 rounded-lg lg:hidden text-viking-50 shadow-md hover:bg-viking-800 transition-colors flex justify-center items-center"
            onClick={() => setShowMobileSearch(true)}
          >
            <CiSearch className="stroke-2" />
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* LEFT - Add Patient */}
          <main className="lg:col-span-1 rounded-lg p-3 lg:p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-viking-900">
                Add New Patient
              </h2>
              <p className="text-viking-700 text-base">
                Enter patient information to start tracking their surgical
                progress.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {formMessage && (
                <div
                  className={`p-4 rounded-md ${
                    formMessage.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {formMessage.text}
                </div>
              )}

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="block text-viking-800 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    className="border border-gray-400 rounded-md px-4 py-1 transition-all duration-200"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="block text-viking-800 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    className="border border-gray-400 rounded-md px-4 py-1 transition-all duration-200"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </section>

              {/* Address */}
              <div className="flex flex-col">
                <label
                  htmlFor="streetAddress"
                  className="block text-viking-800 mb-1"
                >
                  Street Address
                </label>
                <input
                  id="streetAddress"
                  className="border border-gray-400 rounded-md px-4 py-1 transition-all duration-200"
                  {...register("streetAddress", {
                    required: "Street address is required",
                  })}
                />
                {errors.streetAddress && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.streetAddress.message}
                  </p>
                )}
              </div>

              {/* Location Fields */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: "city", label: "City" },
                  { id: "state", label: "State" },
                  { id: "country", label: "Country" },
                ].map(({ id, label }) => (
                  <div className="flex flex-col" key={id}>
                    <label htmlFor={id} className="block text-viking-800 mb-1">
                      {label}
                    </label>
                    <input
                      id={id}
                      className="border border-gray-400 rounded-md px-4 py-1 transition-all duration-200"
                      {...register(id as keyof IFormInput, {
                        required: `${label} is required`,
                      })}
                    />
                    {errors[id as keyof IFormInput] && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors[id as keyof IFormInput]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </section>

              {/* Phone Number */}
              <div className="flex flex-col">
                <label
                  htmlFor="phoneNumber"
                  className="block text-viking-800 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  placeholder="+XXX XXXXXXXXXX"
                  className="border border-gray-400 rounded-md px-4 py-1 transition-all duration-200"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+\d{1,3}\s?[\d\s]{9,15}$/,
                      message:
                        "Invalid phone number format. Use +XXX XXXXXXXXXX",
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Contact Email */}
              <div className="flex flex-col">
                <label
                  htmlFor="contactEmail"
                  className="block text-viking-800 mb-1"
                >
                  Contact Email
                </label>
                <input
                  id="contactEmail"
                  placeholder="family@kfc.com"
                  className="border border-gray-400 rounded-md px-4 py-1 transition-all duration-200"
                  {...register("contactEmail", {
                    required: "Contact email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.contactEmail && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-accentMain text-white py-2 rounded-md flex justify-center items-center gap-2 hover:bg-viking-800 transition-colors w-full font-semibold"
              >
                <LuClipboardPlus className="size-6" />
                <span>Add Patient</span>
              </button>
            </form>
          </main>

          {/* RIGHT - Search Panel (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 shadow-lg rounded-lg p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-viking-900">
                Search Patients
              </h2>
              <p className="text-viking-700 text-base">
                Find existing patients by last name.
              </p>
            </div>
            <form className="flex items-center gap-2">
              <input
                className="outline flex-1 rounded-sm px-2 py-1 border border-viking-300 focus:ring-2 focus:ring-viking-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter last name to search"
                {...registerSearch("searchQuery")}
              />
              <button
                type="button"
                className="bg-accentSub rounded-full p-2 hover:bg-viking-500 transition-colors"
              >
                <CiSearch className="size-6 text-accentMain" />
              </button>
              <button
                type="button"
                onClick={handleClearSearch}
                className="bg-accentSub hover:bg-viking-400 text-sm font-semibold text-viking-950 px-2 py-1.5 rounded-sm"
              >
                Clear
              </button>
            </form>

            {searchResults.length > 0 ? (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <LuUserPlus className="size-5 text-accentMain" />
                  <p className="text-viking-950 font-semibold">
                    Found {searchResults.length} patient(s)
                  </p>
                </div>
                <div className="space-y-4">
                  {searchResults.map((patient) => (
                    <div
                      key={patient.patientNumber}
                      className="bg-viking-50 p-4 rounded-lg shadow-sm"
                    >
                      <p className="font-bold text-viking-950">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-viking-700">
                        Patient Number: {patient.patientNumber}
                      </p>
                      <p className="text-sm text-viking-700">
                        Contact: {patient.phoneNumber} | {patient.contactEmail}
                      </p>
                      <p className="text-sm text-viking-700">
                        Address: {patient.streetAddress}, {patient.city},{" "}
                        {patient.state}, {patient.country}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              searchQuery && (
                <div className="mt-6 text-viking-700 text-center">
                  <p>No patients found matching &quot;{searchQuery}&quot;.</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Mobile Overlay */}
        {showMobileSearch && (
          <div className="fixed inset-0 bg-viking-950/70 backdrop-blur-lg z-50 flex flex-col items-center justify-start p-4 pt-20">
            <button
              className="absolute top-4 right-4 text-viking-50 text-3xl"
              onClick={() => setShowMobileSearch(false)}
            >
              <CiSquareRemove />
            </button>
            <h2 className="text-2xl font-bold text-viking-50 mb-6">
              Search Patients
            </h2>

            <form className="w-full max-w-md">
              <div className="relative flex items-center">
                <input
                  className="w-full rounded-md px-4 py-3 pl-10 pr-10 border border-viking-300 focus:ring-2 focus:ring-viking-500 focus:border-transparent transition-all duration-200 text-viking-50"
                  placeholder="Enter last name to search"
                  {...registerSearch("searchQuery")}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 rounded-full text-viking-50 hover:text-viking-900"
                  >
                    <MdCancel className="text-accentMain size-7" />
                  </button>
                )}
              </div>
            </form>

            {searchResults.length > 0 ? (
              <div className="mt-6 w-full max-w-md">
                <div className="flex items-center gap-2 mb-4 text-viking-50">
                  <LuUserPlus className="size-6" />
                  <p className="font-semibold">
                    Found {searchResults.length} patient(s)
                  </p>
                </div>
                <div className="space-y-4">
                  {searchResults.map((patient) => (
                    <div
                      key={patient.patientNumber}
                      className="bg-viking-50 p-4 rounded-lg shadow-sm"
                    >
                      <p className="font-bold text-viking-950">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-viking-700">
                        Patient Number: {patient.patientNumber}
                      </p>
                      <p className="text-sm text-viking-700">
                        Contact: {patient.phoneNumber} | {patient.contactEmail}
                      </p>
                      <p className="text-sm text-viking-700">
                        Address: {patient.streetAddress}, {patient.city},{" "}
                        {patient.state}, {patient.country}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              searchQuery && (
                <div className="mt-6 w-full max-w-md text-viking-50 text-center">
                  <p>No patients found matching &quot;{searchQuery}&quot;.</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default PatientInformation;
