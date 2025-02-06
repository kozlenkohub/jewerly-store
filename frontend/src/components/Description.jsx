import React from 'react';
import { useTranslation } from 'react-i18next';

const Description = ({ _id, style, cutForm, metal, color, purity, clarity, weight, carats }) => {
  const { t } = useTranslation();

  const detailsArray = [
    { label: t('description.labels.id'), value: _id.slice(-6) },
    { label: t('description.labels.ringStyle'), value: style },
    { label: t('description.labels.cutForm'), value: cutForm.name },
    { label: t('description.labels.metal'), value: metal.name },
    { label: t('description.labels.color'), value: color },
    { label: t('description.labels.purity'), value: purity },
    { label: t('description.labels.clarity'), value: clarity },
    { label: t('description.labels.weight'), value: weight },
    { label: t('description.labels.diamond'), value: carats ? `${carats} ct` : undefined },
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
