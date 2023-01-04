import { HomeContainer, Product } from "../styles/pages/home";
import Image from 'next/image';

import { useKeenSlider } from 'keen-slider/react';

import camiseta1 from '../assets/camisetas/1.png';
import camiseta2 from '../assets/camisetas/2.png';
import camiseta3 from '../assets/camisetas/3.png';

import 'keen-slider/keen-slider.min.css';

import { stripe } from '../lib/stripe';
import { GetServerSideProps } from "next";
import Stripe from "stripe";


interface HomeProps {
  products: {
    id: string;
    title: string;
    price: number;
    image: string;
  }[];
}


export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    }
  });

  return (
    <HomeContainer ref={sliderRef} className='keen-slider'>
      {products.map(product => {
        return (
        <Product key={product.id}className='keen-slider__slide'>
          <Image src={product.image} width={520} height={400} alt="" />
          <footer>
          <strong>{product.title}</strong>
          <span>R$ {product.price}</span>
          </footer>
        </Product>
        )
      })}
    </HomeContainer>
  )
};

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  });

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price;
    return {
      id: product.id,
      title: product.name,
      price: price.unit_amount! / 100,
      image: product.images[0],
  }
});

  return {
    props: {
      products,
    }
  }
}