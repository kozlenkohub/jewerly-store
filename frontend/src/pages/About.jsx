import React from 'react';
import Title from '../components/Title';
import { FaInfoCircle, FaCheckCircle, FaThumbsUp } from 'react-icons/fa';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="text-2xl text-center pt-8 border-t">
          <Title text1="About" text2="Us" />
        </div>
        <div className="my-10 flex flex-col md:flex-row gap-16">
          <img
            src="https://media.timeout.com/images/102035297/image.jpg"
            className="w-full md:max-w-[450px] text-mainColor"
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 futura">
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem qui, corporis
              natus magnam cumque laboriosam illo totam. Dolores, quae dolore dolorum, aut et optio
              quam aspernatur, eum blanditiis vel nesciunt. Rem totam voluptatibus voluptates qui
              ducimus optio, sunt amet maiores fuga quos veritatis praesentium excepturi autem cum
              tempore in dolor velit corrupti? Unde nisi eius cupiditate iusto adipisci ab
              recusandae error molestias ipsa reiciendis sed odio incidunt enim vitae tempora
              reprehenderit officiis commodi ipsum explicabo, aspernatur delectus voluptates.
              Deleniti tempora officia voluptas dolorum veniam mollitia velit nesciunt perferendis
              architecto unde pariatur explicabo aperiam eaque ipsam cumque, eum repellendus!
              Aliquid, ab.
            </p>
            <p className="">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum error, maiores nisi
              quaerat dolore quod adipisci quasi optio sequi minima quae tempora, illum
              perspiciatis? Quis vero quaerat sint iste quos dolorem asperiores perferendis. Ipsam
              veritatis sed dolorum nesciunt saepe quibusdam neque quo reprehenderit sint! Illo
              voluptate aut consectetur modi doloremque.
            </p>
            <b className="text-mainColor flex items-center gap-2 playfair">
              <FaInfoCircle /> Our mission
            </b>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ipsum vero natus
              incidunt libero nostrum dolore a! Quaerat sed dicta explicabo voluptate, architecto
              quam nesciunt ullam rerum ratione velit debitis repudiandae assumenda repellat tenetur
              facilis! Doloribus eos laborum sapiente nisi?
            </p>
          </div>
        </div>
        <div className="text-xl py-4">
          <Title text1="Why" text2="Choose us" />
        </div>
        <div className="flex flex-col md:flex-row text-sm mb-20">
          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b className="flex items-center gap-2">
              <FaCheckCircle /> Quality Assurance:
            </b>
            <p className="text-gray-600 futura">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore nostrum .
            </p>
          </div>
          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b className="flex items-center gap-2">
              <FaThumbsUp /> Convenience:
            </b>
            <p className="text-gray-600 futura">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore nostrum .
            </p>
          </div>
          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b className="flex items-center gap-2">
              <FaInfoCircle /> Exceptional Customer Service:
            </b>
            <p className="text-gray-600 futura">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore nostrum .
            </p>
          </div>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default About;
