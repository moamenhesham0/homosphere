import { apiRequest } from './apiClient';

export const mediaApi = {
    uploadFile(file, token) {
        const formData = new FormData();
        formData.append('file', file);

        return apiRequest('/api/media/upload', {
            method: 'POST',
            token,
            body: formData,
        });
    },

    getPhotoUrl(photoId) {
        return apiRequest('/api/media/photo', {
            query: {
                id: photoId,
            },
        });
    },
};

