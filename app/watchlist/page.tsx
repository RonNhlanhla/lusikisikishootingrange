'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Star, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useConvexAuth } from 'convex/react';


export default function Watchlist() {
  const router = useRouter();
  const user = useQuery(api.myFunctions.getUserinfo);
  const createJob = useMutation(api.myFunctions.createJob);
  const jobs = useQuery(api.myFunctions.getJobsByUser) || [];
  const otherJobs = useQuery(api.myFunctions.getJobsUsers) || [];
  const { isAuthenticated, isLoading } = useConvexAuth();
  


  const handleEditJob = (jobId: string) => {
    router.push(`/watchlist/${jobId}`);
  };
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'No date';
    try {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };
  const [formData, setFormData] = useState({
    job_title: '',
    job_description: '',
    price: '',
    job_location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingJob, setEditingJob] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      if (!isAuthenticated) {
        throw new Error('User must be logged in to post a job');
      }
      await createJob({
        job_title: formData.job_title,
        job_description: formData.job_description,
        price: parseFloat(formData.price),
        job_location: formData.job_location,
      });
      setSuccess(true);
      // Reset form
      setFormData({
        job_title: '',
        job_description: '',
        price: '',
        job_location: ''
      });
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <main className="max-w-4xl mx-auto px-4">

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Welcome to Mode Security Watchlist, {user?.username || 'User'}!
          </h1>

          {/* Watchlist Information */}
          <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mode Security Watchlist</h2>
            <p className="text-gray-700 mb-4">
              Our Watchlist is a specialized job matching platform that connects top security employers with highly trained Mode Security students who are ready to excel in the field.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <Star className="h-5 w-5 text-green mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-semibold">For Employers:</span> Access a pool of pre-screened, professionally trained security personnel who have completed our rigorous training programs.
                </p>
              </div>
              <div className="flex items-start">
                <Star className="h-5 w-5 text-green mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-semibold">For Our Students:</span> Get discovered by top employers looking for skilled security professionals with verified training and certifications.
                </p>
              </div>
              <div className="flex items-start">
                <Star className="h-5 w-5 text-green mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-semibold">Quality Assurance:</span> Every candidate has been thoroughly vetted and trained in accordance with industry standards and best practices.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-24">Email:</span>
              <span>{user?.email || 'Not provided'}</span>
            </div>

            <div className="mt-12">
              {/* User's Posted Jobs */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Posted Jobs</h2>
              {jobs.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">You haven't posted any jobs yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{job.job_title}</h3>
                          <p className="text-gray-600 mt-1">{job.job_description}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span>{job.job_location}</span>
                            <span className="mx-2">•</span>
                            <span>R{job.price.toFixed(2)}</span>
                            <span className="mx-2">•</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${job.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : job.status === 'filled'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            Posted on {job.created_at ? new Date(job.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }) : 'No date'}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditJob(job._id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600"
                            title="Edit job"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-red-500"
                            title="Delete job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Add more profile information here as needed */}
            {/* Job Posting Form */}
            <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Post a New Job</h2>
              {success && (
                <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
                  Job posted successfully!
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="job_title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Security Officer, Event Security, etc."
                  />
                </div>

                <div>
                  <label htmlFor="job_description" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    id="job_description"
                    name="job_description"
                    value={formData.job_description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Provide details about the job responsibilities, requirements, and any other relevant information."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate (ZAR) *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">R</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                        className="pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="job_location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="job_location"
                      name="job_location"
                      value={formData.job_location}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Johannesburg, Cape Town, etc."
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Posting Job...' : 'Post Job'}
                  </Button>
                </div>
              </form>
            </div>
            {/* Jobs from Other Users */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Jobs from Other Users</h2>
              {otherJobs.length === 0 ? (
                <p className="text-gray-600">No jobs from other users are currently available.</p>
              ) : (
                <div className="space-y-4">
                  {otherJobs.map((job) => (
                    <div key={job._id} className="p-4 bg-white rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{job.job_title}</h3>
                          <p className="text-gray-600">Location: {job.job_location}</p>
                          <p className="text-gray-600">Price: R{job.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Posted: {formatDate(job.created_at)}</p>
                        </div>
                        <div className="flex items-center justify-end">
                          <a href={`mailto:${job.user}`} className="text-green-600 hover:text-green-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
