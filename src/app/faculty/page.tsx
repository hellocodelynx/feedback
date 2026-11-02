import { connectDB } from "@/lib/db";
import { Faculty } from "@/models/Faculty";

export const dynamic = "force-dynamic";

export default async function FacultyPage() {
  await connectDB();
  const faculty = await Faculty.find().select("name designation department subject experienceYears qualification intro email office semester").sort({ name: 1 }).lean();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-navy-900">Faculty directory</h1>
        <p className="mt-1 text-sm text-slate-500">Faculty information from the portal database.</p>
      </header>
      {faculty.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {faculty.map((member) => (
            <article key={String(member._id)} className="card space-y-2 p-5">
              <h2 className="font-semibold text-navy-900">{member.name}</h2>
              <p className="text-sm text-slate-600">{member.designation}</p>
              <p className="text-sm text-slate-600">{member.subject}</p>
              {member.qualification && <p className="text-sm text-slate-500">{member.qualification}</p>}
              {member.email && <a className="text-sm text-royal-600 hover:underline" href={`mailto:${member.email}`}>{member.email}</a>}
            </article>
          ))}
        </div>
      ) : <p className="card p-5 text-sm text-slate-500">No faculty records are available.</p>}
    </div>
  );
}
