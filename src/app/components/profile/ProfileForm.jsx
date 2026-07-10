"use client";

import {
  Briefcase,
  Code2,
  Download,
  Edit3,
  Github,
  GraduationCap,
  Linkedin,
  MapPin,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import {
  CODING_PLATFORMS,
  MAX_BIO_LENGTH,
  ONBOARDING_CODING_FIELDS,
  ONBOARDING_OPTIONAL_FIELDS,
  PRESET_PROJECT_GRADIENTS,
} from "@/lib/profileUtils";

const ONBOARDING_FIELD_ICONS = {
  college: GraduationCap,
  branch: ShieldCheck,
  location: MapPin,
  github_profile: Github,
  linkedin_profile: Linkedin,
  resume_link: Briefcase,
};

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-violet-400 dark:focus:ring-violet-950/60";

const compactInputClassName =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-violet-400 dark:focus:ring-violet-950/60";

function FieldLabel({ icon: Icon, label, extra }) {
  return (
    <span className="mb-1.5 flex items-center justify-between gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-neutral-400">
      <span className="flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />}
        {label}
      </span>
      {extra}
    </span>
  );
}

function BasicFields({ formData, onChange, mode }) {
  const essentialFields = [
    ["name", "Full Name", "John Doe", User, true],
    ["skills", "Bio", "Software Engineer passionate about...", Code2, true],
  ];

  const optionalFields = [
    ["branch", "Branch", "Computer Science", ShieldCheck],
    ["college", "College / University", "Your college name", GraduationCap],
    ["location", "Location", "City, Country", MapPin],
    ["github_profile", "GitHub URL", "https://github.com/...", Github],
    ["linkedin_profile", "LinkedIn URL", "https://linkedin.com/in/...", Linkedin],
    ["resume_link", "Resume URL", "https://drive.google.com/...", Briefcase],
  ];

  const renderField = ([name, label, placeholder, Icon, required]) => (
    <label key={name} className={name === "skills" ? "sm:col-span-2" : undefined}>
      <FieldLabel
        icon={Icon}
        label={label}
        extra={
          name === "skills" ? (
            <span className="normal-case tracking-normal text-slate-400 dark:text-neutral-500">
              {formData.skills.length}/{MAX_BIO_LENGTH}
            </span>
          ) : null
        }
      />
      {name === "skills" ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={onChange}
          maxLength={MAX_BIO_LENGTH}
          rows={3}
          placeholder={placeholder}
          className={`${inputClassName} min-h-[88px] resize-y py-2.5`}
        />
      ) : (
        <input
          name={name}
          value={formData[name]}
          onChange={onChange}
          maxLength={name === "skills" ? MAX_BIO_LENGTH : undefined}
          placeholder={placeholder}
          className={inputClassName}
        />
      )}
    </label>
  );

  if (mode === "onboarding") {
    return (
      <div className="space-y-4">
        <div className="grid gap-4">{essentialFields.map(renderField)}</div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...essentialFields.map((f) => [f[0], f[1], f[2], f[3]]), ...optionalFields].map((field) =>
        renderField([...field, false])
      )}
    </div>
  );
}

function AvatarUpload({ formData, user, fileInputRef, savingAvatar, onAvatarChange }) {
  const displayName = formData.name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
      <div className="relative h-24 w-24 shrink-0">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-full w-full overflow-hidden rounded-full border-4 border-slate-100 bg-slate-100 shadow-inner dark:border-neutral-800 dark:bg-neutral-800"
          aria-label="Change profile photo"
        >
          {formData.avatar_url ? (
            <img
              src={formData.avatar_url}
              alt={displayName}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-violet-100 text-2xl font-black text-violet-700 dark:bg-violet-950/50 dark:text-violet-200">
              {initials}
            </span>
          )}
          {savingAvatar && (
            <span className="absolute inset-0 flex items-center justify-center bg-slate-950/50 text-xs font-black text-white">
              Saving
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/40 bg-purple-600 text-white shadow-md dark:bg-purple-700"
          aria-label="Upload avatar"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onAvatarChange}
        />
      </div>
      <div className="text-center sm:text-left">
        <p className="text-sm font-black text-[#111331] dark:text-white">Profile Picture</p>
        <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-neutral-400">
          JPG or PNG, up to 2MB.
        </p>
      </div>
    </div>
  );
}

