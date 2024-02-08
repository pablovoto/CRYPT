import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AxiosInstance from './Axios'; // replace with your Axios instance
import { useNavigate } from 'react-router-dom';

//this is the schema for the form
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
  passwordConfirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  email: yup.string().required('Email is required').email('Email is not valid'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
});

//this is the function that will be called when the form is submitted
const Register = () => {
  const history = useNavigate();
  const { register,handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    console.log('Register component mounted');
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log("Form submitted", data);
      const studentResponse = await AxiosInstance.post('users/', {
        username: data.username,
        password: data.password,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        is_active: true,
        is_staff: false,
        is_professor: false,
      });

      if (studentResponse.status === 201) {
        console.log('Student and user created successfully');
        history.push('/home'); // Redirect to home page
      } else {
        console.log(studentResponse.data.detail);
      }
    } catch (error) {
      console.log('An error occurred:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} placeholder="Username" />
      {errors.username && <p>{errors.username.message}</p>}

      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <p>{errors.password.message}</p>}

      <input {...register('passwordConfirmation')} type="password" placeholder="Confirm Password" />
      {errors.passwordConfirmation && <p>{errors.passwordConfirmation.message}</p>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register('first_name')} placeholder="First Name" />
      {errors.first_name && <p>{errors.first_name.message}</p>}

      <input {...register('last_name')} placeholder="Last Name" />
      {errors.last_name && <p>{errors.last_name.message}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;