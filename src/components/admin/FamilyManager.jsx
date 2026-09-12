import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { contentAPI, uploadAPI } from "@/utils/api";

const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";

const sections = [
  {
    key: "hero",
    label: "Hero",
    title: "Family page introduction",
    fields: ["subtitle", "title", "content", "image"],
  },
  {
    key: "strength",
    label: "Team Strength",
    title: "Team strength section",
    fields: ["subtitle", "title", "content"],
  },
  {
    key: "structure",
    label: "Structure",
    title: "Structure highlight",
    fields: ["title", "content"],
  },
  {
    key: "chart",
    label: "Organizational Chart",
    title: "Chart heading and introduction",
    fields: ["subtitle", "title", "content"],
  },
  {
    key: "employees",
    label: "Our Employees",
    title: "People behind the process heading",
    fields: ["subtitle", "title", "content"],
  },
];

const EMPTY_SECTION = {
  page: "family",
  section: "",
  title: "",
  subtitle: "",
  content: "",
  image: "",
  order: 0,
  isActive: true,
};

const EMPTY_MEMBER = {
  name: "",
  role: "",
  customRole: "",
  description: "",
  image: "",
  order: 0,
  isActive: true,
};

const leadershipRoles = [
  "Chairman",
  "Managing Director",
  "Director",
  "Team Leaders",
  "Field Executives",
];

const CUSTOM_ROLE = "__custom_role__";

