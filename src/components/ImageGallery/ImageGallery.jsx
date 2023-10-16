import React, { useState, useEffect } from 'react';
import { Button } from 'components/Button/Button';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';
import { getImg } from 'services/api';
import { GalleryList } from './ImageGallery.styled';

const ImageGallery = ({ value }) => {
  const [images, setImages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [isLoad, setIsLoad] = useState(false);
  const [pages, setPages] = useState(1);
  const [viewImage, setViewImage] = useState('');

  useEffect(() => {
    if (value) {
      setImages([]);
      setStatus('pending');
      setPages(1);
      setIsLoad(true);
      fetchImages(value, 1);
    }
  }, [value]);

  useEffect(() => {
    if (pages > 1) {
      fetchImages(value, pages);
    }
  }, [value, pages]);

  const onLoadMore = () => {
    setPages(prevPages => prevPages + 1);
  };

  const onImageClick = id => {
    const viewImage = images.find(img => img.id === id);
    setViewImage(viewImage);
    setModalIsOpen(true);
  };

  const onCloseModal = () => {
    setModalIsOpen(false);
  };

  const fetchImages = async (value, pages) => {
    try {
      const images = await getImg(value, pages);
  
      if (images.status === 200) {
        const newImages = images.data.hits.slice(0, 12);
        setImages(prevImages => [...prevImages, ...newImages]);
        setStatus('resolved');
        setIsLoad(pages < Math.ceil(images.data.totalHits / 12));
      } else {
        return Promise.reject('Error');
      }
    } catch (error) {
      setStatus('error');
      console.log(error);
    }
  };
  

  const shouldRenderLoadMoreButton = images.length > 0 && isLoad;

  if (status === 'pending') {
    return <Loader />;
  }

  if (status === 'resolved' && images.length > 0) {
    return (
      <>
        <GalleryList className="gallery">
          {images.map(item => (
            <ImageGalleryItem
              data={item}
              key={item.id}
              onImageClick={onImageClick}
            />
          ))}
        </GalleryList>

        {shouldRenderLoadMoreButton && (
          <Button onLoadMore={onLoadMore} isLoad={isLoad} />
        )}

        {modalIsOpen && (
          <Modal viewImage={viewImage} onCloseModal={onCloseModal}>
            <img src={viewImage.largeImageURL} alt={viewImage.tags} />
          </Modal>
        )}
      </>
    );
  } else if (status === 'error') {
    return (
      <div>
        Oh, something went wrong (=. Try reloading the page and entering a new
        request
      </div>
    );
  }

  return null;
};

export default ImageGallery;
