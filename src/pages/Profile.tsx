
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileActions } from '@/components/profile/ProfileActions';
import { useProfile } from '@/hooks/useProfile';

const Profile = () => {
  const { profile, setProfile, stats, loading, saving, saveProfile, fetchProfile } = useProfile();

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 pb-20 md:pb-6">
        <ProfileHeader />
        
        <ProfileForm profile={profile} onProfileChange={setProfile} />
        
        <ProfileStats stats={stats} />

        {/* Action Buttons */}
        <ProfileActions
          saving={saving}
          onSave={saveProfile}
          onCancel={fetchProfile}
        />
      </div>
    </AppLayout>
  );
};

export default Profile;
