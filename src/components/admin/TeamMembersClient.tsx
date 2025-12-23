"use client";

import { useState, useEffect, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { HiUserGroup, HiPlus, HiPencil, HiTrash, HiPhoto, HiXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from 'next-intl';

type TeamMember = {
    id: string;
    name: string;
    role: string | null;
    category: "committee" | "management" | "staff" | null;
    image_url: string | null;
    display_order: number | null;
    created_at: string;
};

export function TeamMembersClient() {
    const t = useTranslations();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<"committee" | "management" | "staff">("committee");

    // Form State
    const [formData, setFormData] = useState<{
        name: string;
        role: string;
        category: string;
        display_order: number;
        image: File | null;
        image_url: string;
    }>({
        name: "",
        role: "",
        category: "management",
        display_order: 0,
        image: null,
        image_url: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const { data, error } = await supabaseBrowser
                .from('team_members')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            role: "",
            category: activeTab, // Set default category to current active tab
            display_order: 0,
            image: null,
            image_url: "",
        });
        setEditingMember(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleOpenModal = (member?: TeamMember) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                role: member.role || "",
                category: member.category || "management",
                display_order: member.display_order || 0,
                image: null,
                image_url: member.image_url || "",
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.confirmDelete'))) return;

        try {
            const { error } = await supabaseBrowser
                .from('team_members')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchMembers();
        } catch (error) {
            console.error('Error deleting member:', error);
            alert(t('admin.errorDeleting'));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl = formData.image_url;

            // Handle Image Upload
            if (formData.image) {
                const file = formData.image;
                const uploadData = new FormData();
                uploadData.append('file', file);

                const response = await fetch('/api/admin/upload-team-photo', {
                    method: 'POST',
                    body: uploadData,
                });

                if (!response.ok) throw new Error('Failed to upload image');
                const result = await response.json();
                imageUrl = result.url;
            }

            const memberData = {
                name: formData.name,
                role: formData.role,
                category: formData.category,
                display_order: formData.display_order,
                image_url: imageUrl,
            };

            if (editingMember) {
                const { error } = await supabaseBrowser
                    .from('team_members')
                    .update(memberData)
                    .eq('id', editingMember.id);
                if (error) throw error;
            } else {
                const { error } = await supabaseBrowser
                    .from('team_members')
                    .insert([memberData]);
                if (error) throw error;
            }

            fetchMembers();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving member:', error);
            alert(t('admin.errorSaving'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        { id: 'committee', label: t('leaders.commissionCommittee') },
        { id: 'management', label: t('leaders.managementMembers') },
        { id: 'staff', label: t('leaders.workLeadership') },
    ];

    const filteredMembers = members.filter(m => m.category === activeTab);

    if (isLoading) return <div className="p-8 text-center">{t('common.loading')}</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('admin.teamMembers')}</h1>
                    <p className="text-slate-500">{t('admin.manageTeamMembers')}</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <HiPlus className="h-5 w-5" />
                    {t('admin.addMember')}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id as any)}
                        className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-all relative ${activeTab === cat.id
                            ? "text-blue-600 bg-blue-50/50 border-b-2 border-blue-600"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {filteredMembers.map((member) => (
                        <motion.div
                            key={member.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="relative h-24 w-24 mb-4 overflow-hidden rounded-full ring-4 ring-slate-50 shadow-inner bg-slate-100">
                                    {member.image_url ? (
                                        <Image
                                            src={member.image_url}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <HiUserGroup className="h-10 w-10 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-900 line-clamp-1 w-full" title={member.name}>{member.name}</h3>
                                <p className="text-sm text-blue-600 font-medium line-clamp-1 w-full mb-1" title={member.role || ""}>{member.role}</p>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    {t('admin.displayOrder')}: {member.display_order}
                                </span>
                            </div>

                            <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleOpenModal(member); }}
                                    className="p-2 bg-white/90 backdrop-blur text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full shadow-sm transition-colors border border-slate-100"
                                    title={t('admin.editMember')}
                                >
                                    <HiPencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(member.id); }}
                                    className="p-2 bg-white/90 backdrop-blur text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full shadow-sm transition-colors border border-slate-100"
                                    title={t('admin.confirmDelete')}
                                >
                                    <HiTrash className="h-4 w-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredMembers.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <HiUserGroup className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">No members found</h3>
                    <p className="text-slate-500">Add members to this category to see them here.</p>
                </div>
            )}


            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 p-6">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingMember ? t('admin.editMember') : t('admin.addMember')}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <HiXMark className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.name')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.role')}</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.category')}</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.displayOrder')}</label>
                                        <input
                                            type="number"
                                            value={formData.display_order}
                                            onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.photo')}</label>
                                    <div className="flex items-center gap-4">
                                        {(formData.image_url || formData.image) && (
                                            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                                                <Image
                                                    src={formData.image ? URL.createObjectURL(formData.image) : formData.image_url}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <label className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={e => {
                                                    if (e.target.files?.[0]) {
                                                        setFormData({ ...formData, image: e.target.files[0] });
                                                    }
                                                }}
                                            />
                                            {t('admin.choosePhoto')}
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isSubmitting ? t('admin.saving') : t('admin.save')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
