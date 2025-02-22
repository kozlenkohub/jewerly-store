import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, ConfigProvider } from 'antd';
import { UserOutlined, HeartOutlined } from '@ant-design/icons';
import { fetchProfile, updateName, updateEmail, updatePassword } from '../redux/slices/userSlice';
import Loader from '../components/Loader';
import Title from '../components/Title';
import WishList from '../components/WishList';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
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
          placeholder: t('profile.forms.updateName.placeholder'),
          value: name,
          onChange: (e) => setName(e.target.value),
        },
      ],
      buttonText: t('profile.forms.updateName.buttonText'),
    },
    {
      onSubmit: (e) => {
        e.preventDefault();
        dispatch(updateEmail(email));
      },
      inputs: [
        {
          type: 'email',
          placeholder: t('profile.forms.updateEmail.placeholder'),
          value: email,
          onChange: (e) => setEmail(e.target.value),
        },
      ],
      buttonText: t('profile.forms.updateEmail.buttonText'),
    },
    {
      onSubmit: (e) => {
        e.preventDefault();
        dispatch(updatePassword({ password, newPassword }));
      },
      inputs: [
        {
          type: 'password',
          placeholder: t('profile.forms.updatePassword.currentPasswordPlaceholder'),
          value: password,
          onChange: (e) => setPassword(e.target.value),
        },
        {
          type: 'password',
          placeholder: t('profile.forms.updatePassword.newPasswordPlaceholder'),
          value: newPassword,
          onChange: (e) => setNewPassword(e.target.value),
        },
      ],
      buttonText: t('profile.forms.updatePassword.buttonText'),
    },
  ];

  const renderProfileSettings = () => (
    <div className="bg-white p-8 w-full">
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
            className="w-full p-2 bg-mainColor text-white font-medium text-xl futura"
            disabled={isUserLoading}>
            {isUserLoading ? t('profile.forms.loading') : form.buttonText}
          </button>
        </form>
      ))}
    </div>
  );

  if (isUserLoading) {
    return <Loader />;
  }

  if (!user) {
    return <div>{t('profile.forms.noUserData')}</div>;
  }

  const items = [
    {
      key: '1',
      label: (
        <span className="text-mainColor flex items-center gap-2">
          <HeartOutlined />
          {t('profile.tabs.wishlist')}
        </span>
      ),
      children: <WishList />,
    },
    {
      key: '2',
      label: (
        <span className="text-mainColor flex items-center gap-2">
          <UserOutlined />
          {t('profile.tabs.settings')}
        </span>
      ),
      children: renderProfileSettings(),
    },
  ];

  return (
    <div className="min-h-[95.5vh] flex flex-col items-center p-4">
      <div className="text-3xl mb-6 text-center">
        <Title text1={t('profile.title.text1')} text2={t('profile.title.text2')} />
      </div>
      <div className="w-[90%] sm:max-w-[1000px] futura">
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                inkBarColor: '#A52A95', // Цвет линии под активным табом
              },
            },
          }}>
          <Tabs defaultActiveKey="1" items={items} className="bg-white p-4" />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Profile;
