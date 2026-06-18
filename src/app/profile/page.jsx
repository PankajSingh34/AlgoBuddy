"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/user/UserContext";
import { supabase } from "@/lib/supabase";
import ProfileProgress from "@/app/components/ui/ProfileProgress";
import { Save, User as UserIcon, BookOpen, GraduationCap, Code, Link2, Github, Linkedin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser, loading } = useUser();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    cgpa: "",
    skills: "",
    resume_link: "",
    github_profile: "",
    linkedin_profile: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      const meta = user.user_metadata || {};
      setFormData({
        name: meta.name || "",
        branch: meta.branch || "",
        cgpa: meta.cgpa || "",
        skills: meta.skills || "",
        resume_link: meta.resume_link || "",
        github_profile: meta.github_profile || "",
        linkedin_profile: meta.linkedin_profile || ""
      });
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: formData
      });

      if (error) throw error;
      
      setUser(data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-12 px-4 sm:px-6 mt-[72px]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center text-sm font-medium text-surface-500 hover:text-surface-900 dark:hover:text-white transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Your Profile</h1>
            <p className="mt-1 text-surface-500">Manage your personal information and preferences.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <ProfileProgress />
            
            <div className="p-5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mb-4 overflow-hidden shadow-inner">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img 
                      src={user.user_metadata.avatar_url || user.user_metadata.picture} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    formData.name ? formData.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()
                  )}
                </div>
                <h3 className="font-semibold text-lg text-surface-900 dark:text-white">{formData.name || "Student"}</h3>
                <p className="text-sm text-surface-500 mb-4">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white border-b border-surface-200 dark:border-surface-800 pb-4">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center gap-2">
                      <UserIcon className="w-4 h-4" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-950 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Branch / Major
                    </label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science"
                      className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-950 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" /> CGPA
                    </label>
                    <input
                      type="text"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleChange}
                      placeholder="e.g. 8.5"
                      className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-950 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center gap-2">
                      <Code className="w-4 h-4" /> Skills
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g. React, Next.js, Node.js"
                      className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-950 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-surface-900 dark:text-white border-b border-surface-200 dark:border-surface-800 pb-4 mt-8">
                  Professional Links
                </h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center gap-2">
                      <Link2 className="w-4 h-4" /> Resume Link
                    </label>
                    <input
                      type="url"
                      name="resume_link"
                      value={formData.resume_link}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-950 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center gap-2">
                        <Github className="w-4 h-4" /> GitHub Profile
                      </label>
                      <input
                        type="url"
                        name="github_profile"
                        value={formData.github_profile}
                        onChange={handleChange}
                        placeholder="https://github.com/..."
                        className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-950 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center gap-2">
                        <Linkedin className="w-4 h-4" /> LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin_profile"
                        value={formData.linkedin_profile}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-950 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 md:px-8 py-5 bg-surface-50 dark:bg-surface-800/50 border-t border-surface-200 dark:border-surface-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-light text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-primary/20 disabled:opacity-70"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