function OnboardingStep2Fields({
  formData,
  onChange,
  user,
  fileInputRef,
  savingAvatar,
  onAvatarChange,
}) {
  return (
    <div className="space-y-5">
      <AvatarUpload
        formData={formData}
        user={user}
        fileInputRef={fileInputRef}
        savingAvatar={savingAvatar}
        onAvatarChange={onAvatarChange}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {ONBOARDING_OPTIONAL_FIELDS.map(([name, label, placeholder]) => {
          const Icon = ONBOARDING_FIELD_ICONS[name];
          return (
            <label key={name} className={name === "resume_link" ? "sm:col-span-2" : undefined}>
              <FieldLabel icon={Icon} label={label} />
              <input
                name={name}
                value={formData[name]}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClassName}
              />
            </label>
          );
        })}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-black text-[#111331] dark:text-white">Coding Profiles</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {ONBOARDING_CODING_FIELDS.map(([name, label, placeholder]) => (
            <label key={name}>
              <FieldLabel label={label} />
              <input
                name={name}
                value={formData[name]}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClassName}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodingProfilesSection({ formData, onChange, fetchingProfile, onFetchCodingProfile, formatNumber }) {
  return (
    <div className="mt-6 border-t border-slate-100 pt-5 dark:border-neutral-800">
      <div className="mb-4">
        <h3 className="text-sm font-black text-[#111331] dark:text-white">Coding Profiles</h3>
        <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
          Usernames and stats shown on your profile.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {CODING_PLATFORMS.map(([platformKey, usernameField, usernameLabel, statField, statLabel]) => (
          <div
            key={usernameField}
            className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-950/60"
          >
            <label>
              <span className="mb-1.5 block text-xs font-black text-slate-500 dark:text-neutral-400">
                {usernameLabel}
              </span>
              <div className="flex gap-2">
                <input
                  name={usernameField}
                  value={formData[usernameField]}
                  onChange={onChange}
                  placeholder="username"
                  className={`${compactInputClassName} min-w-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={() =>
                    onFetchCodingProfile(
                      platformKey,
                      usernameField,
                      statField,
                      usernameLabel.replace(" Username", "").replace(" Handle", "")
                    )
                  }
                  disabled={fetchingProfile[platformKey] || !formData[usernameField]?.trim()}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-300"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${fetchingProfile[platformKey] ? "animate-spin" : ""}`} />
                  Fetch
                </button>
              </div>
            </label>
            <div className="mt-3 rounded-lg border border-slate-100 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-[11px] font-black text-slate-500 dark:text-neutral-400">{statLabel}</span>
              <p className="mt-1 text-lg font-black text-[#111331] dark:text-white">
                {formatNumber(formData[statField])}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsSection({
  formData,
  projectForm,
  onProjectFormChange,
  editingProjectIndex,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onSaveProject,
  onResetProjectForm,
  onImportFromGitHub,
  importingRepos,
  githubRepos,
  onSelectRepo,
}) {
  return (
    <div className="mt-6 border-t border-slate-100 pt-5 dark:border-neutral-800">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-[#111331] dark:text-white">Projects</h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
            Add up to the projects shown on your profile.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onImportFromGitHub}
            disabled={importingRepos}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-300"
          >
            <Github className="h-3.5 w-3.5" />
            {importingRepos ? "Fetching..." : "Import GitHub"}
            {!importingRepos && <Download className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={onAddProject}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 text-xs font-black text-violet-700 transition hover:bg-violet-100 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-300"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>

      {githubRepos.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-700">
          <p className="border-b border-slate-100 px-3 py-2 text-xs font-black text-slate-500 dark:border-neutral-800 dark:text-neutral-400">
            Select a GitHub repo
          </p>
          <div className="max-h-44 overflow-y-auto">
            {githubRepos.map((repo) => (
              <button
                key={repo.name}
                type="button"
                onClick={() => onSelectRepo(repo)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-violet-50 dark:hover:bg-violet-950/30"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-[#111331] dark:text-white">{repo.name}</p>
                  {repo.description && (
                    <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500 dark:text-neutral-400">
                      {repo.description}
                    </p>
                  )}
                </div>
                {repo.language && (
                  <span className="shrink-0 rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-black text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
                    {repo.language}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {editingProjectIndex !== null && (
        <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50/50 p-4 dark:border-violet-900/60 dark:bg-violet-950/20">
          <p className="mb-3 text-xs font-black uppercase tracking-wide text-violet-600 dark:text-violet-300">
            {editingProjectIndex === -1 ? "New Project" : "Edit Project"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["title", "Project title", "Portfolio Website"],
              ["subtitle", "Short description", "React app with animations"],
              ["tags", "Tags", "React, Tailwind, API"],
              ["url", "Project URL", "https://..."],
            ].map(([field, label, placeholder]) => (
              <label key={field}>
                <span className="mb-1.5 block text-xs font-black text-slate-500 dark:text-neutral-400">{label}</span>
                <input
                  value={projectForm[field]}
                  onChange={(event) => onProjectFormChange(field, event.target.value)}
                  placeholder={placeholder}
                  className={compactInputClassName}
                />
              </label>
            ))}
          </div>
          <div className="mt-3">
            <p className="mb-2 text-xs font-black text-slate-500 dark:text-neutral-400">Preview color</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROJECT_GRADIENTS.map((gradient) => (
                <button
                  key={gradient}
                  type="button"
                  onClick={() => onProjectFormChange("preview", gradient)}
                  className={`h-8 w-8 rounded-lg ${gradient} ${
                    projectForm.preview === gradient
                      ? "ring-2 ring-violet-600 ring-offset-2 dark:ring-violet-400 dark:ring-offset-neutral-900"
                      : ""
                  }`}
                  aria-label="Select project preview color"
                />
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={onResetProjectForm}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 dark:border-neutral-700 dark:text-neutral-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSaveProject}
              className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-black text-white dark:bg-violet-500"
            >
              {editingProjectIndex === -1 ? "Add Project" : "Update Project"}
            </button>
          </div>
        </div>
      )}

      {formData.projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/50 px-4 py-5 text-center text-sm font-bold text-slate-500 dark:border-violet-900/60 dark:bg-violet-950/20 dark:text-neutral-400">
          No projects yet.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {formData.projects.map((project, index) => (
            <div
              key={`${project.title}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className={`h-10 w-10 shrink-0 rounded-lg ${project.preview}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-[#111331] dark:text-white">{project.title}</p>
                <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-neutral-400">
                  {project.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEditProject(index)}
                className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-black text-slate-600 hover:border-violet-300 hover:text-violet-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-violet-300"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDeleteProject(index)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 dark:border-neutral-700 dark:text-neutral-500 dark:hover:text-red-400"
                aria-label="Delete project"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfileForm({
  mode = "edit",
  onboardingStep = 1,
  formData,
  onChange,
  user,
  fileInputRef,
  savingAvatar,
  onAvatarChange,
  fetchingProfile = {},
  onFetchCodingProfile,
  formatNumber = (value) => new Intl.NumberFormat("en-US").format(value || 0),
  projectForm,
  onProjectFormChange,
  editingProjectIndex,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onSaveProject,
  onResetProjectForm,
  onImportFromGitHub,
  importingRepos = false,
  githubRepos = [],
  onSelectRepo,
}) {
  return (
    <div className="overflow-y-auto px-6 py-5">
      {mode === "onboarding" && onboardingStep === 1 && (
        <BasicFields formData={formData} onChange={onChange} mode={mode} />
      )}

      {mode === "onboarding" && onboardingStep === 2 && (
        <OnboardingStep2Fields
          formData={formData}
          onChange={onChange}
          user={user}
          fileInputRef={fileInputRef}
          savingAvatar={savingAvatar}
          onAvatarChange={onAvatarChange}
        />
      )}

      {mode === "edit" && <BasicFields formData={formData} onChange={onChange} mode={mode} />}

      {mode === "edit" && (
        <>
          <CodingProfilesSection
            formData={formData}
            onChange={onChange}
            fetchingProfile={fetchingProfile}
            onFetchCodingProfile={onFetchCodingProfile}
            formatNumber={formatNumber}
          />
          <ProjectsSection
            formData={formData}
            projectForm={projectForm}
            onProjectFormChange={onProjectFormChange}
            editingProjectIndex={editingProjectIndex}
            onAddProject={onAddProject}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
            onSaveProject={onSaveProject}
            onResetProjectForm={onResetProjectForm}
            onImportFromGitHub={onImportFromGitHub}
            importingRepos={importingRepos}
            githubRepos={githubRepos}
            onSelectRepo={onSelectRepo}
          />
        </>
      )}
    </div>
  );
}