const rolePriority = Object.fromEntries(
  leadershipRoles.map((role, index) => [role, index]),
);

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function FamilyManager() {
  const sectionImageRef = useRef(null);
  const memberImageRef = useRef(null);
  const [records, setRecords] = useState([]);
  const [sectionForm, setSectionForm] = useState(EMPTY_SECTION);
  const [memberForm, setMemberForm] = useState(EMPTY_MEMBER);
  const [sectionImage, setSectionImage] = useState(null);
  const [memberImage, setMemberImage] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadFamily = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await contentAPI.getAdminByPage("family");
      setRecords(response?.data || []);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load family content."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamily();
  }, []);

  const clearMessages = () => {
    setError("");
    setNotice("");
  };

  const updateSection = (field) => (event) => {
    setSectionForm((current) => ({ ...current, [field]: event.target.value }));
    clearMessages();
  };

  const updateMember = (field) => (event) => {
    const value =
      field === "isActive" ? event.target.checked : event.target.value;
    setMemberForm((current) => ({ ...current, [field]: value }));
    clearMessages();
  };

  const chooseImage = (setter) => (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setter(file);
    clearMessages();
  };

  const uploadImage = async (file, title) => {
    if (!file) return "";
    const data = new FormData();
    data.append("image", file);
    data.append("section", "company-overview");
    data.append("category", "gallery");
    data.append("title", title || "Family image");
    data.append("alt", title || "Family image");
    const response = await uploadAPI.uploadSingle(data);
    return response?.data?.url || "";
  };

  const startSectionEdit = (sectionKey) => {
    const record = records.find((item) => item.section === sectionKey);
    setSectionForm({
      ...EMPTY_SECTION,
      section: sectionKey,
      ...(record || {}),
    });
    setSectionImage(null);
    clearMessages();
  };

  const saveSection = async (event) => {
    event.preventDefault();
    setSaving(true);
    clearMessages();
    try {
      let image = sectionForm.image;
      if (sectionImage)
        image = await uploadImage(sectionImage, sectionForm.title);
      const payload = {
        ...sectionForm,
        page: "family",
        section: sectionForm.section,
        image,
        order: Number(sectionForm.order) || 0,
      };
      const existing = records.find(
        (item) => item.section === sectionForm.section,
      );
      if (existing) await contentAPI.update(existing._id, payload);
      else await contentAPI.create(payload);
      setNotice(`${sectionForm.section} section saved successfully.`);
      setSectionImage(null);
      await loadFamily();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save this section."));
    } finally {
      setSaving(false);
    }
  };

  const startMemberEdit = (member) => {
    setEditingMemberId(member._id);
    setMemberForm({
      name: member.subtitle || "",
      role: leadershipRoles.includes(member.title) ? member.title : CUSTOM_ROLE,
      customRole: leadershipRoles.includes(member.title)
        ? ""
        : member.title || "",
      description: member.content || "",
      image: member.image || "",
      order: member.order ?? 0,
      isActive: member.isActive ?? true,
    });
    setMemberImage(null);
    clearMessages();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetMember = () => {
    setEditingMemberId(null);
    setMemberForm(EMPTY_MEMBER);
    setMemberImage(null);
    clearMessages();
  };

  const saveMember = async (event) => {
    event.preventDefault();
    const role =
      memberForm.role === CUSTOM_ROLE
        ? memberForm.customRole.trim()
        : memberForm.role.trim();
    if (!memberForm.name.trim() || !role) {
      setError("Add the family member's name and role before saving.");
      return;
    }
    setSaving(true);
    clearMessages();
    try {
      let image = memberForm.image;
      if (memberImage) image = await uploadImage(memberImage, memberForm.name);
      const payload = {
        page: "family",
        section: "employee",
        subtitle: memberForm.name.trim(),
        title: role,
        content: memberForm.description.trim(),
        image,
        order: Number(memberForm.order) || 0,
        isActive: memberForm.isActive,
      };
      if (editingMemberId) await contentAPI.update(editingMemberId, payload);
      else await contentAPI.create(payload);
      const message = editingMemberId
        ? "Family member updated."
        : "Family member added.";
      resetMember();
      setNotice(message);
      await loadFamily();
    } catch (saveError) {
      setError(
        getErrorMessage(saveError, "Unable to save this family member."),
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (member) => {
    if (!window.confirm(`Remove ${member.subtitle || "this family member"}?`))
      return;
    setDeletingId(member._id);
    clearMessages();
    try {
      await contentAPI.delete(member._id);
      if (editingMemberId === member._id) resetMember();
      setNotice("Family member removed.");
      await loadFamily();
    } catch (deleteError) {
      setError(
        getErrorMessage(deleteError, "Unable to remove this family member."),
      );
    } finally {
      setDeletingId(null);
    }
  };

  const members = records
    .filter((record) => record.section === "employee")
    .sort((first, second) => {
      const firstPriority = rolePriority[first.title] ?? leadershipRoles.length;
      const secondPriority =
        rolePriority[second.title] ?? leadershipRoles.length;
      return (
        firstPriority - secondPriority ||
        (first.order || 0) - (second.order || 0)
      );
    });

  return (
    <div className="min-h-screen bg-[#EFF6FF] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-[#123B63]/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Company Overview / Family
            </p>
            <h1 className="mt-2 font-heading text-3xl font-700 text-[#123B63]">
              Family Manager
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#123B63]/65">
              Manage the family page in clear sections. Add leadership photos
              and as many employee profiles as you need.
            </p>
          </div>
          <a
            href="/company-overview/family"
            target="_blank"
            rel="noreferrer"
            className="border border-[#0066D6] px-4 py-2.5 text-sm font-600 text-[#0066D6] hover:bg-[#0066D6] hover:text-white"
          >
            Preview public page
          </a>
        </div>

        {(error || notice) && (
          <p
            role={error ? "alert" : "status"}
            className={`mt-6 border-l-2 px-4 py-3 text-sm ${error ? "border-[#0066D6] bg-[#0066D6]/10 text-[#0066D6]" : "border-[#00A651] bg-[#00A651]/10 text-[#00A651]"}`}
          >
            {error || notice}
          </p>
        )}

        <section className="mt-8 border border-[#123B63]/10 bg-white p-6 md:p-8">
          <div className="flex items-center gap-3 border-b border-[#123B63]/10 pb-5">
            <FileSectionIcon />
            <div>
              <h2 className="font-heading text-xl font-700">Page sections</h2>
              <p className="mt-1 text-sm text-[#123B63]/60">
                Choose a section, update its copy, and save.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            {sections.map((section) => {
              const record = records.find(
                (item) => item.section === section.key,
              );
              const selected = sectionForm.section === section.key;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => startSectionEdit(section.key)}
                  className={`border p-4 text-left transition-colors ${selected ? "border-[#0066D6] bg-[#0066D6]/5" : "border-[#123B63]/10 hover:border-[#0066D6]"}`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0066D6]">
                    {record ? "Saved" : "Not set"}
                  </span>
                  <h3 className="mt-2 font-heading text-lg font-700">
                    {section.label}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#123B63]/60">
                    {section.title}
                  </p>
                </button>
              );
            })}
          </div>
          {sectionForm.section && (
            <form
              onSubmit={saveSection}
              className="mt-8 grid gap-5 border-t border-[#123B63]/10 pt-8 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-700">
                    Edit {sectionForm.section}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSectionForm(EMPTY_SECTION)}
                    className="text-[#123B63]/60 hover:text-[#123B63]"
                    aria-label="Close section editor"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {sections
                .find((item) => item.key === sectionForm.section)
                ?.fields.map((field) => (
                  <label
                    key={field}
                    className={
                      field === "content" || field === "image"
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <span className="mb-2 block text-sm font-600">
                      {field === "content"
                        ? "Description"
                        : field === "image"
                          ? "Hero image URL"
                          : field[0].toUpperCase() + field.slice(1)}
                    </span>
                    {field === "content" ? (
                      <textarea
                        rows={5}
                        value={sectionForm[field]}
                        onChange={updateSection(field)}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        value={sectionForm[field]}
                        onChange={updateSection(field)}
                        className={inputClass}
                      />
                    )}
                  </label>
                ))}
              {sectionForm.section === "hero" && (
                <div className="md:col-span-2">
                  <label
                    htmlFor="family-hero-upload"
                    className="flex cursor-pointer items-center gap-2 border border-dashed border-[#123B63]/20 px-3 py-3 text-sm font-600 text-[#123B63]/70 hover:border-[#0066D6] hover:text-[#0066D6]"
                  >
                    <ImagePlus className="h-4 w-4" />
                    {sectionImage
                      ? sectionImage.name
                      : "Upload a replacement hero image"}
                  </label>
                  <input
                    id="family-hero-upload"
                    ref={sectionImageRef}
                    type="file"
                    accept="image/*"
                    onChange={chooseImage(setSectionImage)}
                    className="sr-only"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={saving}
                className="btn-crimson md:col-span-2 md:w-fit"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save section"}
              </button>
            </form>
          )}
        </section>

        <section className="mt-8 border border-[#123B63]/10 bg-white p-6 md:p-8">
          <div className="flex items-center gap-3 border-b border-[#123B63]/10 pb-5">
            <Users className="h-5 w-5 text-[#0066D6]" />
            <div>
              <h2 className="font-heading text-xl font-700">Our Employees</h2>
              <p className="mt-1 text-sm text-[#123B63]/60">
                Add Chairman, Managing Director, Director, or any other family
                member.
              </p>
            </div>
          </div>
          <form
            onSubmit={saveMember}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label
                className="mb-2 block text-sm font-600"
                htmlFor="family-member-name"
              >
                Name
              </label>
              <input
                id="family-member-name"
                value={memberForm.name}
                onChange={updateMember("name")}
                className={inputClass}
                placeholder="e.g. Ayesha Rahman"
                required
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-600"
                htmlFor="family-member-role"
              >
                Role
              </label>
              <select
                id="family-member-role"
                value={memberForm.role}
                onChange={updateMember("role")}
                className={inputClass}
                required
              >
                <option value="" disabled>
                  Select a role
                </option>
                {leadershipRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
                <option value={CUSTOM_ROLE}>Other / Custom role</option>
              </select>
            </div>
            {memberForm.role === CUSTOM_ROLE && (
              <div>
                <label
                  className="mb-2 block text-sm font-600"
                  htmlFor="family-member-custom-role"
                >
                  Custom role
                </label>
                <input
                  id="family-member-custom-role"
                  value={memberForm.customRole}
                  onChange={updateMember("customRole")}
                  className={inputClass}
                  placeholder="e.g. Recovery Executive"
                  required
                />
              </div>
            )}
            <div className="md:col-span-2">
              <label
                className="mb-2 block text-sm font-600"
                htmlFor="family-member-description"
              >
                Short description
              </label>
              <textarea
                id="family-member-description"
                rows={3}
                value={memberForm.description}
                onChange={updateMember("description")}
                className={inputClass}
                placeholder="Describe this person's responsibility"
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-600"
                htmlFor="family-member-image"
              >
                Photo URL
              </label>
              <input
                id="family-member-image"
                value={memberForm.image}
                onChange={updateMember("image")}
                className={inputClass}
                placeholder="Optional image URL"
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-600"
                htmlFor="family-member-order"
              >
                Display order
              </label>
              <input
                id="family-member-order"
                type="number"
                min="0"
                value={memberForm.order}
                onChange={updateMember("order")}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="family-member-upload"
                className="flex cursor-pointer items-center gap-2 border border-dashed border-[#123B63]/20 px-3 py-3 text-sm font-600 text-[#123B63]/70 hover:border-[#0066D6] hover:text-[#0066D6]"
              >
                <Upload className="h-4 w-4" />
                {memberImage ? memberImage.name : "Upload a member photo"}
              </label>
              <input
                id="family-member-upload"
                ref={memberImageRef}
                type="file"
                accept="image/*"
                onChange={chooseImage(setMemberImage)}
                className="sr-only"
              />
            </div>
            <label className="flex items-center gap-3 text-sm font-600">
              <input
                type="checkbox"
                checked={memberForm.isActive}
                onChange={updateMember("isActive")}
                className="h-4 w-4 accent-[#0066D6]"
              />
              Show this person on the public page
            </label>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button type="submit" disabled={saving} className="btn-crimson">
                <Save className="h-4 w-4" />
                {saving
                  ? "Saving..."
                  : editingMemberId
                    ? "Update member"
                    : "Add family member"}
              </button>
              {editingMemberId && (
                <button
                  type="button"
                  onClick={resetMember}
                  className="inline-flex items-center gap-2 border border-[#123B63]/20 px-4 py-2.5 text-sm font-600"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between border-b border-[#123B63]/10 pb-4">
            <h2 className="font-heading text-xl font-700">
              Saved family members
            </h2>
            <span className="text-sm text-[#123B63]/55">
              {members.length} total
            </span>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 py-10 text-sm text-[#123B63]/60">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Loading family
              content...
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <article
                  key={member._id}
                  className="border border-[#123B63]/10 bg-white p-5"
                >
                  <div className="flex gap-4">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.subtitle || "Family member"}
                        className="h-20 w-20 object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center bg-[#EFF6FF] text-[#0066D6]">
                        <Users className="h-7 w-7" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#0066D6]">
                        {member.isActive === false ? "Hidden" : "Visible"}
                      </p>
                      <h3 className="mt-1 font-heading text-lg font-700">
                        {member.subtitle}
                      </h3>
                      <p className="text-sm font-600 text-[#123B63]/65">
                        {member.title}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#123B63]/65">
                    {member.content || "No description added."}
                  </p>
                  <div className="mt-5 flex gap-3 border-t border-[#123B63]/10 pt-4">
                    <button
                      type="button"
                      onClick={() => startMemberEdit(member)}
                      className="inline-flex items-center gap-2 text-sm font-600 text-[#0066D6]"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === member._id}
                      onClick={() => deleteMember(member)}
                      className="inline-flex items-center gap-2 text-sm font-600 text-[#C62828]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FileSectionIcon() {
  return <Plus className="h-5 w-5 text-[#0066D6]" aria-hidden="true" />;
}
