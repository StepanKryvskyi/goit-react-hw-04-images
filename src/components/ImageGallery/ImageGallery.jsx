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
        setImages(prevImages => [...prevImages, ...images.data.hits]);
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
          <Modal
            viewImage={viewImage}
            onCloseModal={onCloseModal}
          >
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

// import { Button } from 'components/Button/Button';
// import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
// import { Loader } from 'components/Loader/Loader';
// import { Modal } from 'components/Modal/Modal';
// import { Component } from 'react';
// import { animateScroll } from 'react-scroll';
// import { getImg } from 'services/api';
// import { GalleryList } from './ImageGallery.styled';

// export class ImageGallery extends Component {
//   state = {
//     images: [],
//     modalIsOpen: false,
//     status: 'idle',
//     isLoad: false,
//     pages: 1,
//     viewImage: '',
//   };

//   componentDidUpdate(prevProps, prevState) {
//     if (prevProps.value !== this.props.value) {
//       this.setState({ images: [], status: 'pending', pages: 1, isLoad: true });
//       this.fetchImages(this.props.value, 1);
//     }
//     if (prevState.pages !== this.state.pages) {
//       this.fetchImages(this.props.value, this.state.pages);
//     }
//   }

//   onLoadMore = () => {
//     this.setState(prevState => ({ pages: prevState.pages + 1 }));
//     this.scrollToBottom();
//   };

//   onImageClick = id => {
//     this.setState({
//       viewImage: this.state.images.find(img => img.id === id),
//       modalIsOpen: true,
//     });
//   };

//   onCloseModal = () => {
//     this.setState({ modalIsOpen: false });
//   };

//   scrollToBottom = () => {
//     animateScroll.scrollToBottom({
//       duration: 1600,
//       delay: 10,
//       smooth: 'linear',
//     });
//   };

//   fetchImages = async (value, pages) => {
//     try {
//       const images = await getImg(value, pages);

//       if (images.status === 200) {
//         this.setState(prevState => ({
//           images: [...prevState.images, ...images.data.hits],
//           status: 'resolved',
//           isLoad: this.state.pages < Math.ceil(images.data.totalHits / 12),
//         }));
//       } else {
//         return Promise.reject('Error');
//       }
//     } catch (error) {
//       this.setState({ status: 'error', error: error });
//     }
//   };

//   render() {
//     const { images, status, modalIsOpen, isLoad } = this.state;
//     const { largeImageURL, tags } = this.state.viewImage;

    
//     const shouldRenderLoadMoreButton = images.length > 0 && isLoad;

//     if (status === 'pending') {
//       return <Loader />;
//     }

//     if (status === 'resolved' && images.length > 0) {
//       return (
//         <>
//           <GalleryList className="gallery">
//             {images.map(item => (
//               <ImageGalleryItem
//                 data={item}
//                 key={item.id}
//                 onImageClick={this.onImageClick}
//               />
//             ))}
//           </GalleryList>

          
//           {shouldRenderLoadMoreButton && (
//             <Button onLoadMore={this.onLoadMore} isLoad={isLoad} />
//           )}

//           {modalIsOpen && (
//             <Modal
//               viewImage={this.state.viewImage}
//               onCloseModal={this.onCloseModal}
//             >
//               <img src={largeImageURL} alt={tags} />
//             </Modal>
//           )}
//         </>
//       );
//     } else if (status === 'error') {
//       return (
//         <div>
//           Oh, something went wrong (=. Try reloading the page and entering a new
//           request
//         </div>
//       );
//     }
//   }
// }
