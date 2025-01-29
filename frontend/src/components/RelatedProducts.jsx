import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const RelatedProducts = () => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchRelatedProducts = async () => {
      const data = [
        {
          _id: '679971f1e0b574d8c7b6ae07',
          name: 'Серьги с бриллиантами в огранке «Круг» из белого золота',
          image: [
            'https://apsen-diamond.com.ua/image/cachewebp/catalog/1565/1ng95apsen1565-1000x1000.webp',
            'https://apsen-diamond.com.ua/image/cachewebp/catalog/947/2ng95apsen947-1000x1000.webp',
          ],
          category: '6797b7419efe656b1d2bbd8e',
          metal: 'white gold',
          cutForm: 'round',
          collection: 'Серьги',
          price: 160000,
          discount: 20,
          bestseller: true,
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam cumque doloribus voluptas assumenda corrupti dignissimos laudantium numquam et. Velit ex recusandae quaerat ducimus officia rerum, neque ratione repudiandae porro. Facere, optio unde velit assumenda quidem numquam. Ipsum voluptatibus ad quasi suscipit sequi consectetur commodi numquam nulla voluptates iste odio ',
          size: [15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5],
          isAvailable: true,
          __v: 0,
          createdAt: '2025-01-29T00:10:25.575Z',
          updatedAt: '2025-01-29T00:10:25.575Z',
        },
      ];
      setRelated(data);
    };

    fetchRelatedProducts();
  }, []);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={'Related'} text2={'Prodcuts'} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 text-center">
        {related && related.map((product, index) => <ProductItem key={index} {...product} />)}
      </div>
    </div>
  );
};

export default RelatedProducts;
