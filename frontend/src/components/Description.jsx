import React from 'react';

const Description = () => {
  const productDetails = {
    id: '329',
    carats: 0.57,
    clarity: 'SI1',
    purity: 750,
    color: 'H',
    weight: 2.3,
    metal: 'White Gold',
    cutForm: 'Princess',
    style: 'Solitaire',
  };

  const detailsArray = [
    { label: 'ID', value: productDetails.id },
    { label: 'Ring Style', value: productDetails.style },
    { label: 'Cut Form', value: productDetails.cutForm },
    { label: 'Metal', value: productDetails.metal },
    { label: 'Color', value: productDetails.color },
    { label: 'Purity', value: productDetails.purity },
    { label: 'Clarity', value: productDetails.clarity },
    { label: 'Weight', value: productDetails.weight },
    { label: 'Diamond', value: `${productDetails.carats} ct` },
  ];

  return (
    <div className="flex flex-col gap-4 border px-6 text-sm text-gray-500 futura">
      <table className="w-full table-fixed border-collapse text-left text-gray-700">
        <tbody>
          {detailsArray.map((detail, index) => (
            <tr key={index} className={index !== detailsArray.length - 1 ? 'border-b' : ''}>
              <td className="py-2 font-semibold">{detail.label}</td>
              <td className="border-l pl-4 py-2">{detail.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Description;
