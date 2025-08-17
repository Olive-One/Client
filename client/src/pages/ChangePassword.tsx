import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChangeTempPasswordData } from '@/types/changePassword.types';
import { useForm } from 'react-hook-form';
import ChangePasswordForm from '@/components/ChangePassword/ChangePasswordForm';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/constants/routePaths.constants';
import { useChangeTempPassword } from '@/hooks/useUsers';
import oliveoneLogo from "@/assets/oliveone-logo-light.svg";

const ChangePassword: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mutate } = useChangeTempPassword();
  
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangeTempPasswordData>();

  const onSubmit = (data: ChangeTempPasswordData) => {
    setLoading(true);
    const payload = {
      email: data.email,
      password: localStorage.getItem('password') || '',
      newPassword: data.newPassword,
    };
    
    mutate(payload, {
      onSuccess: () => {
        setLoading(false);
        // Clear stored temporary password
        localStorage.removeItem('password');
        localStorage.removeItem('email');
        navigate(RoutePaths.LOGIN);
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  const storedEmail = localStorage.getItem('email') || '';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center ">
            <img src={oliveoneLogo} alt="OliveOne Logo" className="w-100 h-50" />
          </div>
        </div>

        {/* Change Password Card */}
        <Card className="shadow-2xl border-0 dark-card-border bg-card/95 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-primary text-2xl font-bold">Change Your Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please set a new password for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <ChangePasswordForm
                email={storedEmail}
                control={control}
                register={register}
                errors={errors}
                isLoading={isLoading}
                watch={watch}
              />
            </form>
            
            <div className="text-center text-sm text-primary">
              Need help? <a href="#" className="hover:underline">Contact support</a>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-muted-foreground text-xs">
          <p>&copy; 2024 OliveOne Church Management. All rights reserved.</p>
          <p className="mt-1">Serving churches with faith and technology.</p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;