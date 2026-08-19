"use client";

import { AppModal } from "@/components/ui/app-modal";
import { PortalPageHeader } from "@/components/student/portal-page-header";
import { ContentCard, EmptyState } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { apiCreateTrainingRecord, apiListTrainingRecords, apiUpdateApplication } from "@/lib/api";
import { useAppStore } from "@/lib/store/app-store";
import { departmentOptions } from "@/lib/departments";
import { notifyError, notifySuccess } from "@/lib/notify";
import { apiUploadFile } from "@/lib/api";
import { formatDate, MAX_CV_BYTES, MAX_UPLOAD_BYTES } from "@/lib/utils";
import type { DepartmentCategory, Internship } from "@/types";
import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Briefcase, CalendarDays, CheckCircle2, FileText, MapPin, Plus, Upload } from "lucide-react";
import { getInitialCvFileName, setStoredCvFileName } from "@/lib/cv-storage";
import { useEffect, useMemo, useRef, useState } from "react";

const typeOptions = [
  { key: "all", label: "All Types" },
  { key: "remote", label: "Remote" },
  { key: "onsite", label: "On-site" },
  { key: "hybrid", label: "Hybrid" },
];

export default function StudentInternshipsPage() {
  const { applications, currentUser, getStudentById, internships, loadRealData, submitApplication, updateStudentRecord } = useAppStore();
  const student = currentUser ? getStudentById(currentUser.id) : undefined;
  const userId = currentUser?.id ?? student?.id ?? "";
  const deptOptions = useMemo(() => {
    return [
      { key: "all", label: "All Departments" },
      ...departmentOptions.map((department) => ({ key: department, label: department })),
    ];
  }, []);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [selected, setSelected] = useState<Internship | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [cvUrl, setCvUrl] = useState<string | undefined>();
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [activeTab, setActiveTab] = useState<"browse" | "placement">("browse");
  const [placementOpen, setPlacementOpen] = useState(false);
  const [commencementOpen, setCommencementOpen] = useState(false);
  const [commencementSubmitted, setCommencementSubmitted] = useState(false);
  const [commencementStatus, setCommencementStatus] = useState<"not_submitted" | "submitted" | "reviewed" | "correction_required">("not_submitted");
  const [placementConfirmation, setPlacementConfirmation] = useState<{ id?: string; name: string; details: string; status: "submitted" | "pending_approval" | "reviewed" | "correction_required" | "approved" } | null>(null);
  const [commencementFile, setCommencementFile] = useState<string | null>(null);
  const [officialDocuments, setOfficialDocuments] = useState<Record<string, unknown>[]>([]);
  const [placementStatus, setPlacementStatus] = useState<"not_placed" | "pending_approval" | "approved" | "rejected">("not_placed");
  const [placement, setPlacement] = useState<Record<string, string>>({
    organization: student?.internshipCompany ?? "",
    department: student?.internshipRole ?? "",
    role: student?.internshipRole ?? "",
    startDate: "",
    endDate: "",
    supervisorName: "",
    supervisorDesignation: "",
    supervisorEmail: "",
    supervisorPhone: "",
    address: "",
    nature: "",
  });
  const [commencement, setCommencement] = useState<Record<string, string>>({
    actualStartDate: "", hrName: "", hrEmail: "", hrPhone: "", schedule: "",
    accommodation: "Not provided", accommodationDetails: "", allowance: "Not provided",
    allowanceDetails: "", supervisorName: "", supervisorDesignation: "", supervisorEmail: "", supervisorPhone: "",
  });

  useEffect(() => {
    setCvFileName(
      getInitialCvFileName(student?.cvFileName ?? (student?.cvUrl ? "cv.pdf" : null))
    );
    setCvUrl(student?.cvUrl);
  }, [student?.cvFileName, student?.cvUrl]);
  const [applying, setApplying] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const activeApplications = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.studentId === userId &&
          (a.status === "pending" || a.status === "reviewing")
      ),
    [applications, userId]
  );
  const appliedIds = useMemo(
    () => new Set(activeApplications.map((a) => a.internshipId)),
    [activeApplications]
  );
  const activeApplicationByInternship = useMemo(
    () => new Map(activeApplications.map((application) => [application.internshipId, application])),
    [activeApplications]
  );

  useEffect(() => {
    loadRealData();
  }, [loadRealData]);

  useEffect(() => {
    if (!userId) return;
    apiListTrainingRecords("placement_confirmations").then((result) => {
      const record = result.data.find((item) => String(item.student_id) === userId);
      if (!record) return;
      setPlacementConfirmation({ id: String(record.id), name: String(record.file_name ?? "Placement confirmation"), details: String(record.file_url ?? ""), status: String(record.status ?? "submitted") as "submitted" | "reviewed" | "correction_required" | "approved" });
      setPlacementStatus(String(record.status) === "approved" ? "approved" : "pending_approval");
      setPlacement((current) => ({ ...current, organization: String(record.organization ?? current.organization), address: String(record.address ?? ""), nature: String(record.nature ?? ""), department: String(record.department ?? ""), role: String(record.role ?? ""), startDate: String(record.start_date ?? ""), endDate: String(record.end_date ?? ""), supervisorName: String(record.external_supervisor_name ?? ""), supervisorDesignation: String(record.external_supervisor_designation ?? ""), supervisorEmail: String(record.external_supervisor_email ?? ""), supervisorPhone: String(record.external_supervisor_phone ?? "") }));
    }).catch(() => {});
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    apiListTrainingRecords("training_documents").then((result) => setOfficialDocuments(result.data)).catch(() => {});
  }, [userId]);

  const placementForm = officialDocuments.find((item) => String(item.document_type) === "Placement Confirmation Form");
  const commencementForm = officialDocuments.find((item) => String(item.document_type) === "Commencement Confirmation Form");

  const openInternships = internships.filter((i) => i.status === "open");

  const setPlacementField = (key: string, value: string) => setPlacement((current) => ({ ...current, [key]: value }));
  const setCommencementField = (key: string, value: string) => setCommencement((current) => ({ ...current, [key]: value }));
  const submitPlacement = () => {
    if (!placement.organization || !placement.startDate || !placement.endDate || !placement.supervisorName || !placement.supervisorEmail) {
      notifyError("Please complete the organization, dates, and supervisor details.");
      return;
    }
    setPlacementStatus("pending_approval");
    setPlacementOpen(false);
    notifySuccess("Placement proposed and sent for approval.");
  };
  const submitCommencement = () => {
    if (!commencement.actualStartDate || !commencement.hrName || !commencement.hrEmail || !commencement.schedule) {
      notifyError("Please complete the actual start date, HR contact, and training schedule.");
      return;
    }
    setCommencementSubmitted(true);
    setCommencementStatus("submitted");
    setCommencementOpen(false);
    notifySuccess("Commencement details submitted for review.");
  };
  const uploadPlacementConfirmation = async (file: File, details: string) => {
    try {
      const uploaded = await apiUploadFile(file);
      const saved = await apiCreateTrainingRecord("placement_confirmations", { student_id: userId, organization: placement.organization, address: placement.address, nature: placement.nature, department: placement.department, role: placement.role, start_date: placement.startDate, end_date: placement.endDate, external_supervisor_name: placement.supervisorName, external_supervisor_designation: placement.supervisorDesignation, external_supervisor_email: placement.supervisorEmail, external_supervisor_phone: placement.supervisorPhone, file_url: uploaded.url, file_name: file.name, status: "submitted" });
      setPlacementConfirmation({ id: String(saved.data.id), name: file.name, details: details || uploaded.url, status: "submitted" });
      setPlacementStatus("pending_approval");
      notifySuccess("Placement confirmation submitted for review.");
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Failed to upload placement confirmation.");
    }
  };
  const uploadCommencementConfirmation = async (file: File) => {
    try {
      const uploaded = await apiUploadFile(file);
      await apiCreateTrainingRecord("commencement_confirmations", { student_id: userId, placement_confirmation_id: placementConfirmation?.id ?? null, file_url: uploaded.url, file_name: file.name, status: "submitted" });
      setCommencementFile(file.name);
      setCommencementSubmitted(true);
      setCommencementStatus("submitted");
      notifySuccess("Commencement confirmation submitted for review.");
      void uploaded;
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Failed to upload commencement confirmation.");
    }
  };

  const filtered = useMemo(() => {
    return openInternships.filter((i) => {
      const matchesSearch =
        !search ||
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.companyName.toLowerCase().includes(search.toLowerCase()) ||
        i.location.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || i.type === typeFilter;
      const matchesDept =
        deptFilter === "all" ||
        i.departmentCategories?.includes(deptFilter as DepartmentCategory) ||
        i.departmentCategory === deptFilter;
      return matchesSearch && matchesType && matchesDept;
    });
  }, [openInternships, search, typeFilter, deptFilter]);

  const handleApply = async () => {
    if (!selected || !student) return;
    if (!cvFileName || !cvUrl) {
      notifyError("Please upload your CV before submitting the application.");
      return;
    }
    setApplying(true);
    try {
      if (documentFile && documentFile.size > MAX_UPLOAD_BYTES) {
        notifyError("Other document must be 10MB or smaller.");
        return;
      }
      const uploadedDocument = documentFile ? await apiUploadFile(documentFile) : null;
      await submitApplication({
        studentId: student.id,
        studentName: student.name,
        internshipId: selected.id,
        internshipTitle: selected.title,
        companyName: selected.companyName,
        coverLetter,
        cvUrl,
        documentUrl: uploadedDocument?.url,
        documentPath: uploadedDocument?.path,
        documentFileName: documentFile?.name,
      });
      await loadRealData();
      setSelected(null);
      setCoverLetter("");
      setDocumentFile(null);
      notifySuccess("Application submitted successfully.");
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    setWithdrawingId(applicationId);
    try {
      await apiUpdateApplication(applicationId, { status: "withdrawn" });
      await loadRealData();
      notifySuccess("Application cancelled.");
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Failed to cancel application.");
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Placements"
        description="Discover and apply to open internship opportunities"
      />

      <div className="flex gap-1 rounded-xl border border-border/60 bg-surface-muted p-1">
        <Button variant={activeTab === "browse" ? "solid" : "light"} color={activeTab === "browse" ? "primary" : "default"} radius="lg" onPress={() => setActiveTab("browse")}>
          Browse internships
        </Button>
        <Button variant={activeTab === "placement" ? "solid" : "light"} color={activeTab === "placement" ? "primary" : "default"} radius="lg" onPress={() => setActiveTab("placement")}>
          My Placement
        </Button>
      </div>

      {activeTab === "placement" && (
        <div className="space-y-5">
          <ContentCard>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-medium text-text-secondary">Current placement summary</p>
                <h2 className="mt-1 text-xl font-semibold">{placement.organization || "No placement confirmed"}</h2>
              </div>
              <Chip color={placementConfirmation?.status === "approved" ? "success" : placementConfirmation?.status === "correction_required" ? "danger" : placementConfirmation?.status === "submitted" ? "warning" : "default"} variant="flat">
                {!placementConfirmation ? "Not submitted" : placementConfirmation.status === "submitted" ? "Submitted" : placementConfirmation.status === "correction_required" ? "Correction required" : placementConfirmation.status === "reviewed" ? "Reviewed" : "Approved"}
              </Chip>
            </div>
            {!placement.organization ? (
              <div className="mt-5 rounded-xl border border-dashed border-border p-5 text-center">
                <p className="text-sm text-text-secondary">Have you secured an internship outside the listed opportunities?</p>
                <p className="mt-4 text-sm font-medium text-primary">Complete and upload the signed placement confirmation PDF in the section below.</p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[["Role / department", placement.role || placement.department], ["Training period", `${placement.startDate || "—"} – ${placement.endDate || "—"}`], ["External supervisor", placement.supervisorName || "—"], ["Supervisor email", placement.supervisorEmail || "—"], ["Address", placement.address || "—"], ["Nature of organization", placement.nature || "—"]].map(([label, value]) => <div key={label}><p className="text-xs font-semibold uppercase text-text-secondary">{label}</p><p className="mt-1 text-sm">{value}</p></div>)}
              </div>
            )}
            {placementConfirmation?.status === "submitted" && <p className="mt-4 text-sm text-warning-700">Your placement confirmation is waiting for administrator or supervisor approval.</p>}
            {placementStatus === "approved" && <div className="mt-5 flex flex-wrap items-center gap-3"><Chip variant="flat" color={commencementStatus === "reviewed" ? "success" : commencementStatus === "submitted" ? "warning" : "default"}>{commencementStatus === "not_submitted" ? "Commencement document not submitted" : commencementStatus === "submitted" ? "Commencement document submitted" : commencementStatus === "correction_required" ? "Correction required" : "Commencement document reviewed"}</Chip><p className="text-sm text-text-secondary">Upload the signed commencement document when required.</p></div>}
            {!placementConfirmation && <Button className="mt-4" color="primary" radius="lg" onPress={() => setPlacementOpen(true)}>Confirm placement with faculty</Button>}
          </ContentCard>
          <ContentCard>
            <div className="mb-4"><h2 className="text-lg font-semibold">Placement Confirmation</h2><p className="mt-1 text-sm text-text-secondary">Download the official placement confirmation form, complete it offline, obtain the required signatures, and upload the signed PDF here.</p></div>
            <div className="space-y-4 rounded-xl border border-border/60 p-4">
              {placementConfirmation && <p className="text-sm text-text-secondary">Uploaded: <span className="font-medium text-text-primary">{placementConfirmation.name}</span> · Status: <span className="font-medium text-primary">{placementConfirmation.status.replace("_", " ")}</span></p>}
              {placementForm ? <Button as="a" href={String(placementForm.file_url)} download variant="bordered" radius="lg">Download placement confirmation form</Button> : <Button isDisabled variant="bordered" radius="lg">Placement form not issued yet</Button>}
              <label className="inline-flex h-12 cursor-pointer items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-white"><Upload size={16} className="mr-2" /> Upload placement confirmation PDF<input type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadPlacementConfirmation(file, placementConfirmation?.details ?? ""); event.currentTarget.value = ""; }} /></label>
              <p className="text-xs text-text-secondary">After upload, an admin/coordinator reviews the document and can approve it or request corrections.</p>
            </div>
          </ContentCard>
          <ContentCard>
            <div className="mb-4"><h2 className="text-lg font-semibold">Commencement Confirmation</h2><p className="mt-1 text-sm text-text-secondary">Download the official form, complete it offline, obtain the external supervisor’s signature and stamp, then upload the signed PDF within the first week.</p></div>
            <div className="flex flex-wrap items-center gap-3">
              {commencementForm ? <Button as="a" href={String(commencementForm.file_url)} download variant="bordered" radius="lg">Download commencement form</Button> : <Button isDisabled variant="bordered" radius="lg">Commencement form not issued yet</Button>}
              <label className="inline-flex h-12 cursor-pointer items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-white"><Upload size={16} className="mr-2" /> Upload signed PDF<input type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadCommencementConfirmation(file); event.currentTarget.value = ""; }} /></label>
              <Chip variant="flat" color={commencementStatus === "reviewed" ? "success" : commencementStatus === "submitted" ? "warning" : commencementStatus === "correction_required" ? "danger" : "default"}>{commencementStatus === "not_submitted" ? "Not submitted" : commencementStatus === "submitted" ? "Submitted" : commencementStatus === "correction_required" ? "Correction required" : "Approved"}</Chip>
              {commencementFile && <span className="text-sm text-text-secondary">{commencementFile}</span>}
            </div>
          </ContentCard>
        </div>
      )}

      {activeTab === "browse" && <div className="flex flex-col gap-4 lg:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search internships..."
          className="flex-1"
        />
        <Select
          className="w-full sm:w-44"
          selectedKeys={[deptFilter]}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as string;
            if (val) setDeptFilter(val);
          }}
          variant="bordered"
          radius="lg"
          aria-label="Department category"
        >
          {deptOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
        <Select
          className="w-full sm:w-44"
          selectedKeys={[typeFilter]}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as string;
            if (val) setTypeFilter(val);
          }}
          variant="bordered"
          radius="lg"
          aria-label="Filter by type"
        >
          {typeOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      </div>}

      {activeTab === "browse" && (filtered.length === 0 ? (
        <ContentCard>
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No internships found"
            description="Try adjusting your search or filters."
          />
        </ContentCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((internship) => {
            const hasApplied = appliedIds.has(internship.id);
            const activeApplication = activeApplicationByInternship.get(internship.id);
            return (
              <ContentCard key={internship.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{internship.title}</h3>
                      <p className="text-sm text-text-secondary">{internship.companyName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={internship.type} />
                      {(internship.departmentCategories?.length || internship.departmentCategory) && (
                        <Chip size="sm" variant="flat">
                          {(internship.departmentCategories?.length
                            ? internship.departmentCategories
                            : [internship.departmentCategory]
                          ).join(", ")}
                        </Chip>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} />
                      {internship.location}
                    </span>
                    <span>·</span>
                    <span>{internship.duration}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-text-primary">{internship.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-text-secondary">
                      Deadline: {formatDate(internship.deadline)}
                    </p>
                    {hasApplied && activeApplication ? (
                      <div className="flex flex-wrap justify-end gap-2">
                        <Chip size="sm" variant="flat" color="success">
                          Applied
                        </Chip>
                        <Button
                          color="danger"
                          variant="flat"
                          size="sm"
                          radius="lg"
                          isLoading={withdrawingId === activeApplication.id}
                          onPress={() => handleWithdraw(activeApplication.id)}
                        >
                          Cancel Application
                        </Button>
                      </div>
                    ) : (
                      <Button
                        color="primary"
                        size="sm"
                        radius="lg"
                        onPress={() => {
                          setSelected(internship);
                          setCoverLetter("");
                          setDocumentFile(null);
                        }}
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                </div>
              </ContentCard>
            );
          })}
        </div>
      ))}

      <AppModal isOpen={placementOpen} onClose={() => setPlacementOpen(false)} title="Confirm placement with faculty" footer={<><Button variant="light" radius="lg" onPress={() => setPlacementOpen(false)}>Cancel</Button><Button color="primary" radius="lg" onPress={submitPlacement}>Save placement details</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          {[["organization", "Organization name"], ["address", "Address"], ["nature", "Nature of organization"], ["department", "Training department / section"], ["role", "Role"], ["startDate", "Proposed start date"], ["endDate", "Proposed end date"], ["supervisorName", "External supervisor name"], ["supervisorDesignation", "Supervisor designation"], ["supervisorEmail", "Supervisor email"], ["supervisorPhone", "Supervisor phone"]].map(([key, label]) => <Input key={key} label={label} type={key.toLowerCase().includes("date") ? "date" : key.toLowerCase().includes("email") ? "email" : "text"} value={placement[key]} onValueChange={(value) => setPlacementField(key, value)} variant="bordered" radius="lg" className={key === "address" || key === "nature" ? "sm:col-span-2" : ""} />)}
        </div>
      </AppModal>

      <AppModal isOpen={commencementOpen} onClose={() => setCommencementOpen(false)} title="Submit commencement details" footer={<><Button variant="light" radius="lg" onPress={() => setCommencementOpen(false)}>Cancel</Button><Button color="primary" radius="lg" onPress={submitCommencement}>Submit for review</Button></>}>
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {[["actualStartDate", "Actual start date"], ["hrName", "HR / training contact name"], ["hrEmail", "HR / training contact email"], ["hrPhone", "HR / training contact phone"]].map(([key, label]) => <Input key={key} label={label} type={key === "actualStartDate" ? "date" : key === "hrEmail" ? "email" : "text"} value={commencement[key]} onValueChange={(value) => setCommencementField(key, value)} variant="bordered" radius="lg" className="min-h-16 text-base" />)}
          </div>
          <Textarea label="Training schedule" placeholder="Describe your working days, hours, and training plan" value={commencement.schedule} onValueChange={(value) => setCommencementField("schedule", value)} variant="bordered" radius="lg" minRows={6} className="text-base" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Accommodation" selectedKeys={[commencement.accommodation]} onSelectionChange={(keys) => setCommencementField("accommodation", String(Array.from(keys)[0] ?? "Not provided"))} variant="bordered" radius="lg"><SelectItem key="Provided">Provided</SelectItem><SelectItem key="Not provided">Not provided</SelectItem></Select>
            <Input label="Accommodation details" value={commencement.accommodationDetails} onValueChange={(value) => setCommencementField("accommodationDetails", value)} variant="bordered" radius="lg" />
            <Select label="Allowance" selectedKeys={[commencement.allowance]} onSelectionChange={(keys) => setCommencementField("allowance", String(Array.from(keys)[0] ?? "Not provided"))} variant="bordered" radius="lg"><SelectItem key="Provided">Provided</SelectItem><SelectItem key="Not provided">Not provided</SelectItem></Select>
            <Input label="Allowance details" value={commencement.allowanceDetails} onValueChange={(value) => setCommencementField("allowanceDetails", value)} variant="bordered" radius="lg" />
          </div>
          <p className="flex items-center gap-2 text-sm text-text-secondary"><CheckCircle2 size={16} className="text-success" /> Internal supervisor details are loaded from your allocation.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[["supervisorName", "External supervisor name"], ["supervisorDesignation", "Designation"], ["supervisorEmail", "Email"], ["supervisorPhone", "Phone"]].map(([key, label]) => <Input key={key} label={label} value={commencement[key]} onValueChange={(value) => setCommencementField(key, value)} variant="bordered" radius="lg" className="min-h-16 text-base" />)}
          </div>
        </div>
      </AppModal>

      <AppModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Apply: ${selected?.title ?? ""}`}
        footer={
          <>
            <Button variant="light" radius="lg" onPress={() => setSelected(null)}>
              Cancel
            </Button>
            <Button
              color="primary"
              radius="lg"
              isLoading={applying}
              onPress={handleApply}
            >
              Submit Application
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="rounded-button border border-border/60 bg-surface-muted p-4 text-sm text-text-secondary">
              <p className="font-semibold text-text-primary">Before you apply</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Upload an updated CV in PDF format (max 5MB).</li>
                <li>Ensure your contact details are current in your profile.</li>
                <li>Include a brief cover letter describing your interest.</li>
                <li>Attach any other requested documents as PDF, Word, image, text, or ZIP files.</li>
              </ul>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">CV Upload (required)</p>
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > MAX_CV_BYTES) {
                      notifyError("CV must be 5MB or smaller.");
                      e.target.value = "";
                      return;
                    }
                    if (!userId) {
                      notifyError("Your profile is still loading. Please try again.");
                      return;
                    }
                    setUploadingCv(true);
                    try {
                      const uploaded = await apiUploadFile(file);
                      setCvFileName(file.name);
                      setCvUrl(uploaded.url);
                      setStoredCvFileName(file.name);
                      updateStudentRecord(userId, { cvFileName: file.name, cvUrl: uploaded.url }, "CV document");
                      notifySuccess("CV uploaded successfully.");
                    } catch (error) {
                      notifyError(error instanceof Error ? error.message : "Failed to upload CV.");
                    } finally {
                      setUploadingCv(false);
                    }
                  }
                }}
              />
              {cvFileName ? (
                <div className="flex items-center justify-between rounded-button border border-border bg-white p-3">
                  <span className="inline-flex items-center gap-2 text-sm">
                    <FileText size={16} className="text-primary" />
                    {cvFileName}
                  </span>
                  <Button size="sm" variant="flat" isLoading={uploadingCv} onPress={() => cvInputRef.current?.click()}>
                    Replace
                  </Button>
                </div>
              ) : (
                <Button
                  variant="bordered"
                  radius="lg"
                  className="w-full border-dashed"
                  startContent={<Upload size={16} />}
                  isLoading={uploadingCv}
                  onPress={() => cvInputRef.current?.click()}
                >
                  Upload CV
                </Button>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">Other Documents (optional)</p>
              <input
                ref={documentInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png,.txt,.csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > MAX_UPLOAD_BYTES) {
                      notifyError("Other document must be 10MB or smaller.");
                      e.target.value = "";
                      return;
                    }
                    setDocumentFile(file);
                  }
                }}
              />
              {documentFile ? (
                <div className="flex items-center justify-between rounded-button border border-border bg-white p-3">
                  <span className="inline-flex min-w-0 items-center gap-2 text-sm">
                    <FileText size={16} className="shrink-0 text-primary" />
                    <span className="truncate">{documentFile.name}</span>
                  </span>
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="flat" onPress={() => documentInputRef.current?.click()}>
                      Replace
                    </Button>
                    <Button size="sm" variant="light" color="danger" onPress={() => setDocumentFile(null)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="bordered"
                  radius="lg"
                  className="w-full border-dashed"
                  startContent={<Upload size={16} />}
                  onPress={() => documentInputRef.current?.click()}
                >
                  Upload Other Document
                </Button>
              )}
            </div>

            <Textarea
              label="Cover Letter"
              placeholder="Tell us why you're a great fit for this role..."
              value={coverLetter}
              onValueChange={setCoverLetter}
              variant="bordered"
              radius="lg"
              minRows={4}
            />
          </div>
        )}
      </AppModal>
    </div>
  );
}
