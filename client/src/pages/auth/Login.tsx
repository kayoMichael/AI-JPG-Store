import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Logo from '../../components/common/Logo';
import Spinner from '../../components/common/Spinner';
import InputField from '../../components/layout/InputField';
import { useAuth } from '../../context/AuthContext';

import { Button } from '@/components/ui/button';

type FormErrors = {
  email?: string;
  password?: string;
  internal?: string;
};

const Login = () => {
  const [Loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const setAuth = useAuth((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const eventContext = e.currentTarget;
    const formData = new FormData(eventContext);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const newErrors: FormErrors = {};
    if (!data.email) newErrors.email = 'Email is required';
    if (!data.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length != 0) {
      eventContext.reset();
      setErrors((prev) => ({ ...prev, ...newErrors }));
      setLoading(false);
      return;
    }

    try {
      const authentication = await axios.post('/auth/signin', {
        email: data.email,
        password: data.password,
      });
      setAuth(authentication.data);
      navigate('/', { replace: true });
    } catch {
      setErrors((prev) => ({
        ...prev,
        email: 'Invalid email or password',
        password: 'Invalid email or password',
      }));
    } finally {
      eventContext.reset();
      setLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-16">
        <Logo className="h-16 w-16 mx-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} method="POST" className="space-y-3">
          <InputField
            label="Email address"
            id="email"
            name="email"
            type="email"
            placeholder="username@example.com"
            autoComplete="email"
            error={errors.email}
            onChange={onInputChange}
          />

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <InputField
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                error={errors.password}
                onChange={onInputChange}
              />
            </div>
          </div>

          {errors.internal && (
            <div className="text-sm text-red-600 text-center">{errors.internal}</div>
          )}

          <div>
            <Button
              type="submit"
              disabled={Loading}
              className="flex w-full justify-center rounded-md bg-primary"
            >
              {Loading ? (
                <>
                  <Spinner className="inline w-5 h-5 mr-2 fill-primary-300" /> Processing...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Don&apos;t have an Account?{' '}
          <Link to={'/signup'} className="font-semibold text-primary-600 hover:text-primary-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
