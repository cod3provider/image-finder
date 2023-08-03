import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Container from "./components/Container/Container.jsx";
import Searchbar from "./components/Searchbar/Searchbar.jsx";
import ImageGallery from "./components/ImageGallery/ImageGallery.jsx";
import Modal from "./components/Modal/Modal.jsx";
import Button from "./components/Button/Button.jsx";
import Loader from "./components/Loader/Loader.jsx";

import { getImages, pictureValues } from './services/images-api';

const App = () => {
    const [images, setImages] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [largeImageURL, setLargeImageURL] = useState("");
    const [tags, setTags] = useState("");
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!search) {
            return;
        }
        const renderGallery = async () => {
            try {
                setIsLoading(true);
                const { hits, totalHits } = await getImages(search, page);
                const newPictures = pictureValues(hits);
                if (newPictures.length === 0) {
                    toast.warn("We can't find any images");
                }
                if (page === 1) {
                    setTotalPages(Math.ceil(totalHits / 12));
                }
                setImages(prevImages => [...prevImages, ...newPictures]);
            }
            catch (error) {
                toast.error('Ooooooops. Something must have gone wrong. Try again later.');
            }
            finally {
                setIsLoading(false);
            }
        }

        renderGallery();

    }, [search, page]);

    const searchImages = search => {
        setSearch(search);
        setImages([]);
        setPage(1);
    }

    const onLoadMore = () => {
        setPage(prevPage => prevPage + 1)
    }

    const openModal = (largeImageURL, tags) => {
        setLargeImageURL(largeImageURL);
        setTags(tags);
        toggleModal();
    }

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const closeModal = e => {
        if (e.target === e.currentTarget || e.code === 'Escape') {
            toggleModal();
        }
    }

    const canLoadMore = images.length !== 0 && !isLoading && page !== totalPages;

    return (
        <Container>
            <Searchbar onSubmit={searchImages}/>
            <ImageGallery images={images} onOpenModal={openModal} />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {isLoading && <Loader />}
            {canLoadMore && <Button text='Load more' onClick={onLoadMore} />}
            {showModal && (
                <Modal
                    largeImage={largeImageURL}
                    alt={tags}
                    closeModal={closeModal}
                />
            )}
        </Container>
    )
}

export default App;
