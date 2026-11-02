export const requiredProfileFields = [
  { key: "mobile", label: "Mobile number" },
  { key: "dob", label: "Date of birth" },
  { key: "gender", label: "Gender" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "pincode", label: "Pincode" },
  { key: "year", label: "Year" },
  { key: "semester", label: "Semester" },
  { key: "section", label: "Section" },
  { key: "academicYear", label: "Academic year" },
] as const;

export function getMissingProfileFields(profile: object) {
  return requiredProfileFields.filter(({ key }) => {
    const value = Reflect.get(profile, key);
    return value === undefined || value === null || value === "";
  });
}
