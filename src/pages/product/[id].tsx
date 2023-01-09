import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product";
import Image from 'next/image';
import camiseta1 from '../../assets/camisetas/1.png';
import { GetStaticProps } from "next";

export default function Product() {
  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={camiseta1} alt={""} />
      </ImageContainer>
      <ProductDetails>
        <h1>Camiseta 1</h1>
        <span>R$ 79,90</span>
        <button>Comprar</button>
      </ProductDetails>
    </ProductContainer>
  )
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 60 * 60 * 1, //1 hour
  }
}