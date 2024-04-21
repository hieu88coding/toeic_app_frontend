import React, { useState, useEffect } from 'react';

const ImageSearch = ({ searchWord }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const searchImage = async () => {
            const accessKey = 'tWM5noy5GMLq3EiWbhJhUqLZ8-cjBafPDSm-oYjuZyA';
            //const searchQuery = 'campus';
            const apiUrl = `https://api.unsplash.com/search/photos?client_id=${accessKey}&query=${searchWord}&per_page=1`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                const imageResult = data.results[0].urls.regular;
                setImageUrl(imageResult);
            } catch (error) {
                console.error('Error searching image:', error);
            }
        };

        searchImage();
    }, []);

    return (
        <div>
            {imageUrl && <img src={imageUrl} alt="Search Result" />}
        </div>
    );
};

export default ImageSearch;