import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = { name: '', email: '', password: '' };
  const validationSchema = Yup.object({
    name: Yup.string().min(2, 'Too short').max(50, 'Too long').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const res = await api.post('/users/register', values);
            const { token, data } = res.data;
            localStorage.setItem('token', token);
            dispatch(login({ user: data, token }));
            navigate('/');
          } catch (err) {
            setStatus(err.response?.data?.message || 'Server error');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="max-w-md">
            <div className="mb-4">
              <label className="block mb-1">Name</label>
              <Field name="name" className="w-full p-2 border" />
              <div className="text-red-600"><ErrorMessage name="name" /></div>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <Field name="email" type="email" className="w-full p-2 border" />
              <div className="text-red-600"><ErrorMessage name="email" /></div>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Password</label>
              <Field name="password" type="password" className="w-full p-2 border" />
              <div className="text-red-600"><ErrorMessage name="password" /></div>
            </div>

            {status && <div className="mb-4 text-red-600">{status}</div>}

            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white p-2 rounded">
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
