import { styled } from "../styles";

const Button = styled("button", {
  backgroundColor: "$green500",
  border: "1px solid #000",
  borderRadius: "4px",

  });

export default function Home() {
  return (
    <Button>Enviar</Button>
  )
};
