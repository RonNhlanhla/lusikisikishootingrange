'use client'

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Award, ShieldAlert, ArrowLeft, Loader2, Check, X, RefreshCw, Upload, FileText, Trash2, Download } from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

export default function AdminDashboard() {
  const currentUser = useQuery(api.myFunctions.getUserinfo);
  const users = useQuery(api.users.getUsersForAdmin);
  const bookings = useQuery(api.users.getAllBookingsForAdmin);
  const registrations = useQuery(api.users.getAllRegistrationsForAdmin);

  const updateUserRole = useMutation(api.users.updateUserRole);
  const updateBookingStatus = useMutation(api.users.updateBookingStatus);
  const updateRegistrationStatus = useMutation(api.users.updateRegistrationStatus);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateRegistrationPdf = useMutation(api.users.updateRegistrationPdf);

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // 1. Loading state
  if (currentUser === undefined) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-green" />
        <p className="text-gray-500 font-medium">Checking authorization...</p>
      </div>
    );
  }

  // 2. Authorization check
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="mx-auto my-12 max-w-md text-center">
        <Card className="border-red-200 bg-red-50/50 shadow-lg">
          <CardHeader className="flex flex-col items-center space-y-2">
            <ShieldAlert className="h-16 w-16 text-red-600 animate-pulse" />
            <CardTitle className="text-2xl font-bold text-red-800">Access Denied</CardTitle>
            <CardDescription className="text-red-600">
              You do not have administrative privileges to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex justify-center">
            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                <ArrowLeft size={16} /> Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Action helpers
  const handleRoleChange = async (userId: Id<"users">, newRole: string) => {
    const key = `role-${userId}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    try {
      await updateUserRole({ userId, role: newRole });
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Error updating role");
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleBookingStatusChange = async (bookingId: Id<"bookings">, newStatus: string) => {
    const key = `booking-${bookingId}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    try {
      await updateBookingStatus({ bookingId, status: newStatus });
    } catch (err) {
      console.error("Failed to update booking status:", err);
      alert("Error updating booking status");
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleRegistrationStatusChange = async (registrationId: Id<"registrations">, newStatus: "pending" | "completed" | "cancelled") => {
    const key = `reg-${registrationId}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    try {
      await updateRegistrationStatus({ registrationId, status: newStatus });
    } catch (err) {
      console.error("Failed to update registration status:", err);
      alert("Error updating registration status");
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleUploadPdf = async (registrationId: Id<"registrations">, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const key = `pdf-${registrationId}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));

    try {
      // 1. Get upload URL
      const postUrl = await generateUploadUrl();
      
      // 2. Upload file to Convex storage
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Failed to upload file to Convex storage");
      }

      const { storageId } = await result.json();

      // 3. Save to database
      await updateRegistrationPdf({
        registrationId,
        pdfStorageId: storageId,
        pdfName: file.name,
      });

      alert("PDF uploaded successfully!");
    } catch (err) {
      console.error("PDF upload error:", err);
      alert("Failed to upload PDF");
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleRemovePdf = async (registrationId: Id<"registrations">) => {
    if (!confirm("Are you sure you want to remove the PDF?")) return;

    const key = `pdf-${registrationId}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));

    try {
      await updateRegistrationPdf({
        registrationId,
        pdfStorageId: undefined,
        pdfName: undefined,
      });
      alert("PDF removed successfully!");
    } catch (err) {
      console.error("PDF remove error:", err);
      alert("Failed to remove PDF");
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  // Stats calculations
  const totalUsers = users?.length ?? 0;
  const adminUsers = users?.filter(u => u.role === "admin").length ?? 0;
  const pendingBookings = bookings?.filter(b => b.status === "pending").length ?? 0;
  const completedBookings = bookings?.filter(b => b.status === "approved" || b.status === "completed").length ?? 0;
  const pendingRegs = registrations?.filter(r => r.status === "pending").length ?? 0;
  const completedRegs = registrations?.filter(r => r.status === "completed").length ?? 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-green via-[#ebc378]/90 to-green p-6 md:p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <Badge className="bg-white/25 text-white hover:bg-white/30 border-none px-3 py-1 font-semibold text-xs tracking-wider">
            SYSTEM CONTROL
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Admin Control Panel</h1>
          <p className="text-white/80 max-w-2xl text-sm md:text-base">
            Moderator tools to manage system accounts, training course registrations, and range shoot bookings.
          </p>
        </div>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription className="text-left">Total Accounts</CardDescription>
              <CardTitle className="text-left text-3xl font-black text-slate-800">{totalUsers}</CardTitle>
            </div>
            <Users className="h-10 w-10 text-green bg-green/10 p-2 rounded-xl" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-green">{adminUsers}</span> Administrator profiles linked.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription className="text-left">Range Bookings</CardDescription>
              <CardTitle className="text-left text-3xl font-black text-slate-800">{bookings?.length ?? 0}</CardTitle>
            </div>
            <Calendar className="h-10 w-10 text-red-500 bg-red-50 p-2 rounded-xl" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-red-500">{pendingBookings}</span> bookings awaiting approval.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription className="text-left">Course Registrations</CardDescription>
              <CardTitle className="text-left text-3xl font-black text-slate-800">{registrations?.length ?? 0}</CardTitle>
            </div>
            <Award className="h-10 w-10 text-[#ebc378] bg-yellow-50 p-2 rounded-xl" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-yellow-600">{pendingRegs}</span> registrations pending checkouts.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabbed Sections */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl mb-8 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="users" className="font-bold py-2 rounded-lg transition-all duration-200">
            Accounts
          </TabsTrigger>
          <TabsTrigger value="bookings" className="font-bold py-2 rounded-lg transition-all duration-200">
            Bookings
          </TabsTrigger>
          <TabsTrigger value="registrations" className="font-bold py-2 rounded-lg transition-all duration-200">
            Registrations
          </TabsTrigger>
          <TabsTrigger value="completed" className="font-bold py-2 rounded-lg transition-all duration-200">
            Completed
          </TabsTrigger>
        </TabsList>

        {/* --- USERS PANEL --- */}
        <TabsContent value="users" className="space-y-4 outline-none">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg text-left text-slate-800">User Roles & Access Control</CardTitle>
              <CardDescription className="text-left">
                Manage roles to grant administrative access. Note: admins can view bookings, registrations, and edit roles.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {!users ? (
                <div className="p-8 text-center text-slate-500 flex justify-center items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-green" /> Loading users...
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">Name / Username</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Current Role</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {users.map(u => {
                      const isCurrentUser = u._id === currentUser._id;
                      const loadingKey = `role-${u._id}`;
                      return (
                        <tr key={u._id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-slate-900">
                            {u.name || u.username || <span className="text-slate-400 italic">Unnamed User</span>}
                            {isCurrentUser && (
                              <Badge className="ml-2 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50">
                                You
                              </Badge>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{u.email || "N/A"}</td>
                          <td className="py-3.5 px-4">
                            <Badge className={
                              u.role === "admin"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : u.role === "learner"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                            }>
                              {u.role}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <select
                                disabled={isCurrentUser || loadingStates[loadingKey]}
                                value={u.role}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                className="text-xs font-medium rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green focus:border-green disabled:opacity-50"
                              >
                                <option value="user">User</option>
                                <option value="learner">Learner</option>
                                <option value="admin">Admin</option>
                              </select>
                              {loadingStates[loadingKey] && (
                                <Loader2 className="h-4 w-4 animate-spin text-green mt-2" />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- BOOKINGS PANEL --- */}
        <TabsContent value="bookings" className="space-y-4 outline-none">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg text-left text-slate-800">Range Bookings Management</CardTitle>
              <CardDescription className="text-left">
                Moderate shoot appointments booked by members. Use actions to approve or cancel range reservations.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {!bookings ? (
                <div className="p-8 text-center text-slate-500 flex justify-center items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-red-500" /> Loading bookings...
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No range bookings found.</div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">User Email</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Types Selected</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {bookings.map(b => {
                      const loadingKey = `booking-${b._id}`;
                      const formattedDate = new Date(b.date).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });
                      return (
                        <tr key={b._id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-slate-900">{b.userEmail}</td>
                          <td className="py-3.5 px-4 text-slate-600">{formattedDate}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {b.types.map(t => (
                                <Badge key={t} variant="outline" className="text-xs bg-slate-50">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge className={
                              b.status === "approved" || b.status === "completed"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : b.status === "cancelled"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }>
                              {b.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              {b.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    disabled={loadingStates[loadingKey]}
                                    onClick={() => handleBookingStatusChange(b._id, "approved")}
                                    className="bg-green hover:bg-green-600 text-white h-7 px-2 text-xs flex items-center gap-1"
                                  >
                                    <Check size={12} /> Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    disabled={loadingStates[loadingKey]}
                                    onClick={() => handleBookingStatusChange(b._id, "cancelled")}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 h-7 px-2 text-xs flex items-center gap-1"
                                  >
                                    <X size={12} /> Cancel
                                  </Button>
                                </>
                              )}
                              {b.status !== "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={loadingStates[loadingKey]}
                                  onClick={() => handleBookingStatusChange(b._id, "pending")}
                                  className="h-7 px-2 text-xs text-slate-500 flex items-center gap-1"
                                >
                                  <RefreshCw size={12} /> Reset
                                </Button>
                              )}
                              {loadingStates[loadingKey] && (
                                <Loader2 className="h-4 w-4 animate-spin text-green mt-1" />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- REGISTRATIONS PANEL --- */}
        <TabsContent value="registrations" className="space-y-4 outline-none">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg text-left text-slate-800">Course Registrations</CardTitle>
              <CardDescription className="text-left">
                Monitor security and firearm courses booked online. Update checkouts to complete once paid/received.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {!registrations ? (
                <div className="p-8 text-center text-slate-500 flex justify-center items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-yellow-600" /> Loading registrations...
                </div>
              ) : registrations.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No registrations found.</div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Course Name</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {registrations.map(r => {
                      const loadingKey = `reg-${r._id}`;
                      return (
                        <tr key={r._id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-slate-900">
                            <div>{r.userName}</div>
                            <div className="text-xs text-slate-500">{r.userEmail}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{r.courseName}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">
                            R{r.amount.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge className={
                              r.status === "completed"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : r.status === "cancelled"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }>
                              {r.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              {r.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    disabled={loadingStates[loadingKey]}
                                    onClick={() => handleRegistrationStatusChange(r._id, "completed")}
                                    className="bg-green hover:bg-green-600 text-white h-7 px-2 text-xs flex items-center gap-1"
                                  >
                                    <Check size={12} /> Complete
                                  </Button>
                                  <Button
                                    size="sm"
                                    disabled={loadingStates[loadingKey]}
                                    onClick={() => handleRegistrationStatusChange(r._id, "cancelled")}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 h-7 px-2 text-xs flex items-center gap-1"
                                  >
                                    <X size={12} /> Cancel
                                  </Button>
                                </>
                              )}
                              {r.status !== "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={loadingStates[loadingKey]}
                                  onClick={() => handleRegistrationStatusChange(r._id, "pending")}
                                  className="h-7 px-2 text-xs text-slate-500 flex items-center gap-1"
                                >
                                  <RefreshCw size={12} /> Reset
                                </Button>
                              )}
                              {loadingStates[loadingKey] && (
                                <Loader2 className="h-4 w-4 animate-spin text-green mt-1" />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- COMPLETED PANEL --- */}
        <TabsContent value="completed" className="space-y-4 outline-none">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg text-left text-slate-800">Completed Courses</CardTitle>
              <CardDescription className="text-left">
                View all course registrations that have been completed.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {!registrations ? (
                <div className="p-8 text-center text-slate-500 flex justify-center items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-green" /> Loading completed courses...
                </div>
              ) : registrations.filter(r => r.status === "completed").length === 0 ? (
                <div className="p-8 text-center text-slate-500">No completed courses found.</div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Course Name</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Date Completed</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Certificate PDF</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {registrations
                      .filter(r => r.status === "completed")
                      .map(r => {
                        const loadingKey = `reg-${r._id}`;
                        const formattedDate = new Date(r.registeredAt).toLocaleDateString("en-ZA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        });
                        return (
                          <tr key={r._id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-3.5 px-4 font-medium text-slate-900">
                              <div>{r.userName}</div>
                              <div className="text-xs text-slate-500">{r.userEmail}</div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">{r.courseName}</td>
                            <td className="py-3.5 px-4 font-semibold text-slate-700">
                              R{r.amount.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">{formattedDate}</td>
                            <td className="py-3.5 px-4">
                              <Badge className="bg-green-50 text-green-700 border-green-200">
                                {r.status}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4">
                              {r.pdfUrl ? (
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <a
                                      href={r.pdfUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                                    >
                                      <FileText size={14} />
                                      <span className="max-w-[120px] truncate">{r.pdfName || "certificate.pdf"}</span>
                                    </a>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      disabled={loadingStates[`pdf-${r._id}`]}
                                      onClick={() => handleRemovePdf(r._id)}
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 size={12} />
                                    </Button>
                                  </div>
                                  <div>
                                    <Badge className={r.downloadFeePaid ? "bg-green-50 text-green-700 text-[10px] border-green-200" : "bg-yellow-50 text-yellow-700 text-[10px] border-yellow-200"}>
                                      {r.downloadFeePaid ? "Download Fee Paid" : "Download Fee Unpaid"}
                                    </Badge>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    id={`pdf-file-${r._id}`}
                                    className="hidden"
                                    onChange={(e) => handleUploadPdf(r._id, e)}
                                    disabled={loadingStates[`pdf-${r._id}`]}
                                  />
                                  <label
                                    htmlFor={`pdf-file-${r._id}`}
                                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded border border-dashed border-slate-300 hover:border-green hover:text-green cursor-pointer ${loadingStates[`pdf-${r._id}`] ? "opacity-50 pointer-events-none" : ""}`}
                                  >
                                    {loadingStates[`pdf-${r._id}`] ? (
                                      <>
                                        <Loader2 size={12} className="animate-spin" />
                                        <span>Uploading...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Upload size={12} />
                                        <span>Upload PDF</span>
                                      </>
                                    )}
                                  </label>
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={loadingStates[loadingKey]}
                                  onClick={() => handleRegistrationStatusChange(r._id, "pending")}
                                  className="h-7 px-2 text-xs text-slate-500 flex items-center gap-1"
                                >
                                  <RefreshCw size={12} /> Reset
                                </Button>
                                {loadingStates[loadingKey] && (
                                  <Loader2 className="h-4 w-4 animate-spin text-green mt-1" />
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
