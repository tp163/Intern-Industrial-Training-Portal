"use client";

import { Button, Chip, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useAppStore } from "@/lib/store/app-store";
import { filterTrainees, TraineeFilters } from "@/components/external-supervisor/trainee-filters";
import { apiCreateTrainingRecord, apiListTrainingRecords, apiUpdateTrainingRecord } from "@/lib/api";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useEffect, useMemo, useState } from "react";

export default function MonthlyProgressPage() {
  const { students, currentUser } = useAppStore();
  const [student, setStudent] = useState("");
  const [month, setMonth] = useState("");
  const [attendance, setAttendance] = useState("");
  const [punctuality, setPunctuality] = useState("");
  const [teamwork, setTeamwork] = useState("");
  const [comments, setComments] = useState("");
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [traineeSearch, setTraineeSearch] = useState("");
  const [traineeDepartment, setTraineeDepartment] = useState("all");
  const [traineeBatch, setTraineeBatch] = useState("all");

  const load = () => apiListTrainingRecords("external_monthly_progress")
    .then((result) => setItems(result.data))
    .catch((error) => notifyError(error instanceof Error ? error.message : "Failed to load monthly progress."));

  useEffect(() => { void load(); }, []);

  const selected = items.find((item) => String(item.student_id) === student && String(item.month_key) === month);
  const selectedStudentName = students.find((item) => item.id === student)?.name ?? "Select trainee";
  const filteredStudents = useMemo(
    () => filterTrainees(students, traineeSearch, traineeDepartment, traineeBatch),
    [students, traineeSearch, traineeDepartment, traineeBatch]
  );

  const edit = (item: Record<string, unknown>) => {
    setStudent(String(item.student_id));
    setMonth(String(item.month_key));
    setAttendance(String(item.attendance_score ?? ""));
    setPunctuality(String(item.punctuality_score ?? ""));
    setTeamwork(String(item.teamwork_score ?? ""));
    setComments(String(item.comments ?? ""));
  };

  const submit = async () => {
    if (!student || !month) return notifyError("Choose a trainee and month.");
    const payload = {
      student_id: student,
      external_supervisor_id: currentUser?.id,
      month_key: month,
      attendance_score: Number(attendance),
      punctuality_score: Number(punctuality),
      teamwork_score: Number(teamwork),
      comments: comments.trim(),
      status: "submitted",
    };
    try {
      if (selected?.id) await apiUpdateTrainingRecord("external_monthly_progress", String(selected.id), payload);
      else await apiCreateTrainingRecord("external_monthly_progress", payload);
      await load();
      notifySuccess("Monthly progress saved.");
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Failed to save monthly progress.");
    }
  };

  return <div className="space-y-5">
    <h1 className="ds-page-title">Monthly Progress</h1>
    <div className="space-y-4 rounded-card border border-border bg-white p-5">
      <TraineeFilters students={students} search={traineeSearch} department={traineeDepartment} batch={traineeBatch} onSearchChange={setTraineeSearch} onDepartmentChange={setTraineeDepartment} onBatchChange={setTraineeBatch} />
      <Select label="Trainee" placeholder="Select trainee" selectedKeys={student ? [student] : []} onSelectionChange={(keys) => setStudent(String(Array.from(keys)[0] ?? ""))} renderValue={() => selectedStudentName}>
        {filteredStudents.map((item) => <SelectItem key={item.id} textValue={`${item.name} (${item.studentId})`}>{item.name} ({item.studentId})</SelectItem>)}
      </Select>
      <Input label="Month" type="month" value={month} onValueChange={setMonth} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Attendance (0-100)" type="number" min="0" max="100" value={attendance} onValueChange={setAttendance} />
        <Input label="Punctuality (0-100)" type="number" min="0" max="100" value={punctuality} onValueChange={setPunctuality} />
        <Input label="Teamwork (0-100)" type="number" min="0" max="100" value={teamwork} onValueChange={setTeamwork} />
      </div>
      <Textarea label="Comments" value={comments} onValueChange={setComments} />
      <Button color="primary" onPress={() => void submit()}>{selected ? "Update monthly progress" : "Submit monthly progress"}</Button>
    </div>
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Progress history</h2>
      {items.length === 0 ? <p className="text-sm text-text-secondary">No monthly progress records yet.</p> : items.map((item) => <div key={String(item.id)} className="flex flex-col gap-3 rounded-card border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{students.find((entry) => entry.id === String(item.student_id))?.name ?? "Trainee"} · {String(item.month_key)}</p><p className="text-sm text-text-secondary">Scores: {String(item.attendance_score)} / {String(item.punctuality_score)} / {String(item.teamwork_score)}</p></div><div className="flex items-center gap-2"><Chip variant="flat">{String(item.status ?? "submitted")}</Chip><Button size="sm" variant="flat" onPress={() => edit(item)}>Edit</Button></div></div>)}
    </div>
  </div>;
}