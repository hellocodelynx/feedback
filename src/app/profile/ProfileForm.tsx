"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProfileValues = {
  mobile: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  year: string;
  semester: string;
  section: string;
  academicYear: string;
  college: string;
  degree: string;
  department: string;
  skills: string;
  languages: string;
  databases: string;
  frameworks: string;
  interests: string;
  careerObjective: string;
  linkedin: string;
  github: string;
  about: string;
  photo: string;
};

const fields: { key: keyof ProfileValues; label: string; type?: string }[] = [
  { key: "mobile", label: "Mobile number", type: "tel" },
  { key: "dob", label: "Date of birth", type: "date" },
  { key: "gender", label: "Gender" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "pincode", label: "Pincode" },
  { key: "year", label: "Year" },
  { key: "semester", label: "Semester", type: "number" },
  { key: "section", label: "Section" },
  { key: "academicYear", label: "Academic year" },
  { key: "college", label: "College" },
  { key: "degree", label: "Degree" },
  { key: "department", label: "Department" },
  { key: "skills", label: "Skills (comma-separated)" },
  { key: "languages", label: "Languages (comma-separated)" },
  { key: "databases", label: "Databases (comma-separated)" },
  { key: "frameworks", label: "Frameworks (comma-separated)" },
  { key: "interests", label: "Interests (comma-separated)" },
  { key: "careerObjective", label: "Career objective" },
  { key: "linkedin", label: "LinkedIn profile", type: "url" },
  { key: "github", label: "GitHub profile", type: "url" },
  { key: "photo", label: "Photo URL", type: "url" },
  { key: "about", label: "About me" },
];

export default function ProfileForm({ initialValues }: { initialValues: ProfileValues }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string | number | string[] | null> = {};
    for (const [key, value] of formData.entries()) payload[key] = String(value);
    for (const key of ["skills", "languages", "databases", "frameworks", "interests"]) {
      payload[key] = String(formData.get(key) ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    }
    if (payload.semester) payload.semester = Number(payload.semester);
    else payload.semester = null;

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) {
        setError(result?.error ?? "Unable to update your profile.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Unable to reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="card space-y-5 p-6">
        <div>
          <h2 className="font-semibold text-navy-900">Personal and academic details</h2>
          <p className="mt-1 text-xs text-slate-500">Fields marked as incomplete are needed to finish your profile.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ key, label, type = "text" }) => (
            <label key={key} className={`block text-sm font-medium ${["address", "careerObjective", "about"].includes(key) ? "sm:col-span-2" : ""}`}>
              {label}
              {key === "gender" ? (
                <select name={key} defaultValue={initialValues[key]} className="input mt-1.5">
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : ["address", "careerObjective", "about"].includes(key) ? (
                <textarea name={key} defaultValue={initialValues[key]} rows={3} className="input mt-1.5" />
              ) : (
                <input
                  name={key}
                  type={type}
                  min={key === "semester" ? 1 : undefined}
                  max={key === "semester" ? 8 : undefined}
                  defaultValue={initialValues[key]}
                  className="input mt-1.5"
                />
              )}
            </label>
          ))}
        </div>
      </section>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {saved && <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">Profile updated.</p>}
      <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button>
    </form>
  );
}
