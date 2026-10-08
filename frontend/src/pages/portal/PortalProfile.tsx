import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, BookOpen, GraduationCap, Edit2, Save, X, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { studentService } from '../../services/studentService';
import type { Student } from '../../types';
import { formatDateShort } from '../../utils';

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  college: z.string().optional(),
  branch: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.string().optional(),
  skills: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function PortalProfile() {
  const { user, student: authStudent } = useAuth();
  const [studentData, setStudentData] = useState<Student | null>(authStudent || null);
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setIsLoading(true);
        const st = await studentService.getProfile();
        if (mounted) {
          setStudentData(st);
          setValue('firstName', st.user?.firstName || user?.firstName || '');
          setValue('lastName', st.user?.lastName || user?.lastName || '');
          setValue('phone', st.phone || st.user?.phone || user?.phone || '');
          setValue('college', st.college || '');
          setValue('branch', st.branch || '');
          setValue('degree', st.degree || '');
          setValue('graduationYear', st.graduationYear ? String(st.graduationYear) : '');
          setValue('skills', Array.isArray(st.skills) ? st.skills.join(', ') : (st.skills as any) || '');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [setValue, user]);

  const onSubmit = async (data: FormData) => {
    try {
      const updated = await studentService.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        college: data.college,
        branch: data.branch,
        degree: data.degree,
        graduationYear: data.graduationYear ? parseInt(data.graduationYear) : undefined,
        skills: data.skills as any,
      });
      setStudentData(updated);
      toast.success('Your student profile has been updated and saved! ✨');
      setEditing(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  const initials = `${user?.firstName?.[0] ?? 'S'}${user?.lastName?.[0] ?? 'T'}`;
  const effectiveStudent = studentData || authStudent;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <p className="text-sm font-medium text-brand-slate">Loading your student profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="heading-sm text-brand-dark">My Profile</h1>
        <p className="text-sm text-brand-slate mt-1">Manage your academic credentials and contact information.</p>
      </div>

      {/* Avatar Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-brand-gradient-light flex items-center justify-center shadow-md shrink-0">
            <span className="text-white font-black text-3xl">{initials}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-brand-dark">
              {effectiveStudent?.user?.firstName || user?.firstName} {effectiveStudent?.user?.lastName || user?.lastName}
            </h2>
            <p className="text-sm text-brand-blue font-mono font-semibold mt-0.5">
              {effectiveStudent?.studentId || 'STATS-STU-001'}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="badge-blue text-xs flex items-center gap-1">
                <Mail size={11} /> {user?.email}
              </span>
              {effectiveStudent?.branch && (
                <span className="badge-cyan text-xs flex items-center gap-1">
                  <BookOpen size={11} /> {effectiveStudent.branch}
                </span>
              )}
              {effectiveStudent?.college && (
                <span className="badge text-xs bg-slate-100 text-slate-700 flex items-center gap-1 border border-slate-200">
                  <GraduationCap size={11} /> {effectiveStudent.college}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => { setEditing(!editing); if (editing) reset(); }}
            className={`btn btn-sm shrink-0 self-start sm:self-center ${editing ? 'btn-ghost' : 'btn-secondary'}`}
          >
            {editing ? <><X size={14} /> Cancel</> : <><Edit2 size={14} /> Edit Profile</>}
          </button>
        </div>
      </motion.div>


      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h3 className="font-bold text-brand-dark mb-5 flex items-center gap-2">
          <User size={18} className="text-brand-blue" /> Personal Information
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input disabled={!editing} type="text" className={`form-input ${!editing ? 'bg-gray-50 cursor-default' : ''}`} {...register('firstName')} />
              {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input disabled={!editing} type="text" className={`form-input ${!editing ? 'bg-gray-50 cursor-default' : ''}`} {...register('lastName')} />
              {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input disabled type="email" value={user?.email || ''} className="form-input bg-gray-50 cursor-default" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support to update.</p>
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input disabled={!editing} type="tel" placeholder="+91 XXXXX XXXXX" className={`form-input ${!editing ? 'bg-gray-50 cursor-default' : ''}`} {...register('phone')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">College / University</label>
              <input disabled={!editing} type="text" placeholder="Your institution name" className={`form-input ${!editing ? 'bg-gray-50 cursor-default' : ''}`} {...register('college')} />
            </div>
            <div className="form-group">
              <label className="form-label">Branch / Stream</label>
              <input disabled={!editing} type="text" placeholder="e.g. Computer Science & Engineering" className={`form-input ${!editing ? 'bg-gray-50 cursor-default' : ''}`} {...register('branch')} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Degree Program</label>
              <input disabled={!editing} type="text" placeholder="e.g. B.Tech / Diploma / BCA" className={`form-input ${!editing ? 'bg-gray-50 cursor-default' : ''}`} {...register('degree')} />
            </div>
            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <input disabled={!editing} type="number" placeholder="e.g. 2027" className={`form-input ${!editing ? 'bg-gray-50 cursor-default' : ''}`} {...register('graduationYear')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Technical Skills & Stacks</label>
            <input disabled={!editing} type="text" placeholder="e.g. Java, Spring Boot, React, AutoCAD, Total Station" className={`form-input ${!editing ? 'bg-gray-50 cursor-default' : ''}`} {...register('skills')} />
          </div>
          {editing && (
            <button type="submit" disabled={isSubmitting} className="btn-primary btn-sm">
              {isSubmitting
                ? <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Saving...</span>
                : <span className="flex items-center gap-2"><Save size={14} /> Save Changes</span>}
            </button>
          )}
        </form>
      </motion.div>

      {/* Account Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
          <GraduationCap size={18} className="text-brand-blue" /> Account & Academic Record
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Student ID', value: effectiveStudent?.studentId || 'STATS-STU-001' },
            { label: 'Role', value: user?.role || 'STUDENT' },
            { label: 'Degree', value: effectiveStudent?.degree || 'B.Tech' },
            { label: 'Grad Year', value: effectiveStudent?.graduationYear ? String(effectiveStudent.graduationYear) : '2027' },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-brand-slate uppercase tracking-wider mb-1">{label}</p>
              <p className="text-xs font-bold text-brand-dark truncate">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

