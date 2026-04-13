export const getImageUrl = (img, API) => {
    if (!img) return "/no-image.png";

    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return `${API}${img}`;

    return `${API}/${img}`;
};