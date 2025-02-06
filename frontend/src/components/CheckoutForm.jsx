import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Title from './Title';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';

const CheckoutForm = ({ formData, setFormData }) => {
  const { t } = useTranslation();
  const countries = useMemo(() => countryList().getData(), []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleCountryChange = (option) => {
    setFormData({ ...formData, country: option.label });
  };

  return (
    <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
      <div className="text-xl sm:text-2xl my-2">
        <Title text1={t('checkoutForm.title.text1')} text2={t('checkoutForm.title.text2')} />
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder={t('checkoutForm.fields.firstName')}
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder={t('checkoutForm.fields.lastName')}
        />
      </div>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        placeholder={t('checkoutForm.fields.email')}
      />
      <div className="flex gap-3">
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder={t('checkoutForm.fields.street')}
        />
        <input
          type="text"
          name="apartament"
          value={formData.apartament}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder={t('checkoutForm.fields.apartment')}
        />
      </div>
      <Select
        options={countries}
        value={countries.find((option) => option.label === formData.country)}
        onChange={handleCountryChange}
        placeholder={t('checkoutForm.fields.country')}
        className="w-full"
        classNames={{
          control: (state) =>
            'border border-gray-300 rounded py-0.5 px-2 !min-h-[38px] !shadow-none' +
            (state.isFocused ? ' border-gray-400' : ''),
          input: () => '!m-0 !p-0',
          valueContainer: () => '!p-0',
          singleValue: () => '!m-0',
        }}
      />
      <div className="flex gap-3">
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder={t('checkoutForm.fields.city')}
        />
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder={t('checkoutForm.fields.zipCode')}
        />
      </div>
      <div className="relative">
        <PhoneInput
          country={'us'}
          value={formData.phone}
          onChange={handlePhoneChange}
          containerClass="!w-full"
          inputClass="!w-full !h-[38px] !text-base !font-normal !border !border-gray-300 !rounded !py-1.5 !pl-12 !pr-3.5"
          buttonClass="!border-gray-300 !rounded-l !h-[38px]"
          dropdownClass="!rounded !shadow-lg"
          searchClass="!py-1.5 !px-3.5 !border !border-gray-300 !rounded !mt-1"
          inputProps={{
            name: 'phone',
            required: true,
          }}
        />
      </div>
    </div>
  );
};

export default CheckoutForm;
