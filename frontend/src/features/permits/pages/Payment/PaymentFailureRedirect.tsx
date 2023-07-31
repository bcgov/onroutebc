import { useParams } from "react-router";

export const PaymentFailureRedirect = () => {
  const { msg } = useParams();
  return (
    <div>{msg}</div>
  );
};
