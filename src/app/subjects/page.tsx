import { connectDB } from "@/lib/db";
import { Subject } from "@/models/Subject";

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  await connectDB();
  const subjects = await Subject.find().select("code name semester faculty").populate("faculty", "name").sort({ semester: 1, name: 1 }).lean();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-navy-900">Subjects</h1>
        <p className="mt-1 text-sm text-slate-500">Courses and assigned faculty from the portal database.</p>
      </header>
      {subjects.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => {
            const facultyName = subject.faculty && "name" in subject.faculty ? subject.faculty.name : "Not assigned";
            return (
              <article key={subject.code} className="card space-y-2 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-royal-600">{subject.code} · Semester {subject.semester}</p>
                <h2 className="font-semibold text-navy-900">{subject.name}</h2>
                <p className="text-sm text-slate-500">Faculty: {facultyName}</p>
              </article>
            );
          })}
        </div>
      ) : <p className="card p-5 text-sm text-slate-500">No subjects are available.</p>}
    </div>
  );
}
