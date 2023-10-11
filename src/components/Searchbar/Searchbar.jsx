import { Field,  Formik } from 'formik';
import { StyledForm } from './Searchbar.styled';

export const Searchbar = ({ onSubmit }) => {

  const handleSubmit = (value, actions) => {
    onSubmit(value.title);
    actions.resetForm();
  };

  return (
   
      <Formik initialValues={{ title: '' }} onSubmit={handleSubmit}>
        <StyledForm>
          <button type="submit" className='button'>
            <span className="button-label"></span>
          </button>
          <Field
            type="text"
            name="title"
            className="input"
            placeholder="Search images and photos"
          />
        </StyledForm>
      </Formik>
    
  );
};