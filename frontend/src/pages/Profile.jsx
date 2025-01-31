import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateName, updateEmail, updatePassword } from '../redux/slices/userSlice';
import Loader from '../components/Loader';
import Title from '../components/Title';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isUserLoading, error } = useSelector((state) => state.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const forms = [
    {
      onSubmit: (e) => {
        e.preventDefault();
        dispatch(updateName(name));
      },
      inputs: [
        {
          type: 'text',
          placeholder: 'Name',
          value: name,
          onChange: (e) => setName(e.target.value),
        },
      ],
      buttonText: 'Update Name',
    },
    {
      onSubmit: (e) => {
        e.preventDefault();
        dispatch(updateEmail(email));
      },
      inputs: [
        {
          type: 'email',
          placeholder: 'Email',
          value: email,
          onChange: (e) => setEmail(e.target.value),
        },
      ],
      buttonText: 'Update Email',
    },
    {
      onSubmit: (e) => {
        e.preventDefault();
        dispatch(updatePassword({ password, newPassword }));
      },
      inputs: [
        {
          type: 'password',
          placeholder: 'Current Password',
          value: password,
          onChange: (e) => setPassword(e.target.value),
        },
        {
          type: 'password',
          placeholder: 'New Password',
          value: newPassword,
          onChange: (e) => setNewPassword(e.target.value),
        },
      ],
      buttonText: 'Update Password',
    },
  ];

  if (isUserLoading) {
    return <Loader />;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="min-h-[95.5vh] flex justify-center items-center">
      <div className="bg-white p-8  w-[90%] sm:max-w-96">
        <div className="text-3xl mb-6 text-center">
          <Title text1="Profile" text2="Page" />
        </div>
        {forms.map((form, index) => (
          <form
            key={index}
            onSubmit={form.onSubmit}
            className="flex flex-col items-center gap-4 mb-6">
            {form.inputs.map((input, idx) => (
              <input
                key={idx}
                type={input.type}
                placeholder={input.placeholder}
                className="w-full p-2 border border-gray-300 focus:outline-none focus:border-mainColor"
                value={input.value}
                onChange={input.onChange}
                required
              />
            ))}
            <button
              className="w-full p-2 bg-mainColor text-white font-medium text-xl  futura"
              disabled={isUserLoading}>
              {isUserLoading ? 'Loading...' : form.buttonText}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
};

export default Profile;
