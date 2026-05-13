'use client'
import { useState, useRef, useEffect } from 'react';
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { Button } from '@/components/ui/button';
import { Pencil, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Doc } from "@/convex/_generated/dataModel";

import { useConvexAuth } from 'convex/react';
type FirearmTrainingType = 'rifle' | 'handgun' | 'shotgun' | 'hunting rifle';

type FormData = {
  PSIRA_number: string;
  username: string;
  location: string;
  profile_bio: string;
  profile_picture: string;
  PSIRA_grade: string;
  firearm_training: FirearmTrainingType[];
  latitude?: number;
  longitude?: number;
};

export default function ProfilePage() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    location: '',
    profile_bio: '',
    profile_picture: '',
    PSIRA_number: '',
    PSIRA_grade: '',
    firearm_training: [],
    latitude: undefined,
    longitude: undefined,
  });

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null);

  const { isAuthenticated } = useConvexAuth();

  // Fetch profile document from Convex
  const profileDoc = useQuery(api.myFunctions.getUserinfo) as Doc<'users'> | null | undefined;
  // Set initial form data when user data is loaded
  useEffect(() => {
    if (profileDoc) {
      setFormData(prev => ({
        ...prev,
        username: profileDoc.username || '',
        location: profileDoc.location || '',
        profile_bio: profileDoc.profile_bio || '',
        profile_picture: profileDoc.profile_picture || '',
        PSIRA_number: profileDoc.PSIRA_number || '',
        PSIRA_grade: profileDoc.PSIRA_grade || '',
        firearm_training: profileDoc.firearm_training || [],
      }));
    }
  }, [profileDoc]);

  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
    // Focus the input field after a small delay to ensure it's rendered
    setTimeout(() => {
      usernameInputRef.current?.focus();
    }, 0);
  };

  const handleBioEdit = () => {
    setIsEditingBio(true);
    // Focus the textarea after a small delay to ensure it's rendered
    setTimeout(() => {
      bioTextareaRef.current?.focus();
    }, 0);
  };

  const userAdditionalInfo = useMutation(api.myFunctions.additionalUserInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const checkboxValue = (e.target as HTMLInputElement).value;

      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...(prev[name as keyof FormData] as string[] || []), checkboxValue]
          : (prev[name as keyof FormData] as string[] || []).filter(item => item !== checkboxValue)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      // Try to get the most specific location name available
      const address = data.address;
      return (
        address.neighbourhood ||
        address.suburb ||
        address.city_district ||
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        data.display_name.split(',')[0] ||
        'Unknown Location'
      );
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Location';
    }
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const locationName = await reverseGeocode(latitude, longitude);

      setFormData(prev => ({
        ...prev,
        latitude,
        longitude,
        location: locationName
      }));
    } catch (error: any) {
      let errorMessage = 'Unable to retrieve your location';
      if (error instanceof GeolocationPositionError) {
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied. Please enable it in your browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'The request to get your location timed out.';
        }
      } else {
        errorMessage = 'Error getting location. Please try again.';
      }
      setLocationError(errorMessage);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in to update your profile.');
      return;
    }
    try {
      await userAdditionalInfo({
        username: formData.username,
        location: formData.location,
        profile_bio: formData.profile_bio,
        profile_picture: formData.profile_picture,
        PSIRA_number: formData.PSIRA_number,
        PSIRA_grade: formData.PSIRA_grade,
        firearm_training: formData.firearm_training,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      const message = (error instanceof Error && error.message)
        ? error.message
        : typeof error === 'string'
          ? error
          : JSON.stringify(error);
      alert(`Failed to update profile: ${message}`);
    }
  };

  return (
    <>
      <AuthLoading>
        <p>Loading...</p>
      </AuthLoading>
      <Unauthenticated children={undefined}>

      </Unauthenticated>

      <div className="w-full flex flex-col items-center p-4 min-h-svh justify-start pt-8">
        <h1 className="my-6">Profile Page</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <Tabs defaultValue="personal information" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="personal information" className="text-sm whitespace-nowrap">Personal Info</TabsTrigger>
              <TabsTrigger value="PSIRA Grades" className="text-sm whitespace-nowrap">PSIRA Grades</TabsTrigger>
              <TabsTrigger value="Firearm Training" className="text-sm whitespace-nowrap">Firearm Training</TabsTrigger>
            </TabsList>
            <TabsContent value="personal information" className="w-full max-w-md space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    ref={usernameInputRef}
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={() => setIsEditingUsername(false)}
                    type="text"
                    placeholder="Enter your username"
                    className={`w-full p-2 pr-10 border rounded ${!isEditingUsername ? 'bg-gray-50' : 'bg-white'}`}
                    required
                    readOnly={!isEditingUsername}
                  />
                  {!isEditingUsername && (
                    <button
                      type="button"
                      onClick={handleUsernameEdit}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      aria-label="Edit username"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <div className="flex space-x-2">
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your location will appear here"
                    className="flex-1 p-2 border rounded"
                    readOnly
                  />
                  <Button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                    className="px-4 py-2 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 sm:w-0 sm:h-0 sm:opacity-0" />
                    <span className="hidden sm:inline">
                      {isLocating ? 'Locating...' : 'Get My Location'}
                    </span>
                    <span className="sm:hidden">
                      {isLocating ? '...' : ''}
                    </span>
                  </Button>
                </div>
                {locationError && (
                  <p className="mt-1 text-sm text-red-600">{locationError}</p>
                )}
                {/*           {formData.latitude !== null && formData.longitude !== null && (
                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                  <div>Lat: {formData.latitude.toFixed(4)}</div>
                  <div>Lng: {formData.longitude.toFixed(4)}</div>
                </div>
                )} */}
              </div>

              <div className="space-y-2">
                <label htmlFor="profile_bio" className="block text-sm font-medium text-gray-700">
                  Profile Bio
                </label>
                <div className="relative">
                  <textarea
                    id="profile_bio"
                    name="profile_bio"
                    ref={bioTextareaRef}
                    value={formData.profile_bio}
                    onChange={handleChange}
                    onBlur={() => setIsEditingBio(false)}
                    placeholder="Tell us about yourself..."
                    className={`w-full p-2 pr-10 border rounded min-h-[100px] ${!isEditingBio ? 'bg-gray-50' : 'bg-white'}`}
                    rows={4}
                    readOnly={!isEditingBio}
                  />
                  {!isEditingBio && (
                    <button
                      type="button"
                      onClick={handleBioEdit}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                      aria-label="Edit bio"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/*           <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
                disabled={isUploading}
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full bg-gold text-white"
              >
                {isUploading ? 'Uploading...' : 'Choose Profile Picture'}
              </Button>
              {formData.profile_picture && (
                <div className="mt-2">
            <img
              src={formData.profile_picture}
              alt="Profile preview"
              className="h-20 w-20 rounded-full object-cover"
            />
                </div>
              )}
            </div> */}


            </TabsContent>
            <TabsContent value="PSIRA Grades">
              {/* add a textbox input for PSIRA number */}
              <div className="space-y-2">
                <label htmlFor="PSIRA_number" className="block text-sm font-medium text-gray-700">
                  PSIRA Number
                </label>
                <input
                  id="PSIRA_number"
                  name="PSIRA_number"
                  type="text"
                  value={formData.PSIRA_number}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              {/* PSIRA Grade Selection */}
              <div className="w-full space-y-2">
                <p className="block text-sm font-medium text-gray-700 mb-2">PSIRA Grade</p>
                <div className="w-full space-y-2">
                  {['E', 'D', 'C', 'B', 'A'].map((grade) => (
                    <div key={grade} className="w-full flex items-center">
                      <input
                        id={`grade-${grade}`}
                        name="PSIRA_grade"
                        type="radio"
                        value={grade}
                        checked={formData.PSIRA_grade === grade}
                        onChange={handleChange}
                        className="h-4 w-4 text-green focus:ring-green border-gray-300"
                        required
                      />
                      <label htmlFor={`grade-${grade}`} className="ml-2 block text-sm text-gray-700">
                        Grade {grade}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="Firearm Training">
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700">Select all that apply:</p>
                <div className="space-y-2">
                  {(['rifle', 'handgun', 'shotgun', 'hunting rifle'] as FirearmTrainingType[]).map((training) => (
                    <div key={training} className="flex items-center">
                      <input
                        id={`firearm-${training}`}
                        name="firearm_training"
                        type="checkbox"
                        value={training}
                        checked={formData.firearm_training.includes(training)}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`firearm-${training}`} className="ml-2 block text-sm text-gray-700">
                        {training.charAt(0).toUpperCase() + training.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-center">
            <Button type="submit" disabled={!isAuthenticated} className="w-2/3 text-white py-2 px-4 rounded transition-colors mt-4">
              Save Profile
            </Button>
          </div>
        </form>
      </div>

    </>
  );
}