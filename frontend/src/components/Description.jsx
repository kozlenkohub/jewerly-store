import React from 'react';

const Description = ({ _id, style, cutForm, metal, color, purity, clarity, weight, carats }) => {
  const detailsArray = [
    { label: 'ID', value: _id.slice(-6) },
    { label: 'Ring Style', value: style },
    { label: 'Cut Form', value: cutForm.name },
    { label: 'Metal', value: metal.name },
    { label: 'Color', value: color },
    { label: 'Purity', value: purity },
    { label: 'Clarity', value: clarity },
    { label: 'Weight', value: weight },
    { label: 'Diamond', value: carats ? `${carats} ct` : undefined },
  ].filter((detail) => detail.value !== undefined);

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
