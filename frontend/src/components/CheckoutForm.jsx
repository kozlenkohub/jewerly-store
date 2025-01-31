import React from 'react';
import Title from './Title';

const CheckoutForm = ({ formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
      <div className="text-xl sm:text-2xl my-2">
        <Title text1={'Delivery'} text2={'Information'} />
      </div>
      <div className="flex gap-3 ">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="First name"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="Last name"
        />
      </div>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        placeholder="Email"
      />
      <div className="flex gap-3">
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="Street"
        />
        <input
          type="text"
          name="apartament"
          value={formData.apartament}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="Apartament"
        />
      </div>
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleInputChange}
        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        placeholder="Country"
      />
      <div className="flex gap-3 ">
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="City"
        />
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="Zip code"
        />
      </div>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        placeholder="Phone"
      />
    </div>
  );
};

export default CheckoutForm;
