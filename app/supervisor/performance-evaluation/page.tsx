"use client";

import { Button, Checkbox, Select, SelectItem, Textarea } from "@heroui/react";
import { useAppStore } from "@/lib/store/app-store";
import { apiCreateTrainingRecord, apiListTrainingRecords, apiUpdateTrainingRecord } from "@/lib/api";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useEffect, useMemo, useState } from "react";

type Recommendation = { id: string; student_id: string; diary_maintained: boolean; reports_submitted: boolean; training_duration_completed: boolean; decision: string; comments?: string };

export default function CompletionRecommendationPage() {
  const { students, supervisors, currentUser } = useAppStore();
  const supervisorId = useMemo(() => supervisors.find((s) => s.id === currentUser?.id)?.id ?? currentUser?.id ?? "", [supervisors, currentUser]);
  const assigned = students.filter((student) => student.supervisorId === supervisorId);
  const [student, setStudent] = useState("");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [diary, setDiary] = useState(false);
  const [reports, setReports] = useState(false);
  const [duration, setDuration] = useState(false);
  const [decision, setDecision] = useState("ready_for_completion");
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (!student) return;
    apiListTrainingRecords("completion_recommendations").then((result) => {
      const row = result.data.find((item) => String(item.student_id) === student) as unknown as Recommendation | undefined;
      setRecommendation(row ?? null);
      setDiary(row?.diary_maintained ?? false);
      setReports(row?.reports_submitted ?? false);
      setDuration(row?.training_duration_completed ?? false);
      setDecision(row?.decision ?? "ready_for_completion");
      setComments(row?.comments ?? "");
    }).catch((error) => notifyError(error instanceof Error ? error.message : "Failed to load recommendation."));
  }, [student]);

  const save = async () => {
    if (!student) return notifyError("Choose a student.");
    const payload = { student_id: student, supervisor_id: supervisorId, diary_maintained: diary, reports_submitted: reports, training_duration_completed: duration, decision, comments };
    try {
      if (recommendation?.id) await apiUpdateTrainingRecord("completion_recommendations", recommendation.id, payload);
      else await apiCreateTrainingRecord("completion_recommendations", payload);
      const refreshed = await apiListTrainingRecords("completion_recommendations");
      setRecommendation(refreshed.data.find((item) => String(item.student_id) === student) as unknown as Recommendation ?? null);
      notifySuccess("Completion recommendation saved.");
    } catch (error) { notifyError(error instanceof Error ? error.message : "Failed to save recommendation."); }
  };

  return <div className="space-y-5"><h1 className="ds-page-title">Completion Recommendation</h1><p className="ds-page-description">Verify training completion before admin finalization.</p><Select label="Student" placeholder="Select an assigned student" selectedKeys={student ? new Set([student]) : new Set()} onSelectionChange={(keys) => setStudent(String(Array.from(keys)[0] ?? ""))}>{assigned.map((item) => <SelectItem key={item.id} textValue={`${item.name} (${item.studentId})`}>{item.name} ({item.studentId})</SelectItem>)}</Select><div className="space-y-3 rounded-card border border-border bg-white p-5"><Checkbox isSelected={diary} onValueChange={setDiary}>Diary maintained</Checkbox><Checkbox isSelected={reports} onValueChange={setReports}>Reports submitted</Checkbox><Checkbox isSelected={duration} onValueChange={setDuration}>Training duration completed</Checkbox></div><Select label="Decision" selectedKeys={[decision]} onSelectionChange={(keys) => setDecision(String(Array.from(keys)[0] ?? "ready_for_completion"))}><SelectItem key="ready_for_completion">Ready for completion</SelectItem><SelectItem key="not_ready">Not yet ready</SelectItem><SelectItem key="repeat_training">Repeat training</SelectItem></Select><Textarea label="Comments" value={comments} onValueChange={setComments}/><Button color="primary" onPress={() => void save()}>Save completion recommendation</Button></div>;
}
