"use client";

import { Button, Checkbox, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { apiCreateTrainingRecord, apiUploadFile } from "@/lib/api";
import { useAppStore } from "@/lib/store/app-store";
import { notifyError, notifySuccess } from "@/lib/notify";
import { Upload } from "lucide-react";
import { useState } from "react";

const documentTypes = ["Placement Confirmation Form", "Commencement Confirmation Form", "Appointment Letter", "Training Guidelines", "Daily Record Book"];

export default function TrainingDocumentsPage() {
  const { students, currentUser } = useAppStore();
  const [tab, setTab] = useState<"documents" | "seminars">("documents");
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [issueToAll, setIssueToAll] = useState(false);
  const [type, setType] = useState("Placement Confirmation Form");
  const [files, setFiles] = useState<File[]>([]);
  const [issuing, setIssuing] = useState(false);
  const [event, setEvent] = useState({ title: "Monthly Progress Seminar", date: "", location: "", description: "" });

  const issue = async () => {
    if (!files.length) return notifyError("Choose one or more PDF documents.");
    if (!issueToAll && selectedStudents.size === 0) return notifyError("Select at least one student or choose all students.");
    setIssuing(true);
    try {
      const uploadedFiles = await Promise.all(files.map(async (file) => ({ file, uploaded: await apiUploadFile(file) })));
      const recipients: Array<string | null> = issueToAll ? [null] : Array.from(selectedStudents);
      await Promise.all(recipients.flatMap((studentId) => uploadedFiles.map(({ file, uploaded }) => apiCreateTrainingRecord("training_documents", { student_id: studentId, document_type: type, title: type, file_url: uploaded.url, file_name: file.name, issued_by: currentUser?.id }))));
      notifySuccess(issueToAll ? `${files.length} document(s) issued to all students.` : `${files.length} document(s) issued to ${recipients.length} student(s).`);
      setFiles([]);
    } catch (error) { notifyError(error instanceof Error ? error.message : "Failed to issue documents."); }
    finally { setIssuing(false); }
  };

  const schedule = async () => {
    if (!event.title || !event.date) return notifyError("Enter the seminar title and date.");
    try { await apiCreateTrainingRecord("seminar_events", { title: event.title, event_date: event.date, location: event.location, description: event.description, created_by: currentUser?.id }); notifySuccess("Monthly seminar scheduled."); setEvent({ ...event, date: "", location: "", description: "" }); }
    catch (error) { notifyError(error instanceof Error ? error.message : "Failed to schedule seminar."); }
  };

  return <div className="space-y-6">
    <div><h1 className="ds-page-title">Training Documents & Events</h1><p className="ds-page-description">Upload official forms and appointment letters for one, many, or all students.</p></div>
    <div className="flex gap-1 rounded-xl border border-border bg-surface-muted p-1"><Button color={tab === "documents" ? "primary" : "default"} variant={tab === "documents" ? "solid" : "light"} onPress={() => setTab("documents")}>Official documents</Button><Button color={tab === "seminars" ? "primary" : "default"} variant={tab === "seminars" ? "solid" : "light"} onPress={() => setTab("seminars")}>Monthly seminars</Button></div>
    {tab === "documents" ? <section className="space-y-4 rounded-card border border-border bg-white p-5">
      <Checkbox isSelected={issueToAll} onValueChange={setIssueToAll}>Issue these documents to all students</Checkbox>
      {!issueToAll && <Select label="Students" placeholder="Select one or more students" selectionMode="multiple" selectedKeys={selectedStudents} onSelectionChange={(keys) => setSelectedStudents(new Set(Array.from(keys).map(String)))}>{students.map((item) => <SelectItem key={item.id} textValue={`${item.name} (${item.studentId})`}>{item.name} ({item.studentId})</SelectItem>)}</Select>}
      <Select label="Document type" selectedKeys={[type]} onSelectionChange={(keys) => setType(String(Array.from(keys)[0] ?? type))}>{documentTypes.map((item) => <SelectItem key={item}>{item}</SelectItem>)}</Select>
      <label className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-border px-4 py-2 text-sm"><Upload size={16} className="mr-2" />{files.length ? `${files.length} PDF file(s) selected` : "Choose PDF files"}<input className="hidden" type="file" multiple accept="application/pdf,.pdf" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /></label>
      {files.length > 0 && <ul className="list-inside list-disc text-sm text-text-secondary">{files.map((file) => <li key={`${file.name}-${file.size}`}>{file.name}</li>)}</ul>}
      <Button color="primary" isLoading={issuing} onPress={() => void issue()}>Upload and issue documents</Button>
    </section> : <section className="space-y-4 rounded-card border border-border bg-white p-5"><Input label="Seminar title" value={event.title} onValueChange={(title) => setEvent({ ...event, title })} /><Input label="Date and time" type="datetime-local" value={event.date} onValueChange={(date) => setEvent({ ...event, date })} /><Input label="Location / meeting link" value={event.location} onValueChange={(location) => setEvent({ ...event, location })} /><Textarea label="Description" value={event.description} onValueChange={(description) => setEvent({ ...event, description })} /><Button color="primary" onPress={() => void schedule()}>Schedule monthly seminar</Button></section>}
  </div>;
}
