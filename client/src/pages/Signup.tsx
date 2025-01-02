import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Logo from '../components/common/Logo';
import Spinner from '../components/common/Spinner';
import InputField from '../components/layout/InputField';

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  internal?: string;
};

const SignUp = () => {
  const [Loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const eventContext = e.currentTarget;
    const formData = new FormData(eventContext);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const newErrors: FormErrors = {};
    if (!data.name) newErrors.name = 'Name is required';
    if (!data.email) newErrors.email = 'Email is required';
    if (data.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (data.password !== data.confirmPassword || !data.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length != 0) {
      eventContext.reset();
      setErrors((prev) => ({ ...prev, ...newErrors }));
      setLoading(false);
      return;
    }
    try {
      await axios.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch {
      setErrors((prev) => ({ ...prev, email: 'This Email is Already Registered. Please Sign In' }));
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
          Welcome to JPG Store!
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} method="POST" className="space-y-3">
          <InputField
            label="Name"
            id="name"
            name="name"
            type="text"
            placeholder="Violet Evergarden"
            autoComplete="username"
            error={errors.name}
            onChange={onInputChange}
          />

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

          <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            error={errors.password}
            onChange={onInputChange}
          />

          <InputField
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword}
            onChange={onInputChange}
          />

          <div>
            <button
              type="submit"
              disabled={Loading}
              className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-70"
            >
              {Loading ? (
                <>
                  <Spinner className="inline w-5 h-5 mr-2 fill-primary-300" /> Processing...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an Account?{' '}
          <Link to={'/login'} className="font-semibold text-primary-600 hover:text-primary-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
