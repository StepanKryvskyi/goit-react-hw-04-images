import { Btn } from './Button.styled';

export const Button = ({ onLoadMore, isLoad }) => {
  return (
    <Btn type="button" onClick={onLoadMore} disabled={!isLoad}>
      Load more
    </Btn>
  );
};