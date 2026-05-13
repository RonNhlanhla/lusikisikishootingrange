'use client'

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Id } from '@/convex/_generated/dataModel';

// Define the Job type based on our schema
type Job = {
  _id: Id<'jobs'>;
  _creationTime: number;
  job_title: string;
  job_description: string;
  job_location: string;
  price: number;
  user: Id<'users'>;
  status: 'active' | 'filled' | 'cancelled';
  created_at?: number;
  updated_at?: number;
};

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const job = useQuery(api.myFunctions.getJobById, { jobId: params.jobId as Id<"jobs"> }) as Job | null;
  const updateJob = useMutation(api.myFunctions.updateJob);
  
  interface JobFormData {
    job_title: string;
    job_description: string;
    price: string;
    job_location: string;
    status: 'active' | 'filled' | 'cancelled';
  }

  const [formData, setFormData] = useState<JobFormData>({
    job_title: '',
    job_description: '',
    price: '',
    job_location: '',
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set form data when job is loaded
  useEffect(() => {
    if (job) {
      setFormData({
        job_title: job.job_title || '',
        job_description: job.job_description || '',
        price: job.price ? job.price.toString() : '',
        job_location: job.job_location || '',
        status: job.status || 'active'
      });
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? value.replace(/[^0-9.]/g, '') : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    
    setIsSubmitting(true);
    try {
      await updateJob({
        id: job._id,
        ...formData,
        price: parseFloat(formData.price) || 0
      });
      router.push('/watchlist');
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <main className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Job Posting</h1>
          
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
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
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
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="active">Active</option>
                <option value="filled">Filled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
