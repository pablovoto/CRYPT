import axios from 'axios';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


const schema = yup.object().shape({
  username: yup.string().required().max(30),
  email: yup.string().required().email(),
  password: yup.string().required().min(8).max(20).matches(/(?=.*[0-9])(?=.*[A-Z])/),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  userType: yup.string().required(),
  first_name: yup.string().required(), // Add this line
  last_name: yup.string().required() // Add this line
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/register/', {
        username: data.username,
        password: data.password,
        email: data.email,
        first_name: data.first_name, // Add this line
        last_name: data.last_name, // Add this line
        user_type: 'student' // default user type
      });

      if (response.status === 200) {
        // Handle successful registration here
        console.log('User created, verification email sent');
      }
    } catch (error) {
      console.log('Registration failed');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <label>
          Username:
          <input type="text" {...register('username')} />
          {errors.username && <p>{errors.username.message}</p>}
        </label>
        <label>
          Email:
          <input type="email" {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </label>
        <label>
        First Name:
        <input type="text" {...register('first_name')} />
        {errors.first_name && <p>{errors.first_name.message}</p>}
      </label>
      <label>
        Last Name:
        <input type="text" {...register('last_name')} />
        {errors.last_name && <p>{errors.last_name.message}</p>}
      </label>
        <label>
          Password:
          <input type="password" {...register('password')} />
          {errors.password && <p>{errors.password.message}</p>}
        </label>
        <label>
          Confirm Password:
          <input type="password" {...register('passwordConfirmation')} />
          {errors.passwordConfirmation && <p>{errors.passwordConfirmation.message}</p>}
        </label>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Click here</Link> to log in.</p>
    </div>
  );
};

export default Register;