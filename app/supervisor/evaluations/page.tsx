"use client";

import { Button, Chip, Input, Textarea } from "@heroui/react";
import { useAppStore } from "@/lib/store/app-store";
import { apiCreateTrainingRecord, apiListTrainingRecords } from "@/lib/api";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useEffect, useMemo, useState } from "react";

type Component = { name: string; mark: string };
type Evaluation = Record<string, unknown> & { id: string };

const defaultComponents: Component[] = [
  { name: "Logbook and reports", mark: "" },
  { name: "Supervisor assessment", mark: "" },
  { name: "External supervisor assessment", mark: "" },
];

export default function SupervisorEvaluationsPage() {
  const { students, supervisors, currentUser } = useAppStore();
  const supervisorId = useMemo(
    () => supervisors.find((supervisor) => supervisor.id === currentUser?.id)?.id ?? currentUser?.id ?? "",
    [currentUser?.id, supervisors]
  );
  const assignedStudents = students.filter((student) => student.supervisorId === supervisorId);
  const [items, setItems] = useState<Evaluation[]>([]);
  const [studentId, setStudentId] = useState("");
  const [components, setComponents] = useState<Component[]>(defaultComponents);
  const [decision, setDecision] = useState("resubmit");
  const [notes, setNotes] = useState("");
  const [published, setPublished] = useState(false);

  const load = () => apiListTrainingRecords("evaluation_records")
    .then((result) => setItems(result.data as Evaluation[]))
    .catch((error) => notifyError(error instanceof Error ? error.message : "Failed to load evaluations."));

  useEffect(() => { void load(); }, []);

  const selected = items.find((item) => String(item.student_id) === studentId);

  useEffect(() => {
    if (!selected) {
      setComponents(defaultComponents);
      setDecision("resubmit");
      setNotes("");
      setPublished(false);
      return;
    }
    const saved = Array.isArray(selected.components) ? selected.components as Array<{ name?: unknown; mark?: unknown }> : [];
    setComponents(saved.length ? saved.map((component) => ({ name: String(component.name ?? ""), mark: component.mark == null ? "" : String(component.mark) })) : defaultComponents);
    setDecision(String(selected.decision ?? "resubmit"));
    setNotes(String(selected.notes ?? ""));
    setPublished(Boolean(selected.published));
  }, [selected, studentId]);

  const overall = components.reduce((sum, component) => sum + (Number(component.mark) || 0), 0);
  const save = async () => {
    if (!studentId) return notifyError("Choose an assigned student.");
    if (components.some((component) => !component.name.trim() || component.mark.trim() === "" || Number(component.mark) < 0 || Number(component.mark) > 100)) {
      return notifyError("Each component needs a name and mark between 0 and 100.");
    }
    try {
      await apiCreateTrainingRecord("evaluation_records", {
        student_id: studentId,
        evaluator_id: supervisorId,
        components: components.map((component) => ({ ...component, mark: Number(component.mark) })),
        overall_mark: overall,
        decision,
        notes: notes.trim(),
        published,
      });
      await load();
      notifySuccess(published ? "Evaluation saved and published." : "Evaluation saved.");
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Failed to save evaluation.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="ds-page-title">Evaluations</h1>
        <p className="ds-page-description">Arrange final assessments, record component marks, and publish results for assigned trainees.</p>
      </div>
      <section className="space-y-4 rounded-card border border-border bg-white p-5">
        <label className="block text-sm font-medium text-text-primary">Assigned student
          <select className="mt-2 w-full rounded-input border border-border bg-white px-3 py-2.5" value={studentId} onChange={(event) => setStudentId(event.target.value)}>
            <option value="">Select student</option>
            {assignedStudents.map((student) => <option key={student.id} value={student.id}>{student.name} ({student.studentId})</option>)}
          </select>
        </label>
        {components.map((component, index) => <div key={index} className="grid gap-3 sm:grid-cols-[1fr_160px]">
          <Input label={`Component ${index + 1}`} value={component.name} onValueChange={(value) => setComponents((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: value } : item))} variant="bordered" />
          <Input label="Mark" type="number" min="0" max="100" value={component.mark} onValueChange={(value) => setComponents((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, mark: value } : item))} variant="bordered" />
        </div>)}
        <p className="font-semibold">Overall mark: {overall}</p>
        <label className="block text-sm font-medium text-text-primary">Overall decision
          <select className="mt-2 w-full rounded-input border border-border bg-white px-3 py-2.5" value={decision} onChange={(event) => setDecision(event.target.value)}>
            <option value="pass">Pass</option><option value="resubmit">Resubmit</option><option value="extend">Extend</option>
          </select>
        </label>
        <Textarea label="Notes or conditions" value={notes} onValueChange={setNotes} minRows={3} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /> Publish results to student</label>
        <Button color="primary" onPress={() => void save()}>Save evaluation</Button>
      </section>
      <section className="space-y-3"><h2 className="text-lg font-semibold">Evaluation records</h2>{items.length === 0 ? <p className="text-sm text-text-secondary">No evaluations yet.</p> : items.map((item) => <div key={item.id} className="flex items-center justify-between rounded-card border border-border bg-white p-4"><div><p className="font-medium">{assignedStudents.find((student) => student.id === String(item.student_id))?.name ?? "Assigned student"}</p><p className="text-sm text-text-secondary">Overall: {String(item.overall_mark ?? "—")} · {String(item.decision)}</p></div><Chip variant="flat" color={item.published ? "success" : "warning"}>{item.published ? "Published" : "Draft"}</Chip></div>)}</section>
    </div>
  );
}
