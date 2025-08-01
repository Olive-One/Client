import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import oliveoneLogo from "@/assets/oliveone-logo-light.svg";
import { useLogin } from "@/hooks/useAuthentication";
import { navbarRoutesMap } from "@/constants/navbarRoutesMap";
import { RoutePaths } from "@/constants/routePaths.constants";
import { UserStatus } from "@/types/auth.types";
import type { LoginData } from "@/types/auth.types";
import useStateStore from '@/store/store-index';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mutate: login } = useLogin();
  const { setLoginExpiredState } = useStateStore();

  const onSubmit = (data: LoginData) => {
    setLoading(true);
    
    const payload = {
      email: data.email,
      password: data.password,
    };

    login(payload, {
      onSuccess: ({ data }) => {
        setLoading(false);
        setLoginExpiredState(false);
        
        if (data?.status === UserStatus.TEMPORARY) {
          navigate(RoutePaths.CHANGE_TEMP_PASSWORD, { replace: true });
        } else if (data?.accessToken) {
          const { config } = data;
          const landingPageMenuType = config?.menu?.[0]?.type;
          const landingPath = landingPageMenuType
            ? navbarRoutesMap[landingPageMenuType]?.path
            : RoutePaths.DASHBOARD;
          navigate(landingPath, { replace: true });
        } else {
          // Default to dashboard if no specific landing page
          navigate(RoutePaths.DASHBOARD, { replace: true });
        }
      },
      onError: () => {
        setLoading(false);
        // You can add error handling here (show toast, etc.)
        console.error('Login failed');
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center ">
            <img src={oliveoneLogo} alt="OliveOne Logo" className="w-100 h-50" />
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 dark-card-border bg-card/95 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-primary text-2xl font-bold">Welcome back!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access OliveOne
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="pastor@yourchurch.com"
                  className="border-border focus:border-primary focus:ring-primary"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  className="border-border focus:border-primary focus:ring-primary"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-foreground">Remember me</Label>
                </div>
                <a href="#" className="text-primary hover:text-primary/80 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
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
}