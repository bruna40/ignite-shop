import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product";
import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from "next";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";
import axios from "axios";
import { useState } from "react";
import Head from "next/head";

interface ProductProps {
  product: {
    id: string;
    title: string;
    price: string;
    image: string;
    defaultPriceId: string;
  };
};

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);

  async function handleBuyProduct() {
    try{
      setIsCreatingCheckoutSession(true);
      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch(err) {
      setIsCreatingCheckoutSession(false);
      alert('Erro ao realizar compra!')
    }
}

  return (
    <>
      <Head>
      <title>{product.title}| Ignite Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image src={product.image} width={520} height={480} alt={""} />
        </ImageContainer>
        <ProductDetails>
          <h1>{product.title}</h1>
          <span>{product.price}</span>
          <button
            onClick={handleBuyProduct}
            disabled={isCreatingCheckoutSession}
          >Comprar</button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{
      params: {
        id: 'prod_N6RgQPQnzGHTC5',
      }
    }],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<any, {id: string}> = async ({ params }) => {
  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  });

  const price = product.default_price as Stripe.Price;
  return {
    props: {
      product: {
        id: product.id,
        title: product.name,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price.unit_amount / 100),
        image: product.images[0],
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, //1 hour
  }
}